"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper to check if a user is an admin
async function isAdmin() {
  const { userId } = await auth();
  if (!userId) return false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user?.role === "admin";
}

export async function getAdminDashboardStats() {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }

  // 1. Total platform revenue (sum of fare of all rides where status is "Completed")
  const completedRides = await prisma.ride.findMany({
    where: { status: "Completed" },
    select: { fare: true },
  });
  const totalRevenue = completedRides.reduce((sum, ride) => sum + (ride.fare || 0), 0);

  // 2. Active rides count
  const activeRidesCount = await prisma.ride.count({
    where: {
      status: {
        in: ["Requested", "Accepted", "Driver Arriving", "On Trip"],
      },
    },
  });

  // 3. Active online drivers
  const activeOnlineDriversCount = await prisma.driverLocation.count({
    where: { isOnline: true },
  });

  // 4. Coupon usage indicators (number of rides where promoCodeId is not null)
  const couponUsageCount = await prisma.ride.count({
    where: {
      NOT: { promoCodeId: null },
    },
  });

  return {
    success: true,
    totalRevenue: Math.round(totalRevenue),
    activeRidesCount,
    activeOnlineDriversCount,
    couponUsageCount,
  };
}

export async function getAdminUsers() {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }

  const users = await prisma.user.findMany({
    include: {
      riderProfile: true,
      driverProfile: true,
    },
    orderBy: { name: "asc" },
  });

  return { success: true, users };
}

export async function getAdminRides() {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }

  const rides = await prisma.ride.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
      driver: {
        select: { name: true, email: true },
      },
      promoCode: {
        select: { code: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return { success: true, rides };
}

export async function getAdminReferrals() {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }

  const referrals = await prisma.referral.findMany({
    include: {
      referrer: {
        select: { name: true, email: true },
      },
      referredUser: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return { success: true, referrals };
}

export async function getAdminReviews() {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }

  const reviews = await prisma.review.findMany({
    include: {
      ride: {
        select: { pickup: true, destination: true },
      },
      rider: {
        select: { name: true },
      },
      driver: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return { success: true, reviews };
}

export async function toggleUserRoleAction(userId: string, newRole: string) {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  revalidatePath("/admin");
  return { success: true };
}
