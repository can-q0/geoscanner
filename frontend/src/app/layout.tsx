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

export const metadata: Metadata = {
  metadataBase: new URL("https://geoscanner.ai"),
  title: "GEO Scanner - AI Search Visibility Analyzer",
  description:
    "Analyze your website's visibility across AI search engines like ChatGPT, Perplexity, Google AI Overviews, and Gemini. Get your GEO score in 60 seconds.",
  keywords: [
    "GEO",
    "AI search",
    "AI visibility",
    "ChatGPT SEO",
    "Perplexity optimization",
    "AI citations",
    "generative engine optimization",
  ],
  robots: "index, follow",
  openGraph: {
    title: "GEO Scanner - AI Search Visibility Analyzer",
    description:
      "Analyze your website's visibility across AI search engines like ChatGPT, Perplexity, Google AI Overviews, and Gemini. Get your GEO score in 60 seconds.",
    siteName: "GEO Scanner",
    type: "website",
    url: "https://geoscanner.ai",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GEO Scanner - AI Search Visibility Analyzer",
    description:
      "Analyze your website's visibility across AI search engines like ChatGPT, Perplexity, Google AI Overviews, and Gemini. Get your GEO score in 60 seconds.",
  },
  icons: {
    icon: "/icon.svg",
  },
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
          {/* Load only digit glyphs from Outfit (~2KB) for clean numbers in display font */}
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
