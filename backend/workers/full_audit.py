"""Full audit worker - processes paid tier comprehensive scans.
Uses ALL scripts (fetch_page, citability_scorer, brand_scanner, llmstxt_generator, generate_pdf_report)
and ALL SKILL.md rubrics via Claude API.
"""

import json
import traceback
import asyncio
from typing import Optional
from concurrent.futures import ThreadPoolExecutor
from database import update_scan_progress, update_scan_full_result, update_scan_error
from services.page_fetcher import fetch_all_full
from services.citability_service import score_content_blocks
from services.brand_service import scan_brand
from services.llmstxt_service import check_llmstxt
from services.claude_analyzer import analyze_full_category, synthesize_report
from services.scoring import compute_geo_score, score_label

executor = ThreadPoolExecutor(max_workers=6)


def _extract_brand_name(url):
    """Extract brand name from URL domain."""
    domain = url.split("//")[-1].split("/")[0]
    # Remove www. and TLD
    parts = domain.replace("www.", "").split(".")
    return parts[0].capitalize() if parts else domain


def _prepare_category_data(fetched, citability_data, brand_data, llmstxt_validation):
    """Prepare data payloads for each category analysis."""
    homepage = fetched["homepage"]
    pages_text = ""
    all_structured_data = list(homepage.get("structured_data", []))

    for i, page in enumerate(fetched.get("additional_pages", [])[:10]):
        pages_text += f"\n\n--- Page {i+2}: {page.get('url', 'N/A')} ---\n"
        pages_text += f"Title: {page.get('title', 'N/A')}\n"
        pages_text += f"Word Count: {page.get('word_count', 0)}\n"
        pages_text += page.get("text_content", "")[:1500]
        all_structured_data.extend(page.get("structured_data", []))

    return {
        "citability": f"""URL: {homepage.get('url')}
Citability Analysis (from citability_scorer.py):
Average Score: {citability_data['average_score']}
Total Blocks: {citability_data['total_blocks']}
Grade Distribution: {json.dumps(citability_data['grade_distribution'])}

Top Citable Blocks:
{json.dumps(citability_data['top_blocks'][:5], indent=2, default=str)}

Weakest Blocks (rewrite priority):
{json.dumps(citability_data['bottom_blocks'][:5], indent=2, default=str)}""",

        "content_eeat": f"""URL: {homepage.get('url')}
Title: {homepage.get('title')}
Description: {homepage.get('description')}
Word Count: {homepage.get('word_count')}
Meta Tags: {json.dumps(homepage.get('meta_tags', {}), default=str)}

Homepage Content (first 4000 chars):
{homepage.get('text_content', '')[:4000]}

Additional Pages:
{pages_text[:4000]}""",

        "technical": f"""URL: {homepage.get('url')}
Status Code: {homepage.get('status_code')}
Redirect Chain: {json.dumps(homepage.get('redirect_chain', []))}
Security Headers: {json.dumps(homepage.get('security_headers', {}), default=str)}
Has SSR Content: {homepage.get('has_ssr_content')}
Meta Tags: {json.dumps(homepage.get('meta_tags', {}), default=str)}
Canonical: {homepage.get('canonical')}
Heading Structure: {json.dumps(homepage.get('heading_structure', [])[:30])}

Robots.txt AI Crawler Status:
{json.dumps(fetched['robots'].get('ai_crawler_status', {}), default=str)}

Sitemaps Found: {json.dumps(fetched['robots'].get('sitemaps', []))}
Total Pages Discovered: {fetched.get('total_pages_found', 0)}

llms.txt Status:
{json.dumps(llmstxt_validation, indent=2, default=str)}""",

        "schema": f"""URL: {homepage.get('url')}
Detected Structured Data (all pages):
{json.dumps(all_structured_data[:10], indent=2, default=str)}

Business Type Signals:
Title: {homepage.get('title')}
Description: {homepage.get('description')}
Internal Links Sample: {json.dumps(homepage.get('internal_links', [])[:20])}""",

        "platform": f"""URL: {homepage.get('url')}
Title: {homepage.get('title')}
Description: {homepage.get('description')}
Word Count: {homepage.get('word_count')}
Has SSR: {homepage.get('has_ssr_content')}
Structured Data Types: {json.dumps([sd.get('@type', 'unknown') for sd in all_structured_data[:10]])}
Heading Structure: {json.dumps(homepage.get('heading_structure', [])[:20])}
Robots AI Status: {json.dumps(fetched['robots'].get('ai_crawler_status', {}), default=str)}
llms.txt: {llmstxt_validation.get('exists', False)}
Content Preview: {homepage.get('text_content', '')[:2000]}

Brand Presence Data (from brand_scanner.py):
{json.dumps(brand_data, indent=2, default=str)}""",

        "brand": f"""Brand: {_extract_brand_name(homepage.get('url', ''))}
Domain: {homepage.get('url', '').split('//')[- 1].split('/')[0] if '//' in homepage.get('url', '') else homepage.get('url', '')}

Brand Scanner Results (from brand_scanner.py):
{json.dumps(brand_data, indent=2, default=str)}

Homepage Meta:
Title: {homepage.get('title')}
Description: {homepage.get('description')}
External Links (social profiles): {json.dumps(homepage.get('external_links', [])[:30])}""",
    }


