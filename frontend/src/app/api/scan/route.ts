import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { startQuickScan } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Extract domain
    let domain: string;
    try {
      domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

    // Check free scan limit (1 free scan total)
    const freeScansUsed = await prisma.scan.count({
      where: {
        userId: user.id,
        scanType: "quick",
      },
    });

    if (false && freeScansUsed >= 1) { // TODO: re-enable limit after testing
      // Free limit reached - create a scan that requires payment
      const scan = await prisma.scan.create({
        data: {
          userId: user.id,
          url: normalizedUrl,
          domain,
          scanType: "full",
          status: "pending_payment",
        },
      });

      return NextResponse.json({
        scanId: scan.id,
        requiresPayment: true,
        message: "Your free scan has been used. Purchase a full detailed analysis for this website.",
      });
    }

    // Free scan available
    const scan = await prisma.scan.create({
      data: {
        userId: user.id,
        url: normalizedUrl,
        domain,
        scanType: "quick",
        status: "processing",
      },
    });

    // Trigger quick scan on backend
    startQuickScan(normalizedUrl, scan.id).catch((err: unknown) => {
      console.error("Backend scan trigger failed (non-fatal):", err);
    });

    return NextResponse.json({ scanId: scan.id });
  } catch (error) {
    console.error("Scan creation error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Internal server error", detail: message }, { status: 500 });
  }
}
