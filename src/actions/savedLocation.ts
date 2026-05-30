"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function fetchSavedLocations() {
  const { userId } = await auth();
  if (!userId) return [];

  return prisma.savedLocation.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

export async function createSavedLocation(label: string, address: string, lat: number, lon: number) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Please sign in first.");
  }

  const location = await prisma.savedLocation.create({
    data: {
      label,
      address,
      lat,
      lon,
      userId,
    },
  });

  revalidatePath("/rider");
  return { success: true, location };
}

export async function deleteSavedLocation(id: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Please sign in first.");
  }

  await prisma.savedLocation.delete({
    where: { id, userId },
  });

  revalidatePath("/rider");
  return { success: true };
}
