import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getPostHogClient } from "@/lib/posthog-server";

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { scanId } = await request.json();
    if (!scanId) {
      return NextResponse.json({ error: "Scan ID required" }, { status: 400 });
    }

    const scan = await prisma.scan.findUnique({ where: { id: scanId } });
    if (!scan || scan.userId !== user.id) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    if (scan.isPaid) {
      return NextResponse.json({ error: "Already paid", redirectUrl: `/scan/${scanId}` });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        scanId,
        amountCents: 500,
        currency: "TRY",
        status: "pending",
      },
    });

    const ph = getPostHogClient();
    if (ph) {
      ph.capture({ distinctId: user.id, event: "payment_initiated", properties: { scan_id: scanId, domain: scan.domain, amount_cents: 500, currency: "TRY", dev_mode: !process.env.IYZICO_API_KEY } });
    }

    // TODO: Create iyzico payment link
    const IYZICO_API_KEY = process.env.IYZICO_API_KEY;

    if (!IYZICO_API_KEY) {
      // Dev mode: auto-complete payment for testing
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "completed", completedAt: new Date() },
      });
      await prisma.scan.update({
        where: { id: scanId },
        data: { isPaid: true, scanType: "full" },
      });

      // Trigger full audit
      const { startFullAudit } = await import("@/lib/api");
      await startFullAudit(scan.url, scanId);

      return NextResponse.json({
        success: true,
        redirectUrl: `/scan/${scanId}`,
        devMode: true,
      });
    }

    return NextResponse.json({
      paymentId: payment.id,
      checkoutUrl: `https://sandbox-checkout.iyzipay.com/payment/${payment.id}`,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
