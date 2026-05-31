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

export async function createRideAction(
  pickup: string,
  destination: string,
  rideType: string,
  pickupLat: number,
  pickupLng: number,
  fare: number,
  scheduledAtStr?: string,
  promoCodeId?: string
) {
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

  const scheduledAt = scheduledAtStr ? new Date(scheduledAtStr) : null;
  const isScheduled = !!scheduledAt;

  // Find nearest online driver if coordinates are provided and ride is not scheduled for future
  let candidateDriverIds: string[] = [];
  let assignedDriverId = null;
  let status = isScheduled ? "Scheduled" : "Requested";
  
  if (pickupLat && pickupLng && !isScheduled) {
    const response = await getNearbyDrivers(pickupLat, pickupLng);
    if (response.drivers && response.drivers.length > 0) {
      candidateDriverIds = response.drivers.map((d: any) => d.userId);
      assignedDriverId = candidateDriverIds[0];
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
      scheduledAt,
      candidateDrivers: candidateDriverIds.length > 0 ? JSON.stringify(candidateDriverIds) : null,
      currentDriverIndex: 0,
      offeredAt: assignedDriverId ? new Date() : null,
      promoCodeId: promoCodeId || null,
    },
  });

  // Notify the offered driver instantly (Phase 5)
  if (assignedDriverId) {
    const { createNotification } = await import("./notification");
    await createNotification(
      assignedDriverId,
      "🚖 New Ride Request Offered!",
      `New trip request near your coordinates. Vetted dispatch timer active: 15s.`,
      "RIDE"
    );
  }

  revalidatePath("/rider");
  revalidatePath("/rides");
  revalidatePath("/driver");

  return { success: true, ride };
}

// Check and advance offering to the next closest driver (Phase 3 Acceptance Timer)
export async function checkAndAdvanceRideOffer(rideId: string) {
  const ride = await prisma.ride.findUnique({
    where: { id: rideId },
  });

  if (!ride || ride.status !== "Requested" || !ride.candidateDrivers) {
    return { success: false, reason: "Ride not in active routing offering state." };
  }

  const candidateIds: string[] = JSON.parse(ride.candidateDrivers);
  const elapsedSeconds = Math.floor((Date.now() - new Date(ride.offeredAt || ride.createdAt).getTime()) / 1000);

  if (elapsedSeconds >= 15) {
    const nextIndex = ride.currentDriverIndex + 1;

    if (nextIndex < candidateIds.length) {
      // Offer to next closest driver
      const nextDriverId = candidateIds[nextIndex];
      const updated = await prisma.ride.update({
        where: { id: rideId },
        data: {
          driverId: nextDriverId,
          currentDriverIndex: nextIndex,
          offeredAt: new Date(),
        },
      });

      // Dispatch Notifications
      const { createNotification } = await import("./notification");
      await createNotification(
        nextDriverId,
        "🚖 New Ride Request Offered!",
        `New trip request near your coordinates. Vetted dispatch timer active: 15s.`,
        "RIDE"
      );

      revalidatePath("/rider");
      revalidatePath("/driver");
      return { success: true, advanced: true, ride: updated };
    } else {
      // No drivers accepted the ride
      const updated = await prisma.ride.update({
        where: { id: rideId },
        data: {
          status: "Cancelled",
          driverId: null,
        },
      });

      const { createNotification } = await import("./notification");
      await createNotification(
        ride.userId,
        "🚖 No Drivers Match",
        "We couldn't match any nearby drivers for your trip. Please request again.",
        "RIDE"
      );

      revalidatePath("/rider");
      revalidatePath("/driver");
      return { success: true, advanced: false, reason: "No more drivers available.", ride: updated };
    }
  }

  return { success: true, advanced: false, reason: "Offer timer active." };
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

// 7. Fetch full ride dispatches telemetry dynamically (Phase 3 & 4)
export async function fetchRideDetailsAction(rideId: string) {
  return prisma.ride.findUnique({
    where: { id: rideId },
    include: {
      driver: {
        include: {
          driverProfile: true,
          driverLocation: true,
        },
      },
      user: {
        include: {
          riderProfile: true,
        },
      },
    },
  });
}