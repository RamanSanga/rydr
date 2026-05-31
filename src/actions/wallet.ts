"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Get or create wallet for the active user
export async function getOrCreateWalletAction() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Please sign in first.");
  }

  let wallet = await prisma.wallet.findUnique({
    where: { userId },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!wallet) {
    // Initialize wallet with ₹500 welcome credit to enable booking immediately!
    wallet = await prisma.wallet.create({
      data: {
        userId,
        balance: 500.00,
        transactions: {
          create: {
            amount: 500.00,
            type: "TOPUP",
            description: "🎉 Welcome Credit",
          },
        },
      },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  return wallet;
}

// 2. Add Money to wallet (Top-Up)
export async function addMoneyAction(amount: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (amount <= 0) throw new Error("Amount must be greater than zero.");

  const wallet = await prisma.wallet.upsert({
    where: { userId },
    update: {
      balance: {
        increment: amount,
      },
      transactions: {
        create: {
          amount,
          type: "TOPUP",
          description: "Online Wallet Top-up",
        },
      },
    },
    create: {
      userId,
      balance: amount,
      transactions: {
        create: {
          amount,
          type: "TOPUP",
          description: "Online Wallet Top-up",
        },
      },
    },
  });

  revalidatePath("/profile");
  revalidatePath("/rider");
  return { success: true, wallet };
}

// 3. Deduct trip fare from wallet
export async function deductFareAction(rideId: string, amount: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const wallet = await prisma.wallet.findUnique({
    where: { userId },
  });

  if (!wallet || wallet.balance < amount) {
    throw new Error("Insufficient wallet balance. Please add money to your wallet.");
  }

  const updatedWallet = await prisma.wallet.update({
    where: { userId },
    data: {
      balance: {
        decrement: amount,
      },
      transactions: {
        create: {
          amount: -amount,
          type: "FARE_DEDUCTION",
          description: `Fare deducted for Ride ID: #${rideId.substring(0, 8)}`,
        },
      },
    },
  });

  revalidatePath("/profile");
  revalidatePath("/rider");
  revalidatePath("/rides");
  return { success: true, wallet: updatedWallet };
}
