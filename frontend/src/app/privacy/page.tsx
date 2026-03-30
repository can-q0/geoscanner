import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - GEO Scanner",
  description:
    "How GEO Scanner collects, uses, and protects your data. We believe in transparency and minimal data collection.",
};

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      "**Account Information.** When you create an account via Clerk authentication, we collect your email address and basic profile information necessary to provide the service.",
      "**Scan Data.** When you run a scan, we store the website URL you submit and the resulting analysis data including your GEO score, category breakdowns, and optimization recommendations.",
      "**Usage Analytics.** We collect anonymized usage data such as pages visited, features used, and scan frequency to understand how the product is used and where we can improve.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "**Providing the Service.** Your data is used to perform AI search visibility analysis, generate reports, and deliver results to your dashboard.",
      "**Improving the Product.** Aggregated, anonymized data helps us refine our analysis algorithms, improve accuracy, and build features that matter to our users.",
      "**Communication.** We may send transactional emails related to your account, scans, or payments. We do not send unsolicited marketing emails.",
    ],
  },
  {
    title: "3. Data Storage & Security",
    content: [
      "Your data is stored securely in Neon PostgreSQL databases with encryption at rest and in transit. We implement industry-standard security practices including secure connections (TLS/SSL), parameterized queries, and regular security reviews.",
      "We do not sell, rent, or trade your personal information to third parties. Your scan data belongs to you.",
    ],
  },
  {
    title: "4. Third-Party Services",
    content: [
      "We use a limited number of trusted third-party services to operate GEO Scanner:",
      "**Clerk** provides authentication and user management. Clerk processes your email and login credentials under their own privacy policy.",
      "**iyzico** handles payment processing. We do not store your credit card details; iyzico processes all payment information securely under PCI-DSS compliance.",
      "**Anthropic (Claude API)** powers our AI analysis engine. Website content submitted for analysis is processed through the Claude API. Anthropic does not use API inputs to train their models.",
    ],
  },
  {
    title: "5. Cookies",
    content: [
      "GEO Scanner uses minimal, session-based cookies managed by Clerk for authentication purposes. These cookies are essential for the service to function and keep you signed in.",
      "We do not use advertising cookies or third-party tracking cookies.",
    ],
  },
  {
    title: "6. Your Rights",
    content: [
      "You have the right to **access** all data we hold about you, including your scan history and account information.",
      "You have the right to **delete** your account and all associated data at any time from your account settings.",
      "You have the right to **export** your scan data and reports.",
      "To exercise any of these rights, contact us at hello@geoscanner.ai or use the controls available in your account settings.",
    ],
  },
  {
    title: "7. Data Retention",
    content: [
      "Your scan results and reports are kept in your account until you choose to delete them. When you delete a scan, it is permanently removed from our databases.",
      "If you delete your account, all associated data is permanently erased within 30 days.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time. When we make material changes, we will notify you via email or through a notice on the service. Continued use of GEO Scanner after changes constitutes acceptance of the updated policy.",
    ],
  },
  {
    title: "9. Contact",
    content: [
      "If you have questions about this Privacy Policy or how we handle your data, please reach out to us at hello@geoscanner.ai.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-8" />

      {/* Header */}
      <section className="relative pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-6">
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              letterSpacing: "0.15em",
              marginBottom: "1rem",
            }}
          >
            LEGAL
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Privacy Policy
          </h1>
          <p
            className="mt-4"
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              fontFamily: "var(--font-body)",
            }}
          >
            Your privacy matters. This policy explains what data we collect, how
            we use it, and the control you have over your information.
          </p>
          <p
            className="mt-3"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
            }}
          >
            Last updated: March 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="relative pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                    marginBottom: "0.75rem",
                  }}
                >
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.content.map((paragraph, i) => (
                    <p
                      key={i}
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
                        lineHeight: 1.8,
                        fontFamily: "var(--font-body)",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: paragraph.replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong style="color: var(--text-primary); font-weight: 600">$1</strong>'
                        ),
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer divider & links */}
          <div
            className="mt-16 pt-8"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <div className="flex flex-wrap gap-6">
              <Link
                href="/terms"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  color: "var(--accent)",
                }}
              >
                Terms of Service
              </Link>
              <Link
                href="/about"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  color: "var(--accent)",
                }}
              >
                About GEO Scanner
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
