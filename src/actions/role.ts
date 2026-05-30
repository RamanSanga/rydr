"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function selectUserRole(role: "rider" | "driver") {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Please sign in to Rydr first.");
  }

  // Get the Clerk API Client asynchronously (Clerk v7 App Router convention)
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);
  const email = clerkUser.emailAddresses[0].emailAddress;
  const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Rydr User";

  // Write the selected role directly to Clerk publicMetadata
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      role,
    },
  });

  // Sync / Upsert User profile inside PostgreSQL
  await prisma.user.upsert({
    where: { id: userId },
    update: { name, email, role },
    create: { id: userId, name, email, role },
  });

  return { success: true };
}
