"use server";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client } from "@/lib/r2";
import { auth } from "@/auth";

export async function getDownloadPresignedUrl(objectKey: string) {
  // 1. Verify the user is authenticated (Teacher or Admin)
  const session = await auth();
  const role = (session?.user as any)?.role;
  
  if (!session?.user || (role !== "ADMIN" && role !== "TEACHER")) {
    return { error: "Unauthorized" };
  }

  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  if (!bucketName) {
    return { error: "Cloudflare R2 Bucket Name is not configured" };
  }

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    // Generate the presigned URL for GET (expires in 15 minutes)
    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });

    return { 
        success: true, 
        presignedUrl 
    };
  } catch (error) {
    console.error("Error generating presigned download URL:", error);
    return { error: "Failed to generate download URL" };
  }
}
