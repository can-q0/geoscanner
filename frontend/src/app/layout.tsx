import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";
import { ThemeProvider } from "@/components/ThemeProvider";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display-base",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem("theme");
    if (t !== "light" && t !== "dark") {
      t = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    document.documentElement.setAttribute("data-theme", t);
  } catch(e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

const siteUrl = "https://geoscanner-tawny.vercel.app";
const siteTitle = "GEO Scanner - AI Search Visibility Analyzer";
const siteDescription = "GEO Scanner is a Generative Engine Optimization (GEO) analysis tool that scores websites from 0 to 100 across 6 AI visibility categories. It analyzes how AI search engines like ChatGPT, Perplexity, Google AI Overviews, and Gemini discover, evaluate, and cite your content. Get your GEO score in 60 seconds with a free scan, or purchase a full report with rewrite suggestions, generated Schema markup, and a 30-day action plan for $5.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  keywords: [
    "GEO",
    "generative engine optimization",
    "AI search visibility",
    "AI SEO",
    "ChatGPT SEO",
    "Perplexity optimization",
    "Google AI Overviews",
    "AI citations",
    "AI citability",
    "website AI score",
    "GEO audit",
    "GEO score",
  ],
  robots: "index, follow",
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    siteName: "GEO Scanner",
    type: "website",
    url: siteUrl,
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "GEO Scanner - AI Search Visibility Analyzer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.svg",
  },
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "GEO Scanner",
      "url": siteUrl,
      "logo": `${siteUrl}/icon.svg`,
      "description": "GEO Scanner is a Generative Engine Optimization analysis platform that helps businesses measure and improve their visibility across AI-powered search engines including ChatGPT, Perplexity, Google AI Overviews, Gemini, and Bing Copilot.",
      "foundingDate": "2026",
      "sameAs": [
        "https://github.com/can-q0/geoscanner"
      ],
      "knowsAbout": [
        "Generative Engine Optimization",
        "AI Search Visibility",
        "AI Citability Analysis",
        "Schema Markup",
        "E-E-A-T Signals",
        "Brand Authority for AI"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "url": siteUrl
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "GEO Scanner",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "url": siteUrl,
      "description": "AI search visibility analyzer that scores websites across 6 GEO categories: AI Citability (25%), Brand Authority (20%), Content E-E-A-T (20%), Technical SEO (15%), Schema & Structured Data (10%), and Platform Optimization (10%). Scans 14 AI crawlers across 5 platforms.",
      "offers": [
        {
          "@type": "Offer",
          "name": "Free GEO Scan",
          "price": "0",
          "priceCurrency": "USD",
          "description": "Quick GEO score (0-100) with 6 category breakdown and top 3 findings"
        },
        {
          "@type": "Offer",
          "name": "Full GEO Report",
          "price": "5.00",
          "priceCurrency": "USD",
          "description": "Comprehensive GEO audit with AI citability rewrites, generated Schema markup, brand authority scan, 30-day action plan, and downloadable PDF report"
        }
      ],
      "featureList": [
        "Composite GEO Score (0-100) across 6 weighted categories",
        "AI citability analysis with rewrite suggestions for optimal 134-167 word passages",
        "Brand authority scan across YouTube, Reddit, Wikipedia, LinkedIn, and 7 other platforms",
        "AI crawler access map for 14 crawlers including GPTBot, ClaudeBot, PerplexityBot",
        "Platform-specific readiness scores for ChatGPT, Perplexity, Google AI Overviews, Gemini, Bing Copilot",
        "Generated JSON-LD Schema.org markup ready to paste",
        "E-E-A-T content quality assessment",
        "Technical SEO audit with SSR detection and security headers",
        "llms.txt file analysis and generation",
        "Prioritized 30-day action plan with quick wins",
        "Professional PDF report download"
      ]
    },
    {
      "@type": "WebSite",
      "name": "GEO Scanner",
      "url": siteUrl
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is GEO (Generative Engine Optimization)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Generative Engine Optimization (GEO) is the practice of optimizing websites for AI-powered search engines like ChatGPT, Perplexity, Google AI Overviews, and Gemini. Unlike traditional SEO which focuses on ranking in search results, GEO focuses on making content citable by AI systems. Research from Georgia Tech, Princeton, and IIT Delhi shows GEO-optimized content achieves 30-115% higher visibility in AI-generated responses."
          }
        },
        {
          "@type": "Question",
          "name": "How does GEO Scanner score websites?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GEO Scanner calculates a composite score from 0 to 100 using 6 weighted categories: AI Citability (25%), Brand Authority (20%), Content E-E-A-T (20%), Technical SEO (15%), Schema & Structured Data (10%), and Platform Optimization (10%). Each category is scored individually based on research-backed rubrics, then combined into the overall GEO score."
          }
        },
        {
          "@type": "Question",
          "name": "What AI platforms does GEO Scanner analyze?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GEO Scanner analyzes readiness for 5 major AI search platforms: Google AI Overviews, ChatGPT, Perplexity AI, Google Gemini, and Bing Copilot. It also checks access status for 14 AI crawlers including GPTBot, ClaudeBot, PerplexityBot, Google-Extended, and Applebot-Extended."
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`} data-theme="dark">
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <link
            href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&text=0123456789.,%25%2B%2D%2F&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="min-h-full flex flex-col">
          <ThemeProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </ToastProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
