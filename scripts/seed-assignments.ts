import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// One assignment per project (matching the 15 projects in lib/data.ts)
const assignmentsData = [
  { projectId: 1, title: "LED Traffic Light Simulation", description: "Build a working traffic light system using Arduino and LEDs. Submit your .ino code file and a short video/photo of it working.", dueDate: new Date("2026-06-01") },
  { projectId: 2, title: "Line Follower Sensor Calibration", description: "Calibrate the IR sensors for your line follower robot. Submit your calibration code and a chart of sensor readings.", dueDate: new Date("2026-06-08") },
  { projectId: 3, title: "Ultrasonic Distance Logger", description: "Program the ultrasonic sensor to log distances to the Serial Monitor. Submit the code and a screenshot of the serial output.", dueDate: new Date("2026-06-15") },
  { projectId: 4, title: "Servo Motor Control Report", description: "Write a program to sweep a servo motor from 0 to 180 degrees. Submit your code and a short explanation of how PWM works.", dueDate: new Date("2026-06-22") },
  { projectId: 5, title: "Bluetooth RC Car Sketch", description: "Program your robot to respond to Bluetooth commands (F/B/L/R). Submit the final .ino file and your Android app config.", dueDate: new Date("2026-06-29") },
  { projectId: 6, title: "Obstacle Avoider Logic Write-up", description: "Document the decision-making logic for your obstacle-avoiding robot. Include a flowchart and your final code.", dueDate: new Date("2026-07-06") },
  { projectId: 7, title: "Autonomous Line Follower Submission", description: "Submit your final line follower code that completes a full track. Include a video of the robot completing the course.", dueDate: new Date("2026-07-13") },
  { projectId: 8, title: "Motor Driver & Encoder Report", description: "Document how you wired and programmed the motor driver with encoder feedback. Submit wiring diagram + code.", dueDate: new Date("2026-07-20") },
  { projectId: 9, title: "PID Controller Implementation", description: "Implement a PID controller for stable line following. Submit your code with the Kp, Ki, Kd values you tuned and why.", dueDate: new Date("2026-07-27") },
  { projectId: 10, title: "IoT Sensor Dashboard", description: "Connect your sensor data to a web dashboard using Arduino + WiFi. Submit the code and a screenshot of the live dashboard.", dueDate: new Date("2026-08-03") },
  { projectId: 11, title: "Robotic Arm Control Sketch", description: "Program the robotic arm to pick and place an object. Submit the code and a short video demonstration.", dueDate: new Date("2026-08-10") },
  { projectId: 12, title: "Voice Control Integration", description: "Integrate voice commands into your robot using Bluetooth + a voice recognition app. Submit code and a demo video.", dueDate: new Date("2026-08-17") },
  { projectId: 13, title: "Computer Vision Color Tracking", description: "Use OpenCV to track a colored object and control your robot accordingly. Submit your Python script and a video.", dueDate: new Date("2026-08-24") },
  { projectId: 14, title: "Swarm Robotics Simulation", description: "Write a simulation (in Python or Processing) demonstrating swarm behavior. Submit the code and a 1-page write-up.", dueDate: new Date("2026-08-31") },
  { projectId: 15, title: "Final Capstone Project Report", description: "Submit your complete capstone project documentation including circuit diagrams, code, and a 3-minute demo video.", dueDate: new Date("2026-09-07") },
];

async function main() {
  console.log("Seeding assignments...");

  for (const a of assignmentsData) {
    // Check project exists first
    const project = await prisma.project.findUnique({ where: { id: a.projectId } });
    if (!project) {
      console.warn(`⚠️  Project ID ${a.projectId} not found — run seed-projects.ts first!`);
      continue;
    }

    await prisma.assignment.upsert({
      where: { id: `assignment-project-${a.projectId}` },
      update: {
        title: a.title,
        description: a.description,
        dueDate: a.dueDate,
      },
      create: {
        id: `assignment-project-${a.projectId}`,
        title: a.title,
        description: a.description,
        dueDate: a.dueDate,
        projectId: a.projectId,
      },
    });
    console.log(`✓ Assignment seeded: ${a.title}`);
  }

  console.log("✅ All assignments seeded!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
