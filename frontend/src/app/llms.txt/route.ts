export async function GET() {
  const content = `# GEO Scanner

> AI search visibility analyzer that scores websites for Generative Engine Optimization (GEO) readiness across ChatGPT, Perplexity, Google AI Overviews, Gemini, and Bing Copilot.

## About

GEO Scanner is a SaaS tool that analyzes how AI-powered search engines discover, evaluate, and cite website content. It produces a composite GEO score from 0 to 100 based on 6 weighted categories: AI Citability (25%), Brand Authority (20%), Content E-E-A-T (20%), Technical SEO (15%), Schema & Structured Data (10%), and Platform Optimization (10%).

## Key Features

- Composite GEO Score (0-100) with 6-category breakdown
- AI citability analysis scoring content blocks for extractability by AI systems
- Brand authority scanning across YouTube, Reddit, Wikipedia, LinkedIn, and other platforms
- AI crawler access map checking 14 crawlers including GPTBot, ClaudeBot, PerplexityBot
- Platform-specific readiness for Google AI Overviews, ChatGPT, Perplexity, Gemini, Bing Copilot
- Generated JSON-LD Schema.org markup ready to deploy
- Content E-E-A-T assessment (Experience, Expertise, Authoritativeness, Trustworthiness)
- Technical SEO audit with SSR detection, security headers, Core Web Vitals
- llms.txt analysis and generation
- Prioritized 30-day action plan
- Professional PDF report download

## How It Works

1. Enter a website URL
2. The scanner fetches up to 50 pages, robots.txt, structured data, and content blocks
3. 6 parallel AI analysis modules evaluate the site using research-backed rubrics
4. Results are synthesized into a composite GEO score with prioritized recommendations

## Pricing

- Free: Quick GEO score with 6 category breakdown and top 3 findings
- $5 per report: Full audit with rewrite suggestions, generated Schema, action plan, and PDF

## Research Basis

GEO methodology is grounded in peer-reviewed research from Georgia Tech, Princeton, and IIT Delhi (2024) showing GEO-optimized content achieves 30-115% higher visibility in AI-generated responses. Brand mention correlation data from Ahrefs (Dec 2025, 75K brands) informs the brand authority scoring.

## Key Facts

- Founded: 2026
- Category: SaaS, AI SEO Tools, Generative Engine Optimization
- AI Crawlers Checked: 14 (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.)
- AI Platforms Analyzed: 5 (ChatGPT, Perplexity, Google AI Overviews, Gemini, Bing Copilot)
- Scoring Categories: 6 (Citability, Brand, E-E-A-T, Technical, Schema, Platform)

## Pages

- [Home](https://geoscanner-tawny.vercel.app/) - Main scanner and landing page
- [Dashboard](https://geoscanner-tawny.vercel.app/dashboard) - User scan history and results
- [Pricing](https://geoscanner-tawny.vercel.app/pricing) - Free vs full report comparison
- [About](https://geoscanner-tawny.vercel.app/about) - About GEO Scanner
- [Privacy](https://geoscanner-tawny.vercel.app/privacy) - Privacy policy
- [Terms](https://geoscanner-tawny.vercel.app/terms) - Terms of service
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
