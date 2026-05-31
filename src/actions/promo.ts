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

// 1. Admin: Create a promo code
export async function createPromoAction(code: string, discountType: "flat" | "percentage", discountValue: number, expiryDateStr: string, active: boolean = true) {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized: Only administrators can create promotion codes.");
  }

  const promo = await prisma.promoCode.create({
    data: {
      code: code.trim().toUpperCase(),
      discountType,
      discountValue,
      expiryDate: new Date(expiryDateStr),
      active,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true, promo };
}

// 2. Admin: Edit/Update a promo code
export async function updatePromoAction(id: string, code: string, discountType: "flat" | "percentage", discountValue: number, expiryDateStr: string, active: boolean) {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }

  const promo = await prisma.promoCode.update({
    where: { id },
    data: {
      code: code.trim().toUpperCase(),
      discountType,
      discountValue,
      expiryDate: new Date(expiryDateStr),
      active,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true, promo };
}

// 3. Admin: Delete a promo code
export async function deletePromoAction(id: string) {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }

  await prisma.promoCode.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

// 4. Fetch all promo codes (for Admin Panel)
export async function fetchPromosAction() {
  return prisma.promoCode.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// 5. Fetch active, non-expired promo codes (for Home page & Rider checkout)
export async function fetchActivePromosAction() {
  return prisma.promoCode.findMany({
    where: {
      active: true,
      expiryDate: {
        gte: new Date(),
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// 6. Validate and apply promo code, returning discount value
export async function validatePromoAction(code: string, estimatedFare: number) {
  const promo = await prisma.promoCode.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!promo) {
    return { success: false, message: "Invalid promo code." };
  }

  if (!promo.active) {
    return { success: false, message: "This promo code is no longer active." };
  }

  if (new Date(promo.expiryDate) < new Date()) {
    return { success: false, message: "This promo code has expired." };
  }

  let discount = 0;
  if (promo.discountType === "flat") {
    discount = Math.min(estimatedFare, promo.discountValue);
  } else {
    discount = (estimatedFare * promo.discountValue) / 100;
  }

  // Rounded discount to whole numbers
  discount = Math.floor(discount);

  return {
    success: true,
    promoId: promo.id,
    code: promo.code,
    discount,
    finalFare: Math.max(0, estimatedFare - discount),
  };
}
