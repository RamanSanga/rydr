"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getOnboardingState() {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      riderProfile: true,
      driverProfile: true,
    },
  });

  if (!user) {
    return { success: true, roleSelected: false, onboarded: false };
  }

  const roleSelected = !!user.role;
  let onboarded = false;

  if (user.role === "rider") {
    onboarded = true;
    // Repair/Auto-create RiderProfile if missing for existing database users
    if (!user.riderProfile) {
      await prisma.riderProfile.create({
        data: {
          userId,
          onboarded: true,
          phone: "+91 98765 43210",
          dob: "01/01/1990",
          language: "English",
        },
      });
    }
  } else if (user.role === "driver" && user.driverProfile) {
    onboarded = user.driverProfile.onboarded;
  }

  return {
    success: true,
    roleSelected,
    role: user.role,
    onboarded,
    riderProfile: user.riderProfile,
    driverProfile: user.driverProfile,
  };
}

export async function saveRiderOnboarding(data: {
  phone: string;
  dob: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  quietRide: boolean;
  acPreference: string;
  language: string;
  aadhaarUrl?: string;
  selfieUrl?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const riderProfile = await prisma.riderProfile.upsert({
    where: { userId },
    update: {
      ...data,
      onboarded: true,
    },
    create: {
      userId,
      ...data,
      onboarded: true,
    },
  });

  return { success: true, riderProfile };
}

export async function saveDriverOnboarding(data: {
  phone: string;
  address: string;
  aadhaarUrl: string;
  panUrl: string;
  selfieUrl: string;
  licenseUrl: string;
  licenseNumber: string;
  licenseExpiry: string;
  vehicleType: string;
  vehicleModel: string;
  vehicleNumber: string;
  rcUrl: string;
  insuranceUrl: string;
  permitUrl: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const driverProfile = await prisma.driverProfile.upsert({
    where: { userId },
    update: {
      ...data,
      verificationStatus: "Pending", // Reset to pending on submit
      onboarded: true,
    },
    create: {
      userId,
      ...data,
      verificationStatus: "Pending",
      onboarded: true,
    },
  });

  // Also create/update location entry to allow drivers to be online/offline later
  await prisma.driverLocation.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      latitude: 28.4595, // Default near NCR/Gurugram coordinates
      longitude: 77.0266,
      isOnline: false,
    },
  });

  return { success: true, driverProfile };
}

export async function updateRiderProfile(data: {
  name: string;
  phone: string;
  dob: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  quietRide: boolean;
  acPreference: string;
  language: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { name, ...profileData } = data;

  // Update user name
  await prisma.user.update({
    where: { id: userId },
    data: { name },
  });

  // Update rider profile
  await prisma.riderProfile.update({
    where: { userId },
    data: { ...profileData },
  });

  return { success: true };
}

export async function updateDriverProfile(data: {
  name: string;
  phone: string;
  address: string;
  vehicleModel: string;
  vehicleNumber: string;
  licenseNumber: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { name, ...profileData } = data;

  // Update user name
  await prisma.user.update({
    where: { id: userId },
    data: { name },
  });

  // Update driver profile
  await prisma.driverProfile.update({
    where: { userId },
    data: { ...profileData },
  });

  return { success: true };
}

// ── Admin Review Operations ──

export async function getAdminDrivers() {
  const drivers = await prisma.user.findMany({
    where: { role: "driver" },
    include: {
      driverProfile: true,
    },
  });

  return { success: true, drivers };
}

export async function getDriverProfileById(driverId: string) {
  const driver = await prisma.user.findUnique({
    where: { id: driverId },
    include: {
      driverProfile: true,
    },
  });

  return { success: true, driver };
}

export async function reviewDriverAction(
  driverId: string,
  status: "Approved" | "Rejected" | "Under Review",
  rejectionReason?: string
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const updatedProfile = await prisma.driverProfile.update({
    where: { userId: driverId },
    data: {
      verificationStatus: status,
      rejectionReason: status === "Rejected" ? rejectionReason : null,
    },
  });

  return { success: true, updatedProfile };
}
