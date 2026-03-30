import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedPage = createRouteMatcher([
  "/dashboard(.*)",
  "/settings(.*)",
]);

const isProtectedApi = createRouteMatcher([
  "/api/scan(.*)",
  "/api/payment(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // For page routes: use Clerk's redirect-based protection
  if (isProtectedPage(req)) {
    await auth.protect();
  }

  // For API routes: check auth but return JSON 401 instead of redirect
  if (isProtectedApi(req)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
