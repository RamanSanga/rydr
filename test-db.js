const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users:", users);

  const locations = await prisma.driverLocation.findMany();
  console.log("DriverLocations:", locations);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
