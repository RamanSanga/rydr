"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Create a notification (Internal helper called by other server actions)
export async function createNotification(userId: string, title: string, message: string, type: string) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type, // "RIDE" | "VERIFICATION" | "PROMO" | "REFERRAL"
      },
    });
    
    revalidatePath("/profile");
    revalidatePath("/rider");
    revalidatePath("/driver");
    revalidatePath("/rides");
    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}

// 2. Fetch all notifications for the active user
export async function fetchUserNotificationsAction() {
  const { userId } = await auth();
  if (!userId) return [];

  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

// 3. Fetch unread notifications count
export async function fetchUnreadNotificationsCountAction() {
  const { userId } = await auth();
  if (!userId) return 0;

  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
}

// 4. Mark a single notification as read
export async function markNotificationAsReadAction(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const notification = await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  revalidatePath("/profile");
  revalidatePath("/rider");
  revalidatePath("/driver");
  revalidatePath("/rides");
  return { success: true, notification };
}

// 5. Mark all notifications as read
export async function markAllNotificationsAsReadAction() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  revalidatePath("/profile");
  revalidatePath("/rider");
  revalidatePath("/driver");
  revalidatePath("/rides");
  return { success: true };
}
