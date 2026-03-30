import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function getAuthUser() {
  const { userId } = await auth();
  if (!userId) return null;

  // Try to find existing user by Clerk ID
  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (user) return user;

  // User doesn't exist yet - create from Clerk profile
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress || "";
  const name = clerkUser?.fullName || null;

  try {
    user = await prisma.user.create({
      data: { clerkId: userId, email, name },
    });
  } catch (e: unknown) {
    // If email already exists (from old migration), update the existing record
    const isUniqueViolation = e instanceof Error && e.message.includes("Unique constraint");
    if (isUniqueViolation && email) {
      user = await prisma.user.update({
        where: { email },
        data: { clerkId: userId, name },
      });
    } else {
      throw e;
    }
  }

  return user;
}
