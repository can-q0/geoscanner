import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id } = await params;

    const scan = await prisma.scan.findUnique({ where: { id } });
    if (!scan || scan.userId !== user.id) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    const response: Record<string, unknown> = {
      id: scan.id,
      url: scan.url,
      domain: scan.domain,
      scanType: scan.scanType,
      status: scan.status,
      progress: scan.progress,
      progressMessage: scan.progressMessage,
      geoScore: scan.geoScore,
      scoresSummary: scan.scoresSummary,
      isPaid: scan.isPaid,
      createdAt: scan.createdAt,
      completedAt: scan.completedAt,
      errorMessage: scan.errorMessage,
    };

    // Only include full results if paid
    if (scan.isPaid && scan.resultsFull) {
      response.resultsFull = scan.resultsFull;
      response.pdfUrl = scan.pdfUrl ? `/api/scan/${scan.id}/pdf` : null;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Scan fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
