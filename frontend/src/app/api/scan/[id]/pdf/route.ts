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

    if (!scan.isPaid) {
      return NextResponse.json({ error: "Payment required for PDF download" }, { status: 403 });
    }

    if (!scan.pdfUrl) {
      return NextResponse.json({ error: "PDF not yet generated" }, { status: 404 });
    }

    // Fetch PDF from backend
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const API_KEY = process.env.API_SECRET_KEY || "geoscanner-internal-api-key-2026";

    const pdfRes = await fetch(`${API_URL}/scan/${id}/pdf`, {
      headers: { "x-api-key": API_KEY },
    });

    if (!pdfRes.ok) {
      return NextResponse.json({ error: "PDF not available" }, { status: 404 });
    }

    const pdfBuffer = await pdfRes.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="GEO-Report-${scan.domain}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
