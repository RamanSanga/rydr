"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { calculateFare, getRouteDistance } from "@/lib/data";

// Seed active requests in DB to ensure the dashboard is prefilled with realistic Indian ride offers
export async function seedAvailableRequests() {
  const count = await prisma.ride.count({
    where: {
      status: "Requested",
      driverId: null,
    },
  });

  if (count > 0) return;

  // Find any rider in the database, or create a mock rider
  let rider = await prisma.user.findFirst({
    where: {
      role: "rider",
    },
  });

  if (!rider) {
    rider = await prisma.user.create({
      data: {
        id: "mock_rider_ananya",
        name: "Ananya Rao",
        email: "ananya.rao@rydr.com",
        role: "rider",
      },
    });
  }

  const initialRequests = [
    {
      pickup: "IGI Airport Terminal 3, New Delhi, Delhi",
      destination: "DLF Cyber City, Gurugram, Haryana",
      rideType: "premium",
      status: "Requested",
      createdAt: new Date(),
    },
    {
      pickup: "Gurugram Sector 29, Haryana",
      destination: "Noida Sector 18, Uttar Pradesh",
      rideType: "economy",
      status: "Requested",
      createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
    },
    {
      pickup: "New Delhi Railway Station, Delhi",
      destination: "Connaught Place, New Delhi, Delhi",
      rideType: "xl",
      status: "Requested",
      createdAt: new Date(Date.now() - 12 * 60 * 1000), // 12 mins ago
    },
  ];

  await prisma.ride.createMany({
    data: initialRequests.map((req) => ({
      pickup: req.pickup,
      destination: req.destination,
      rideType: req.rideType,
      status: req.status,
      userId: rider.id,
      createdAt: req.createdAt,
    })),
  });
}

// 1. Fetch all rides matching status "Requested" (available to accept)
export async function fetchAvailableRideRequests() {
  const { userId } = await auth();
  if (!userId) return [];

  // Seed requests to guarantee active operational queue on first load
  await seedAvailableRequests();

  return prisma.ride.findMany({
    where: {
      status: "Requested",
      driverId: null,
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
}

// 2. Fetch driver's active accepted dispatches ("Driver Assigned", "On The Way")
export async function fetchDriverActiveRides() {
  const { userId } = await auth();
  if (!userId) return [];

  return prisma.ride.findMany({
    where: {
      driverId: userId,
      status: {
        in: ["Driver Assigned", "On The Way"],
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
}

// 3. Fetch driver's completed rides
export async function fetchDriverCompletedRides() {
  const { userId } = await auth();
  if (!userId) return [];

  return prisma.ride.findMany({
    where: {
      driverId: userId,
      status: "Completed",
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
}

// 4. Accept a ride request
export async function acceptRideAction(rideId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Please sign in first.");
  }

  // Ensure Driver record exists in the PostgreSQL User table
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);
  const email = clerkUser.emailAddresses[0].emailAddress;
  const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Rydr Driver";
  const role = (clerkUser.publicMetadata.role as string) || "driver";

  await prisma.user.upsert({
    where: { id: userId },
    update: { name, email, role },
    create: { id: userId, name, email, role },
  });

  // Update Ride status to "Driver Assigned" and assign driverId
  const ride = await prisma.ride.update({
    where: { id: rideId },
    data: {
      status: "Driver Assigned",
      driverId: userId,
    },
  });

  revalidatePath("/driver");
  revalidatePath("/driver/rides");
  revalidatePath("/rider");
  revalidatePath("/rides");

  return { success: true, ride };
}

// 5. Complete an accepted ride
export async function completeRideAction(rideId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Please sign in first.");
  }

  // Update Ride status to "Completed"
  const ride = await prisma.ride.update({
    where: { id: rideId },
    data: {
      status: "Completed",
    },
  });

  revalidatePath("/driver");
  revalidatePath("/driver/rides");
  revalidatePath("/driver/earnings");
  revalidatePath("/rider");
  revalidatePath("/rides");

  return { success: true, ride };
}

// 6. Fetch driver statistics from actual PostgreSQL DB records (in Indian Rupees ₹)
export async function fetchDriverStats() {
  const { userId } = await auth();
  if (!userId) {
    return {
      todayEarnings: "₹0",
      activeRequestsCount: 0,
      completedRidesCount: 0,
      driverRating: "4.99 ★",
    };
  }

  // Fetch completed rides for this driver to sum up payouts
  const completed = await prisma.ride.findMany({
    where: {
      driverId: userId,
      status: "Completed",
    },
  });

  const activeRequestsCount = await prisma.ride.count({
    where: {
      status: "Requested",
      driverId: null,
    },
  });

  // Calculate earnings dynamically in Indian Rupees (₹)
  const earningsSum = completed.reduce((sum, r) => {
    const dist = getRouteDistance(r.pickup, r.destination);
    const fare = parseFloat(calculateFare(dist, r.rideType));
    return sum + (isNaN(fare) ? 0 : fare);
  }, 0);

  return {
    todayEarnings: `₹${earningsSum.toLocaleString("en-IN")}`,
    activeRequestsCount,
    completedRidesCount: completed.length,
    driverRating: "4.99 ★",
  };
}

// 7. Update Driver Location (Real-time Polling)
export async function updateDriverLocation(latitude: number, longitude: number, isOnline: boolean) {
  const { userId } = await auth();
  if (!userId) return null;

  // Ensure Driver record exists in the PostgreSQL User table
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);
  const email = clerkUser.emailAddresses[0].emailAddress;
  const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Rydr Driver";
  const role = (clerkUser.publicMetadata.role as string) || "driver";

  await prisma.user.upsert({
    where: { id: userId },
    update: { name, email, role },
    create: { id: userId, name, email, role },
  });

  const location = await prisma.driverLocation.upsert({
    where: { userId },
    update: {
      latitude,
      longitude,
      isOnline,
    },
    create: {
      userId,
      latitude,
      longitude,
      isOnline,
    },
  });

  return location;
}

// 8. Get Nearby Online Drivers for Rider App
export async function getNearbyDrivers(lat: number, lng: number) {
  const { userId } = await auth();
  // We can return nearby drivers even if not authed, but let's just return
  if (!lat || !lng) return [];

  // Fetch all online drivers (in a real app, use PostGIS, but for this demo, fetch all and calculate in memory)
  const onlineDrivers = await prisma.driverLocation.findMany({
    where: {
      isOnline: true,
      // Ignore the rider themselves if they somehow have a driver account
      NOT: {
        userId: userId || undefined,
      }
    },
    include: {
      user: true,
    },
  });

  // Calculate distance (Haversine formula approximation)
  const R = 6371; // Radius of the earth in km
  
  const driversWithDistance = onlineDrivers.map(driver => {
    const dLat = (driver.latitude - lat) * (Math.PI / 180);
    const dLon = (driver.longitude - lng) * (Math.PI / 180);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat * (Math.PI / 180)) * Math.cos(driver.latitude * (Math.PI / 180)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distanceKm = R * c;
    
    return {
      ...driver,
      distanceKm,
    };
  });

  // Sort by closest and limit to top 5
  return driversWithDistance.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 5);
}
