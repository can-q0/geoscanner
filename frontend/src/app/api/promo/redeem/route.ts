import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { startFullAudit } from "@/lib/api";

// Valid promo codes — add codes here as needed
const VALID_CODES: Record<string, { type: "full_unlock" }> = {
  "GEOFREE": { type: "full_unlock" },
  "BETAUSER": { type: "full_unlock" },
};

// POST /api/promo/redeem — validate only (no scan)
export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const code = body.code?.toUpperCase();
    const url = body.url; // optional — if provided, create a full scan

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const promoCode = VALID_CODES[code];
    if (!promoCode) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    // If just validating (no URL), return success
    if (!url) {
      return NextResponse.json({ valid: true });
    }

    // URL provided — create a full paid scan
    let domain: string;
    try {
      domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

    const scan = await prisma.scan.create({
      data: {
        userId: user.id,
        url: normalizedUrl,
        domain,
        scanType: "full",
        status: "processing",
        isPaid: true,
      },
    });

    // Trigger full audit (Sonnet 4.6)
    startFullAudit(normalizedUrl, scan.id).catch((err: unknown) => {
      console.error("Full audit trigger failed (non-fatal):", err);
    });

    return NextResponse.json({ valid: true, scanId: scan.id });
  } catch (error) {
    console.error("Promo redeem error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
