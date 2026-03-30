import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - GEO Scanner",
  description:
    "Terms and conditions for using GEO Scanner, the AI search visibility analysis platform.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: [
      'By accessing or using GEO Scanner ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.',
      "These terms constitute a legally binding agreement between you and GEO Scanner.",
    ],
  },
  {
    title: "2. Service Description",
    content: [
      "GEO Scanner is an AI search visibility analysis platform. We analyze websites to determine how visible and citable they are across AI-powered search engines including ChatGPT, Perplexity, Gemini, Google AI Overviews, and others.",
      "Our analysis covers AI crawler access, content citability, structured data, technical infrastructure, and platform-specific optimization. Results are provided as scores, findings, and actionable recommendations.",
    ],
  },
  {
    title: "3. Account Registration",
    content: [
      "To use GEO Scanner, you must create an account through our authentication provider, Clerk. You agree to provide accurate information and keep your credentials secure.",
      "You must be at least 18 years of age to create an account and use the Service.",
      "You are responsible for all activity that occurs under your account.",
    ],
  },
  {
    title: "4. Free & Paid Services",
    content: [
      "**Free Scan.** Every account receives one complimentary scan that includes your composite GEO score, top findings, category breakdown, and AI crawler access map.",
      "**Full Report.** Full reports are available for a one-time payment of $5 per report. Full reports include all free scan data plus AI rewrite suggestions, generated JSON-LD schema code, a 30-day action plan, platform-specific optimization tips, deep technical audit, and a downloadable PDF report.",
    ],
  },
  {
    title: "5. Payment Terms",
    content: [
      "Payments are processed securely through iyzico. All payments are one-time charges per report. There are no subscriptions, recurring fees, or hidden charges.",
      "Prices are displayed in USD. You agree to pay the listed price at the time of purchase. We reserve the right to adjust pricing, but changes will not affect previously purchased reports.",
    ],
  },
  {
    title: "6. Refund Policy",
    content: [
      "We stand behind the quality of our analysis. If you are not satisfied with a full report, contact us at hello@geoscanner.ai within 7 days of purchase and we will issue a full refund.",
      "Refund requests must include the scan URL and a brief explanation of why the report did not meet your expectations.",
    ],
  },
  {
    title: "7. Intellectual Property",
    content: [
      "**Your Reports.** The analysis reports generated for your website belong to you. You may share, distribute, or use them however you see fit.",
      "**Our Platform.** The GEO Scanner brand, design, analysis methodology, algorithms, and platform code are our intellectual property. You may not copy, reverse-engineer, or create derivative works from the Service.",
    ],
  },
  {
    title: "8. Acceptable Use",
    content: [
      "You agree not to:",
      "Use automated tools, bots, or scripts to scrape, crawl, or interact with the Service in bulk without prior authorization.",
      "Resell, redistribute, or white-label GEO Scanner reports as your own service without a partnership agreement.",
      "Submit URLs you do not own or have authorization to analyze for malicious purposes.",
      "Attempt to circumvent security measures, access controls, or rate limits.",
      "Use the Service to engage in any activity that violates applicable laws or regulations.",
    ],
  },
  {
    title: "9. Limitation of Liability",
    content: [
      'The Service is provided "as is" without warranties of any kind, whether express or implied. We do not guarantee that our analysis will result in specific search ranking improvements or business outcomes.',
      "To the maximum extent permitted by law, GEO Scanner shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.",
      "Our total liability for any claim arising from the Service shall not exceed the amount you paid for the specific report in question.",
    ],
  },
  {
    title: "10. Termination",
    content: [
      "**By You.** You may delete your account at any time through your account settings. Upon deletion, all your data will be permanently removed within 30 days.",
      "**By Us.** We reserve the right to suspend or terminate accounts that violate these Terms, engage in abusive behavior, or use the Service in a way that harms other users or our infrastructure.",
    ],
  },
  {
    title: "11. Changes to Terms",
    content: [
      "We may update these Terms of Service from time to time. When we make material changes, we will notify you via email or through a notice on the Service. Your continued use of GEO Scanner after changes take effect constitutes acceptance of the updated terms.",
    ],
  },
  {
    title: "12. Contact",
    content: [
      "If you have questions about these Terms of Service, please contact us at hello@geoscanner.ai.",
    ],
  },
];

export default function TermsPage() {
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
            Terms of Service
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
            Please read these terms carefully before using GEO Scanner. By using
            the Service, you agree to be bound by these terms.
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
            Effective: March 2026
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
                href="/privacy"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  color: "var(--accent)",
                }}
              >
                Privacy Policy
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
