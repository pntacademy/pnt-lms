"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
// @ts-ignore
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateTestFromPdf(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const file = formData.get("file") as File;
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || null;
    const courseId = formData.get("courseId") as string;

    if (!file || !title) {
      throw new Error("Missing required fields: file or title.");
    }

    if (file.type !== "application/pdf") {
      throw new Error("Invalid file type. Only PDF files are allowed.");
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error("File is too large. Maximum size is 10MB.");
    }

    // 1. Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfData = await pdfParse(buffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("Could not extract any text from the PDF.");
    }

    // 2. Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are an MCQ extraction system.
Extract all multiple-choice questions from the provided text.
Return ONLY valid JSON.

Schema:
[
  {
    "question": "",
    "optionA": "",
    "optionB": "",
    "optionC": "",
    "optionD": "",
    "correctAnswer": "MUST BE THE EXACT TEXT OF THE CORRECT OPTION, NOT THE LETTER",
    "marks": 1
  }
]

Do not return explanations.
Do not return markdown.
Do not return code blocks.
Return valid JSON only.
CRITICAL: 'correctAnswer' MUST be the exact, full text of the correct option. Do NOT use 'A', 'B', 'Option A', etc.

Text to extract from:
${extractedText}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean up potential markdown formatting if Gemini ignored the instruction
    let jsonString = responseText.trim();
    if (jsonString.startsWith("\`\`\`json")) {
      jsonString = jsonString.replace(/^\`\`\`json\n/, "").replace(/\n\`\`\`$/, "");
    } else if (jsonString.startsWith("\`\`\`")) {
      jsonString = jsonString.replace(/^\`\`\`\n/, "").replace(/\n\`\`\`$/, "");
    }

    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(jsonString);
    } catch (e) {
      console.error("Gemini Response parsing failed:", jsonString);
      throw new Error("AI returned malformed JSON. Please try a simpler PDF.");
    }

    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      throw new Error("No valid questions were extracted.");
    }

    // 3. Validation Layer
    const validQuestions = [];
    let totalMarks = 0;
    const seenQuestions = new Set();

    for (const q of parsedQuestions) {
      if (!q.question || !q.optionA || !q.optionB || !q.correctAnswer) {
        continue; // Skip malformed rows
      }

      const normalizedQ = q.question.trim().toLowerCase();
      if (seenQuestions.has(normalizedQ)) {
        continue; // Skip duplicates
      }
      seenQuestions.add(normalizedQ);

      const marks = parseInt(q.marks) || 1;
      totalMarks += marks;

      validQuestions.push({
        question: q.question.trim(),
        optionA: q.optionA.trim(),
        optionB: q.optionB.trim(),
        optionC: q.optionC?.trim() || "",
        optionD: q.optionD?.trim() || "",
        correctAnswer: q.correctAnswer.trim(),
        marks: marks,
      });
    }

    if (validQuestions.length === 0) {
      throw new Error("Extracted questions failed validation. Ensure they have at least 2 options and a correct answer.");
    }

    // 4. Save to Database
    const newTest = await prisma.test.create({
      data: {
        title,
        description,
        courseId: courseId || null,
        totalMarks,
        questions: {
          create: validQuestions,
        },
      },
    });

    revalidatePath("/dashboard/admin/tests");
    return { success: true, testId: newTest.id, count: validQuestions.length };

  } catch (error: any) {
    console.error("Test Generation Error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

// Fetch all tests
export async function getAllTests() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return prisma.test.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      course: { select: { title: true } },
      _count: { select: { questions: true } },
    },
  });
}

// Fetch single test with questions
export async function getTestById(testId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return prisma.test.findUnique({
    where: { id: testId },
    include: {
      course: { select: { title: true } },
      questions: { orderBy: { createdAt: "asc" } },
    },
  });
}

// Update a question
export async function updateQuestion(questionId: string, data: any) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const q = await prisma.question.update({
    where: { id: questionId },
    data: {
      question: data.question,
      optionA: data.optionA,
      optionB: data.optionB,
      optionC: data.optionC,
      optionD: data.optionD,
      correctAnswer: data.correctAnswer,
      marks: parseInt(data.marks) || 1,
    },
  });

  // Recalculate total marks for the test
  const testId = q.testId;
  const allQs = await prisma.question.findMany({ where: { testId } });
  const totalMarks = allQs.reduce((acc: number, curr: any) => acc + curr.marks, 0);

  await prisma.test.update({
    where: { id: testId },
    data: { totalMarks },
  });

  revalidatePath(`/dashboard/admin/tests/${testId}`);
  return { success: true };
}

// Delete a question
export async function deleteQuestion(questionId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const q = await prisma.question.delete({
    where: { id: questionId },
  });

  // Recalculate total marks
  const testId = q.testId;
  const allQs = await prisma.question.findMany({ where: { testId } });
  const totalMarks = allQs.reduce((acc: number, curr: any) => acc + curr.marks, 0);

  await prisma.test.update({
    where: { id: testId },
    data: { totalMarks },
  });

  revalidatePath(`/dashboard/admin/tests/${testId}`);
  return { success: true };
}

// Delete an entire test
export async function deleteTest(testId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.test.delete({
    where: { id: testId },
  });

  revalidatePath("/dashboard/admin/tests");
  return { success: true };
}

// Toggle Publish Status
export async function togglePublishTest(testId: string, isPublished: boolean) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.test.update({
    where: { id: testId },
    data: { isPublished },
  });

  revalidatePath("/dashboard/admin/tests");
  return { success: true };
}

// Student: Get Published Tests with their Submission Status
export async function getStudentTests() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const userId = session.user.id;

  const tests = await prisma.test.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    include: {
      course: { select: { title: true } },
      _count: { select: { questions: true } },
      submissions: {
        where: { userId },
        select: { score: true, totalMarks: true, createdAt: true },
      },
    },
  });

  return tests.map((test: any) => ({
    ...test,
    submission: test.submissions[0] || null,
  }));
}

// Student: Get Test for Exam (Strips correct answers)
export async function getStudentTestById(testId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const userId = session.user.id;

  const test = await prisma.test.findUnique({
    where: { id: testId, isPublished: true },
    include: {
      course: { select: { title: true } },
      questions: { orderBy: { createdAt: "asc" } },
      submissions: {
        where: { userId },
      },
    },
  });

  if (!test) throw new Error("Test not found or not published.");

  // Strip correct answers to prevent cheating
  const sanitizedQuestions = test.questions.map((q: any) => ({
    id: q.id,
    question: q.question,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    optionD: q.optionD,
    marks: q.marks,
  }));

  return {
    ...test,
    questions: sanitizedQuestions,
    submission: test.submissions[0] || null,
  };
}

// Student: Submit Test Attempt
export async function submitTestAttempt(testId: string, studentAnswers: Record<string, string>) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const userId = session.user.id;

  // Verify test exists and is published
  const test = await prisma.test.findUnique({
    where: { id: testId, isPublished: true },
    include: { questions: true },
  });

  if (!test) throw new Error("Test not found.");

  // Prevent multiple submissions
  const existing = await prisma.testSubmission.findUnique({
    where: { testId_userId: { testId, userId } },
  });

  if (existing) throw new Error("You have already submitted this test.");

  // Calculate score securely on the backend
  let score = 0;
  for (const q of test.questions) {
    const studentAnswer = studentAnswers[q.id];
    if (studentAnswer) {
      const studentText = studentAnswer.trim().toLowerCase();
      let correctText = q.correctAnswer.trim().toLowerCase();
      
      // If the AI or admin set the correct answer to just "A", "B", "C", or "D"
      if (correctText === "a" || correctText === "option a") correctText = q.optionA.trim().toLowerCase();
      if (correctText === "b" || correctText === "option b") correctText = q.optionB.trim().toLowerCase();
      if (correctText === "c" || correctText === "option c") correctText = q.optionC.trim().toLowerCase();
      if (correctText === "d" || correctText === "option d") correctText = q.optionD.trim().toLowerCase();

      if (studentText === correctText) {
        score += q.marks;
      }
    }
  }

  // Save the result
  const submission = await prisma.testSubmission.create({
    data: {
      testId,
      userId,
      score,
      totalMarks: test.totalMarks,
      answers: studentAnswers,
    },
  });

  revalidatePath("/dashboard/tests");
  revalidatePath(`/dashboard/tests/${testId}`);

  return { success: true, score, totalMarks: test.totalMarks };
}
