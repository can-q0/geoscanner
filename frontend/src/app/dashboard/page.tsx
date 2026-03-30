import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ScanList from "@/components/ScanList";

export const metadata: Metadata = {
  title: "Dashboard - GEO Scanner",
  description: "View and manage your GEO scan results.",
};

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user) redirect("/sign-in");

  const scans = await prisma.scan.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      url: true,
      domain: true,
      scanType: true,
      status: true,
      geoScore: true,
      isPaid: true,
      createdAt: true,
    },
    take: 50,
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Your Scans</h1>
        <Link
          href="/"
          className="rounded-lg px-4 py-2 text-sm font-medium transition"
          style={{
            background: "var(--accent)",
            color: "var(--bg-void)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.04em",
          }}
        >
          New Scan
        </Link>
      </div>

      {scans.length === 0 ? (
        <div className="text-center py-16">
          <p className="mb-4" style={{ color: "var(--text-muted)" }}>
            No scans yet. Start your first one!
          </p>
          <Link
            href="/"
            className="hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Scan a website
          </Link>
        </div>
      ) : (
        <ScanList scans={scans} />
      )}
    </div>
  );
}