async def run_full_audit(url, scan_id):
    """Execute a comprehensive GEO audit using all scripts and SKILL.md rubrics."""
    try:
        await update_scan_progress(scan_id, 5, "Starting full audit...")
        loop = asyncio.get_event_loop()

        # Phase 1: Data collection (parallel where possible)
        await update_scan_progress(scan_id, 8, "Fetching pages and sitemap...")
        fetched = await loop.run_in_executor(executor, fetch_all_full, url)

        await update_scan_progress(scan_id, 18, "Scanning brand mentions (YouTube, Reddit, Wikipedia)...")
        brand_name = _extract_brand_name(url)
        domain = url.split("//")[-1].split("/")[0] if "//" in url else url
        brand_data = await loop.run_in_executor(executor, scan_brand, brand_name, domain)

        await update_scan_progress(scan_id, 22, "Validating llms.txt...")
        llmstxt_validation = await loop.run_in_executor(executor, check_llmstxt, url)

        # Phase 2: Content analysis
        await update_scan_progress(scan_id, 25, "Analyzing content citability...")
        all_blocks = []
        homepage_html = fetched["homepage"].get("html", "")
        if homepage_html:
            from scripts.fetch_page import extract_content_blocks
            all_blocks = extract_content_blocks(homepage_html)
        for page in fetched.get("additional_pages", [])[:5]:
            if page.get("html"):
                all_blocks.extend(extract_content_blocks(page["html"]))

        citability_data = score_content_blocks(all_blocks)

        # Phase 3: Prepare data for Claude analysis
        await update_scan_progress(scan_id, 30, "Preparing AI analysis...")
        category_data = _prepare_category_data(fetched, citability_data, brand_data, llmstxt_validation)

        # Phase 4: Sequential Claude API calls to respect rate limits
        categories = ["citability", "content_eeat", "technical", "schema", "platform", "brand"]
        category_labels = {
            "citability": "AI citability",
            "content_eeat": "content E-E-A-T",
            "technical": "technical SEO",
            "schema": "schema & structured data",
            "platform": "platform optimization",
            "brand": "brand authority",
        }
        category_results = {}
        for idx, cat in enumerate(categories):
            progress = 35 + int((idx / len(categories)) * 30)
            await update_scan_progress(scan_id, progress, f"Analyzing {category_labels[cat]}...")
            result = await loop.run_in_executor(
                executor, analyze_full_category, cat, category_data[cat]
            )
            category_results[cat] = result
            # Small delay between calls to stay within rate limits
            if idx < len(categories) - 1:
                await asyncio.sleep(3)

        await update_scan_progress(scan_id, 70, "Calculating scores...")

        # Use brand score from Claude analysis (not hardcoded 50)
        scores = {
            "citability": category_results["citability"].get("score", 0),
            "brand": category_results["brand"].get("score", 0),
            "content_eeat": category_results["content_eeat"].get("score", 0),
            "technical": category_results["technical"].get("score", 0),
            "schema": category_results["schema"].get("score", 0),
            "platform": category_results["platform"].get("score", 0),
        }

        geo_score = compute_geo_score(scores)

        # Phase 5: Synthesis
        await update_scan_progress(scan_id, 75, "Synthesizing report...")
        synthesis = await loop.run_in_executor(
            executor, synthesize_report, {
                "url": url,
                "geo_score": geo_score,
                "score_label": score_label(geo_score),
                "scores": scores,
                "category_results": category_results,
                "brand_data": brand_data,
                "llmstxt_status": llmstxt_validation,
            }
        )

        # Phase 6: PDF generation
        await update_scan_progress(scan_id, 85, "Generating PDF report...")
        pdf_url = None
        try:
            pdf_url = await _generate_pdf(url, geo_score, scores, category_results, synthesis, scan_id)
        except Exception as pdf_err:
            print(f"PDF generation failed (non-fatal): {pdf_err}")
            traceback.print_exc()

        # Phase 7: Store results
        await update_scan_progress(scan_id, 95, "Storing results...")

        scores_summary = json.dumps({
            "scores": scores,
            "summary": synthesis.get("executive_summary", ""),
            "top_findings": [f["title"] for f in synthesis.get("all_findings", [])[:3]],
            "score_label": score_label(geo_score),
            "crawler_status": fetched["robots"].get("ai_crawler_status", {}),
            "llmstxt_exists": llmstxt_validation.get("exists", False),
            "brand_data_summary": {
                "youtube": category_results.get("brand", {}).get("platform_scores", {}).get("youtube", 0),
                "reddit": category_results.get("brand", {}).get("platform_scores", {}).get("reddit", 0),
                "wikipedia": category_results.get("brand", {}).get("platform_scores", {}).get("wikipedia", 0),
            },
        })

        results_full = json.dumps({
            "category_results": category_results,
            "synthesis": synthesis,
            "citability_details": citability_data,
            "brand_scan_raw": brand_data,
            "llmstxt_validation": llmstxt_validation,
            "pages_analyzed": fetched.get("total_pages_found", 0),
        }, default=str)

        await update_scan_full_result(scan_id, geo_score, scores_summary, results_full, pdf_url)

    except Exception as e:
        await update_scan_error(scan_id, f"{type(e).__name__}: {str(e)}")
        traceback.print_exc()


