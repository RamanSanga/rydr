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
      driverId: userId,
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
        in: ["Accepted", "Driver Arriving", "On Trip"],
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

  // Update Ride status to "Accepted"
  const ride = await prisma.ride.update({
    where: { id: rideId },
    data: {
      status: "Accepted",
    },
  });

  revalidatePath("/driver");
  revalidatePath("/driver/rides");
  revalidatePath("/rider");
  revalidatePath("/rides");

  return { success: true, ride };
}

// 4.5 Decline a ride request
export async function rejectRideAction(rideId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Please sign in first.");
  }

  // Update Ride status to "Cancelled"
  const ride = await prisma.ride.update({
    where: { id: rideId },
    data: {
      status: "Cancelled",
      driverId: null, // Free it up in case we want to re-route later, but for now it's cancelled
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

// 5.5 Update intermediate ride status
export async function updateRideStatusAction(rideId: string, newStatus: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const ride = await prisma.ride.update({
    where: { id: rideId },
    data: { status: newStatus },
  });

  revalidatePath("/driver");
  revalidatePath("/driver/rides");
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
      driverId: userId,
    },
  });

  // Calculate earnings dynamically in Indian Rupees (₹)
  const earningsSum = completed.reduce((sum, r) => {
    return sum + (r.fare ? r.fare : 0);
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
  const RADIUS_LIMIT_KM = 10;
  
  try {
    console.log("[getNearbyDrivers] Function start");

    if (!lat || !lng) {
      console.log("[getNearbyDrivers] Invalid coordinates");
      return { drivers: [], totalOnline: 0, totalWithinRadius: 0, radius: RADIUS_LIMIT_KM, error: "Invalid coordinates" };
    }

    // Fetch all online drivers (in a real app, use PostGIS, but for this demo, fetch all and calculate in memory)
    console.log("[getNearbyDrivers] Querying database for online drivers...");
    const onlineDrivers = await prisma.driverLocation.findMany({
      where: {
        isOnline: true,
      },
      include: {
        user: true,
      },
    });

    console.log(`[getNearbyDrivers] Prisma query result: found ${onlineDrivers.length} online drivers`);

    const R = 6371; // Radius of the earth in km
    
    console.log("================================================");
    console.log(`[RIDER SEARCH] Coordinates: Lat ${lat.toFixed(5)}, Lng ${lng.toFixed(5)}`);
    console.log(`[RIDER SEARCH] Found ${onlineDrivers.length} total online drivers globally.`);
    
    console.log("[getNearbyDrivers] Starting distance calculations...");
    const driversWithDistance = onlineDrivers.map(driver => {
      const dLat = (driver.latitude - lat) * (Math.PI / 180);
      const dLon = (driver.longitude - lng) * (Math.PI / 180);
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat * (Math.PI / 180)) * Math.cos(driver.latitude * (Math.PI / 180)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      const distanceKm = R * c;
      
      console.log(`[DRIVER CHECK] Driver ${driver.user?.name || driver.userId} at Lat ${driver.latitude.toFixed(5)}, Lng ${driver.longitude.toFixed(5)} -> Distance: ${distanceKm.toFixed(2)} km`);

      return {
        ...driver,
        distanceKm,
      };
    });

    console.log("[getNearbyDrivers] Starting radius filtering...");
    // Filter by realistic radius limit (10 km)
    const driversWithinRadius = driversWithDistance.filter(driver => driver.distanceKm <= RADIUS_LIMIT_KM);
    
    console.log(`[RIDER SEARCH] Drivers within ${RADIUS_LIMIT_KM}km radius limit: ${driversWithinRadius.length}`);
    console.log("================================================");

    // Sort by closest and limit to top 5
    const sortedDrivers = driversWithinRadius.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 5);

    console.log("[getNearbyDrivers] Return payload ready");
    return {
      drivers: sortedDrivers,
      totalOnline: onlineDrivers.length,
      totalWithinRadius: driversWithinRadius.length,
      radius: RADIUS_LIMIT_KM,
      error: null
    };
  } catch (error: any) {
    console.error("[getNearbyDrivers] EXCEPTION CAUGHT:", error);
    return {
      drivers: [],
      totalOnline: 0,
      totalWithinRadius: 0,
      radius: RADIUS_LIMIT_KM,
      error: error.message || "Unknown server error occurred"
    };
  }
}
