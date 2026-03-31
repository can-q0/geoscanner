import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Valid promo codes — add codes here as needed
const VALID_CODES: Record<string, { type: "full_unlock" }> = {
  "GEOFREE": { type: "full_unlock" },
  "BETAUSER": { type: "full_unlock" },
};

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { code, scanId } = await request.json();
    if (!code || !scanId) {
      return NextResponse.json({ error: "Code and scan ID required" }, { status: 400 });
    }

    const promoCode = VALID_CODES[code.toUpperCase()];
    if (!promoCode) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    const scan = await prisma.scan.findUnique({ where: { id: scanId } });
    if (!scan || scan.userId !== user.id) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    if (scan.isPaid) {
      return NextResponse.json({ error: "Already unlocked" }, { status: 400 });
    }

    // Mark scan as paid via promo code
    await prisma.scan.update({
      where: { id: scanId },
      data: { isPaid: true, scanType: "full" },
    });

    // Trigger full audit
    const { startFullAudit } = await import("@/lib/api");
    await startFullAudit(scan.url, scanId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Promo redeem error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
