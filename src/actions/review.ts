"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Submit a rating/review for a ride
export async function submitReviewAction(rideId: string, rating: number, comment: string | null) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Please sign in first.");
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Validation Error: Rating must be between 1 and 5 stars.");
  }

  // Fetch the ride to verify users involved
  const ride = await prisma.ride.findUnique({
    where: { id: rideId },
  });

  if (!ride) {
    throw new Error("Ride not found.");
  }

  if (!ride.driverId) {
    throw new Error("Cannot review a ride that has no driver assigned.");
  }

  const isRider = ride.userId === userId;
  const isDriver = ride.driverId === userId;

  if (!isRider && !isDriver) {
    throw new Error("Unauthorized: You are not a participant of this ride.");
  }

  // Create the review
  const review = await prisma.review.create({
    data: {
      rideId,
      riderId: ride.userId,
      driverId: ride.driverId,
      reviewerId: userId,
      rating,
      review: comment,
    },
  });

  // Revalidate respective paths to trigger real-time updates
  revalidatePath("/profile");
  revalidatePath("/rider");
  revalidatePath("/driver");
  revalidatePath("/rides");

  return { success: true, review };
}

// 2. Fetch rolling ratings statistics and recent reviews for a user profile
export async function fetchUserRatingStats(role: "rider" | "driver") {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Please sign in first.");
  }
  // If role is driver, they are rated BY riders (reviewerId !== driverId, driverId === userId)
  // If role is rider, they are rated BY drivers (reviewerId !== riderId, riderId === userId)
  const whereClause = role === "driver" 
    ? { driverId: userId, reviewerId: { not: userId } }
    : { riderId: userId, reviewerId: { not: userId } };

  const aggregate = await prisma.review.aggregate({
    where: whereClause,
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  const recentReviews = await prisma.review.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      ride: {
        select: {
          pickup: true,
          destination: true,
        },
      },
    },
  });

  return {
    averageRating: aggregate._avg.rating ? parseFloat(aggregate._avg.rating.toFixed(2)) : 5.0,
    totalRatings: aggregate._count.rating,
    recentReviews: recentReviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.review || "No written review provided.",
      createdAt: r.createdAt,
      route: `${r.ride.pickup} to ${r.ride.destination}`,
    })),
  };
}
