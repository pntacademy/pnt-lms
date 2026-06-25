const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const grade = await prisma.schoolGrade.findUnique({
      where: { id: 'cmqm6qwzf00016ymiyq4ixx6p', schoolId: 'cmqm6qkxv00006ymixlvj0k3b' }
    });
    console.log(grade);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