async def _generate_pdf(url, geo_score, scores, category_results, synthesis, scan_id):
    """Generate PDF report using existing ReportLab script."""
    import os
    import tempfile
    import datetime
    from scripts.generate_pdf_report import generate_report

    pdf_data = {
        "url": url,
        "brand_name": _extract_brand_name(url),
        "date": datetime.datetime.now().strftime("%Y-%m-%d"),
        "geo_score": geo_score,
        "scores": {
            "ai_citability": scores.get("citability", 0),
            "brand_authority": scores.get("brand", 0),
            "content_eeat": scores.get("content_eeat", 0),
            "technical": scores.get("technical", 0),
            "schema": scores.get("schema", 0),
            "platform_optimization": scores.get("platform", 0),
        },
        "platforms": {},
        "crawler_access": category_results.get("technical", {}).get("crawler_access", {}),
        "findings": synthesis.get("all_findings", []),
        "quick_wins": synthesis.get("quick_wins", []),
        "medium_term": synthesis.get("medium_term", []),
        "strategic": synthesis.get("strategic", []),
    }

    platform_data = category_results.get("platform", {}).get("platforms", {})
    if platform_data:
        pdf_data["platforms"] = {
            "Google AI Overviews": platform_data.get("google_aio", {}).get("score", 0) * 5,
            "ChatGPT": platform_data.get("chatgpt", {}).get("score", 0) * 5,
            "Perplexity": platform_data.get("perplexity", {}).get("score", 0) * 5,
            "Gemini": platform_data.get("gemini", {}).get("score", 0) * 5,
            "Bing Copilot": platform_data.get("bing_copilot", {}).get("score", 0) * 5,
        }

    pdf_dir = os.path.join(tempfile.gettempdir(), "geoscanner_pdfs")
    os.makedirs(pdf_dir, exist_ok=True)
    pdf_path = os.path.join(pdf_dir, f"{scan_id}.pdf")

    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, generate_report, pdf_data, pdf_path)

    return pdf_path
