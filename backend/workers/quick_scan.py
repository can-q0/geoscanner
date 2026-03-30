"""Quick scan worker - processes free tier scans."""

import json
import traceback
from database import update_scan_progress, update_scan_quick_result, update_scan_error
from services.page_fetcher import fetch_all_quick
from services.citability_service import score_content_blocks
from services.claude_analyzer import analyze_quick
from services.scoring import compute_geo_score


async def run_quick_scan(url: str, scan_id: str):
    """Execute a quick GEO scan and store results."""
    try:
        await update_scan_progress(scan_id, 10, "Fetching homepage...")

        fetched = fetch_all_quick(url)

        await update_scan_progress(scan_id, 30, "Analyzing content blocks...")

        citability_data = score_content_blocks(fetched["content_blocks"])

        await update_scan_progress(scan_id, 50, "Running AI analysis...")

        result = analyze_quick(
            fetched["page"],
            fetched["robots"],
            fetched["llmstxt"],
            citability_data,
        )

        await update_scan_progress(scan_id, 90, "Finalizing scores...")

        geo_score = result.get("geo_score", 0)
        scores_summary = {
            "scores": result.get("scores", {}),
            "summary": result.get("summary", ""),
            "top_findings": result.get("top_findings", []),
            "score_label": result.get("score_label", ""),
            "citability_details": {
                "average": citability_data["average_score"],
                "total_blocks": citability_data["total_blocks"],
                "grade_distribution": citability_data["grade_distribution"],
            },
            "crawler_status": fetched["robots"].get("ai_crawler_status", {}),
            "llmstxt_exists": fetched["llmstxt"].get("exists", False),
        }

        await update_scan_quick_result(
            scan_id, geo_score, json.dumps(scores_summary)
        )

    except Exception as e:
        await update_scan_error(scan_id, f"{type(e).__name__}: {str(e)}")
        traceback.print_exc()
