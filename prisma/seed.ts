import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Rydr database...");

  // Upsert a default Aria Chen user profile
  const aria = await prisma.user.upsert({
    where: { email: "aria.chen@figma.com" },
    update: {},
    create: {
      id: "user_aria_chen_default",
      name: "Aria Chen",
      email: "aria.chen@figma.com",
      role: "rider",
    },
  });

  // Seed her travel dispatches
  await prisma.ride.createMany({
    data: [
      {
        pickup: "Figma Office, SOMA",
        destination: "Chai Cafe Spot, Downtown",
        rideType: "economy",
        status: "Completed",
        userId: aria.id,
      },
      {
        pickup: "Home, Orchard Road",
        destination: "SFO Airport Terminal 2",
        rideType: "premium",
        status: "Completed",
        userId: aria.id,
      },
      {
        pickup: "Home, Orchard Road",
        destination: "Figma Office, SOMA",
        rideType: "economy",
        status: "Driver Assigned",
        userId: aria.id,
      },
      {
        pickup: "AURA Restaurant Entrance",
        destination: "Home, Orchard Road",
        rideType: "xl",
        status: "On The Way",
        userId: aria.id,
      },
      {
        pickup: "Figma Office, SOMA",
        destination: "Home, Orchard Road",
        rideType: "premium",
        status: "Requested",
        userId: aria.id,
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
