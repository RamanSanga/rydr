"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getNearbyDrivers } from "./driver";

export async function seedUserRides(userId: string) {
  const count = await prisma.ride.count({
    where: { userId },
  });
  if (count > 0) return;

  // Ensure the User record exists in the database to satisfy the foreign key constraint
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);
      const email = clerkUser.emailAddresses[0].emailAddress;
      const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Rydr User";
      const role = (clerkUser.publicMetadata.role as string) || "rider";

      await prisma.user.upsert({
        where: { id: userId },
        update: { name, email, role },
        create: { id: userId, name, email, role },
      });
    } catch (err) {
      console.error("Clerk User lookup failed during dynamic seed, preloading default profile:", err);
      await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          name: "Rydr User",
          email: `user_${userId}@rydr.com`,
          role: "rider",
        },
      });
    }
  }

  const initialTrips = [
    {
      pickup: "Figma Office, SOMA",
      destination: "Chai Cafe Spot, Downtown",
      rideType: "economy",
      status: "Completed",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      pickup: "Home, Orchard Road",
      destination: "SFO Airport Terminal 2",
      rideType: "premium",
      status: "Completed",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      pickup: "Home, Orchard Road",
      destination: "Figma Office, SOMA",
      rideType: "economy",
      status: "Driver Assigned",
      createdAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    },
    {
      pickup: "AURA Restaurant Entrance",
      destination: "Home, Orchard Road",
      rideType: "xl",
      status: "On The Way",
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
    },
    {
      pickup: "Figma Office, SOMA",
      destination: "Home, Orchard Road",
      rideType: "premium",
      status: "Requested",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    },
  ];

  await prisma.ride.createMany({
    data: initialTrips.map((trip) => ({
      pickup: trip.pickup,
      destination: trip.destination,
      rideType: trip.rideType,
      status: trip.status,
      userId,
      createdAt: trip.createdAt,
    })),
  });
}

export async function createRideAction(pickup: string, destination: string, rideType: string, pickupLat: number, pickupLng: number, fare: number) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Please sign in first.");
  }

  // Ensure the User record exists in the database
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);
  const email = clerkUser.emailAddresses[0].emailAddress;
  const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Rydr User";
  const role = (clerkUser.publicMetadata.role as string) || "rider";

  await prisma.user.upsert({
    where: { id: userId },
    update: { name, email, role },
    create: { id: userId, name, email, role },
  });

  // Find nearest online driver if coordinates are provided
  let assignedDriverId = null;
  let status = "Requested";
  
  if (pickupLat && pickupLng) {
    const nearbyDrivers = await getNearbyDrivers(pickupLat, pickupLng);
    if (nearbyDrivers.length > 0) {
      // Assign the closest one
      assignedDriverId = nearbyDrivers[0].userId;
    }
  }

  // Create the Ride
  const ride = await prisma.ride.create({
    data: {
      pickup,
      destination,
      rideType,
      fare,
      status,
      userId,
      driverId: assignedDriverId,
    },
  });

  revalidatePath("/rider");
  revalidatePath("/rides");
  revalidatePath("/driver");

  return { success: true, ride };
}

export async function updateRideStatus(rideId: string, newStatus: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const ride = await prisma.ride.update({
    where: { id: rideId },
    data: { status: newStatus },
  });

  revalidatePath("/rider");
  revalidatePath("/rides");
  revalidatePath("/driver");

  return { success: true, ride };
}

export async function fetchUserRides() {
  const { userId } = await auth();
  if (!userId) return [];

  // Seed on-the-fly if it's a new account to maintain high-fidelity aesthetics
  await seedUserRides(userId);

  return prisma.ride.findMany({
    where: { userId },
    include: { driver: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function fetchDriverRides() {
  const { userId } = await auth();
  if (!userId) return [];

  return prisma.ride.findMany({
    where: { driverId: userId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function fetchUserStats() {
  const { userId } = await auth();
  if (!userId) {
    return {
      walletBalance: "$45.00",
      rating: "4.95 ★",
      totalRides: 0,
      ecoRides: 0,
      savedTrees: 0,
    };
  }

  // Seed on-the-fly if needed
  await seedUserRides(userId);

  const rides = await prisma.ride.findMany({
    where: { userId },
  });

  const completed = rides.filter((r) => r.status === "Completed");
  const eco = completed.filter((r) => r.rideType === "economy");

  return {
    walletBalance: "$45.00", // Preloaded dummy balance
    rating: "4.95 ★",
    totalRides: completed.length,
    ecoRides: eco.length,
    savedTrees: Math.floor(eco.length * 1.5),
  };
}