import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DriverLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { driverProfile: true },
  });

  if (!user) {
    redirect("/select-role");
  }

  if (!user.driverProfile || !user.driverProfile.onboarded) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}
