import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UserProfile } from "@clerk/nextjs";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Settings - GEO Scanner",
};

export default async function SettingsPage() {
  const user = await getAuthUser();
  if (!user) redirect("/sign-in");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalScans, scansToday, paidScans, totalPayments] = await Promise.all([
    prisma.scan.count({ where: { userId: user.id } }),
    prisma.scan.count({
      where: { userId: user.id, scanType: "quick", createdAt: { gte: today } },
    }),
    prisma.scan.count({ where: { userId: user.id, isPaid: true } }),
    prisma.payment.aggregate({
      where: { userId: user.id, status: "completed" },
      _sum: { amountCents: true },
      _count: true,
    }),
  ]);

  const totalSpent = (totalPayments._sum.amountCents || 0) / 100;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">Account Settings</h1>

      {/* Subscription & Usage */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Plan & Usage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
            <p className="text-sm text-gray-400 mb-1">Current Plan</p>
            <p className="text-xl font-bold text-emerald-400">Free</p>
            <p className="text-xs text-gray-500 mt-1">1 free scan, then buy reports</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
            <p className="text-sm text-gray-400 mb-1">Free Scan</p>
            <p className="text-xl font-bold text-white">
              {scansToday >= 1 ? (
                <span style={{ color: 'var(--warning, #ffa502)' }}>Used</span>
              ) : (
                <span style={{ color: 'var(--accent, #10b981)' }}>Available</span>
              )}
            </p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
            <p className="text-sm text-gray-400 mb-1">Total Scans</p>
            <p className="text-xl font-bold text-white">{totalScans}</p>
            <p className="text-xs text-gray-500 mt-1">{paidScans} full reports</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
            <p className="text-sm text-gray-400 mb-1">Total Spent</p>
            <p className="text-xl font-bold text-white">
              {totalSpent > 0 ? `${totalSpent.toFixed(2)} TRY` : "--"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {totalPayments._count} payment{totalPayments._count !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </section>

      {/* Account Info */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Account Details</h2>
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Email</p>
              <p className="text-white mt-0.5">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-400">Name</p>
              <p className="text-white mt-0.5">{user.name || "Not set"}</p>
            </div>
            <div>
              <p className="text-gray-400">Member Since</p>
              <p className="text-white mt-0.5">
                {user.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Account ID</p>
              <p className="text-white mt-0.5 font-mono text-xs">{user.id}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Clerk Profile Management */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          Security & Profile
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Manage your email, password, connected accounts, and active sessions.
        </p>
        <div className="clerk-profile-wrapper">
          <UserProfile
            routing="hash"
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox: "w-full shadow-none",
                card: "bg-transparent shadow-none border border-gray-800 rounded-lg",
              },
            }}
          />
        </div>
      </section>
    </div>
  );
}
