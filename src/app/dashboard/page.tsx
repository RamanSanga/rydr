import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardRedirectPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  // Fetch current authenticated user's metadata from Clerk Backend
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = user.publicMetadata?.role;

  // Perform dynamic routing redirection
  if (role === "rider") {
    redirect("/rider");
  } else if (role === "driver") {
    redirect("/driver");
  } else if (role === "business") {
    redirect("/business");
  } else {
    // If no role is selected, direct them to select a role onboarding screen
    redirect("/select-role");
  }
}
