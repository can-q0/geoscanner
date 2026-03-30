import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="relative min-h-[calc(100vh-140px)] overflow-hidden">
      {/* Background effects */}
      <div className="grid-bg absolute inset-0 opacity-30" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, var(--accent-dim) 0%, transparent 70%)",
        }}
      />

      {/* Back to home */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--accent)]"
          style={{
            color: "var(--text-secondary)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            letterSpacing: "0.03em",
          }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to home
        </Link>
      </div>

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16">
        {/* Welcome heading */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold tracking-tight mb-2"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
            }}
          >
            Welcome back
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Sign in to access your dashboard and scan reports.
          </p>
        </div>

        {/* Clerk form */}
        <SignIn />

        {/* Sign up link */}
        <p
          className="mt-8 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="transition-colors hover:text-[var(--accent-bright)]"
            style={{
              color: "var(--accent)",
              fontWeight: 500,
            }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
