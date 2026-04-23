import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { projectsData } from "../lib/data";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Start seeding ${projectsData.length} projects...`);
  
  for (const project of projectsData) {
    const existing = await prisma.project.findUnique({
      where: { id: project.id }
    });

    if (!existing) {
      await prisma.project.create({
        data: {
          id: project.id,
          title: project.title,
          objective: project.objective,
          components: project.components,
          programs: project.programs,
          iconType: project.iconType,
        }
      });
      console.log(`Created project: ${project.title}`);
    } else {
      await prisma.project.update({
        where: { id: project.id },
        data: {
          title: project.title,
          objective: project.objective,
          components: project.components,
          programs: project.programs,
          iconType: project.iconType,
        }
      });
      console.log(`Updated project: ${project.title}`);
    }
  }
  
  console.log(`Seeding finished.`);
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
