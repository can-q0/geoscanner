import Link from "next/link";

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Home", href: "/" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "mailto:hello@geoscanner.ai" },
      { label: "About", href: "/about" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg-surface)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 pt-12 pb-8">
        {/* Column grid */}
        <div
          className="grid gap-8 pb-10"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          }}
        >
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3
                className="mb-4 text-xs uppercase tracking-widest"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--accent)",
                  letterSpacing: "0.1em",
                }}
              >
                {column.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200 hover:text-[var(--accent)]"
                      style={{
                        color: "var(--text-secondary)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--border)" }} />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
          <span
            className="text-xs"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            &copy; 2025 GEO Scanner
          </span>
          <span
            className="text-xs uppercase tracking-widest"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Signal Intelligence for the AI Search Era
          </span>
        </div>
      </div>
    </footer>
  );
}
