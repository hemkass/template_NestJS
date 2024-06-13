const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const collections = await prisma.$queryRaw`db.getCollectionNames()`;
  for (const collection of collections) {
    await prisma.$executeRawUnsafe(`db.${collection}.drop()`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
