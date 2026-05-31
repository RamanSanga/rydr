"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notification";

const DEFAULT_REWARD_AMOUNT = 100.00; // Customizable reward in Indian Rupees

// 1. Get or create referral code for the active user
export async function getOrCreateUserReferralCodeAction() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Please sign in first.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true, name: true },
  });

  if (!user) throw new Error("User record not found in database.");

  if (user.referralCode) {
    return user.referralCode;
  }

  // Generate a unique code: e.g. RYDR-RAMAN-483
  const cleanedName = user.name
    .trim()
    .replace(/\s+/g, "")
    .substring(0, 8)
    .toUpperCase();
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const code = `RYDR-${cleanedName}-${randomSuffix}`;

  await prisma.user.update({
    where: { id: userId },
    data: { referralCode: code },
  });

  return code;
}

// 2. Apply a referral code during sign-up / onboarding
export async function applyReferralCodeAction(code: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Please sign in first.");
  }

  const cleanCode = code.trim().toUpperCase();

  // Find the referrer
  const referrer = await prisma.user.findFirst({
    where: { referralCode: cleanCode },
  });

  if (!referrer) {
    throw new Error("Invalid referral code. Please check and try again.");
  }

  if (referrer.id === userId) {
    throw new Error("You cannot refer yourself.");
  }

  // Check if referred user has already been referred
  const alreadyReferred = await prisma.referral.findUnique({
    where: { referredUserId: userId },
  });

  if (alreadyReferred) {
    throw new Error("You have already applied a referral code.");
  }

  // Perform transactional wallet credits for both users!
  const reward = DEFAULT_REWARD_AMOUNT;

  await prisma.$transaction(async (tx) => {
    // 1. Log referral match
    await tx.referral.create({
      data: {
        referrerId: referrer.id,
        referredUserId: userId,
        rewardAmount: reward,
      },
    });

    // 2. Credit Referrer Wallet
    await tx.wallet.upsert({
      where: { userId: referrer.id },
      update: {
        balance: { increment: reward },
        transactions: {
          create: {
            amount: reward,
            type: "REFERRAL_REWARD",
            description: "Referral reward for inviting a friend",
          },
        },
      },
      create: {
        userId: referrer.id,
        balance: reward,
        transactions: {
          create: {
            amount: reward,
            type: "REFERRAL_REWARD",
            description: "Referral reward for inviting a friend",
          },
        },
      },
    });

    // 3. Credit Referred User Wallet
    await tx.wallet.upsert({
      where: { userId },
      update: {
        balance: { increment: reward },
        transactions: {
          create: {
            amount: reward,
            type: "REFERRAL_REWARD",
            description: "Referral reward for joining via invite code",
          },
        },
      },
      create: {
        userId,
        balance: reward,
        transactions: {
          create: {
            amount: reward,
            type: "REFERRAL_REWARD",
            description: "Referral reward for joining via invite code",
          },
        },
      },
    });
  });

  // 4. Send Notifications in background
  await createNotification(
    referrer.id,
    "🎉 Referral Reward Credited!",
    `Your friend joined RYDR! ₹${reward} has been added to your wallet.`,
    "REFERRAL"
  );

  await createNotification(
    userId,
    "🎉 Welcome Invite Applied!",
    `You claimed an invite code! ₹${reward} has been added to your wallet.`,
    "REFERRAL"
  );

  revalidatePath("/profile");
  revalidatePath("/rider");
  return { success: true, reward };
}

// 3. Fetch Referral metrics and history for profile page
export async function fetchUserReferralStatsAction() {
  const { userId } = await auth();
  if (!userId) {
    return {
      referralCode: "",
      totalReferrals: 0,
      totalRewards: 0,
    };
  }

  const referralCode = await getOrCreateUserReferralCodeAction();

  const referrals = await prisma.referral.findMany({
    where: { referrerId: userId },
    select: { rewardAmount: true },
  });

  const totalReferrals = referrals.length;
  const totalRewards = referrals.reduce((sum, r) => sum + r.rewardAmount, 0);

  return {
    referralCode,
    totalReferrals,
    totalRewards,
  };
}
