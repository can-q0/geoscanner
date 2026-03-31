import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { startFullAudit } from "@/lib/api";
import { getPostHogClient } from "@/lib/posthog-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, status: paymentStatus } = body;

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    // TODO: Verify iyzico signature/token
    // In production, call iyzico's API to verify the payment result

    const payment = await prisma.payment.findFirst({
      where: { iyzicoToken: token },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (paymentStatus === "success") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "completed",
          completedAt: new Date(),
          iyzicoPaymentId: body.paymentId || null,
        },
      });

      await prisma.scan.update({
        where: { id: payment.scanId },
        data: { isPaid: true, scanType: "full", status: "processing", progress: 0 },
      });

      // Get scan URL and trigger full audit
      const scan = await prisma.scan.findUnique({ where: { id: payment.scanId } });
      if (scan) {
        await startFullAudit(scan.url, scan.id);
      }

      const ph = getPostHogClient();
      if (ph) {
        ph.capture({ distinctId: payment.userId, event: "payment_confirmed", properties: { scan_id: payment.scanId, payment_id: payment.id, amount_cents: payment.amountCents } });
      }

      return NextResponse.json({ success: true, scanId: payment.scanId });
    }

    // Payment failed
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "failed" },
    });

    const phFail = getPostHogClient();
    if (phFail) {
      phFail.capture({ distinctId: payment.userId, event: "payment_failed", properties: { scan_id: payment.scanId, payment_id: payment.id } });
    }

    return NextResponse.json({ success: false, error: "Payment failed" });
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
