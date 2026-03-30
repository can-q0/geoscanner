"""Wraps citability_scorer.py for the scan pipeline."""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts"))

from citability_scorer import score_passage, analyze_page_citability


def score_content_blocks(blocks: list) -> dict:
    """Score a list of content blocks for citability."""
    scored_blocks = []
    total_score = 0

    for block in blocks:
        text = block.get("content", "")
        heading = block.get("heading", "")
        if len(text.split()) < 20:
            continue
        result = score_passage(text, heading)
        result["heading"] = heading
        scored_blocks.append(result)
        total_score += result["total_score"]

    avg_score = round(total_score / len(scored_blocks)) if scored_blocks else 0

    scored_blocks.sort(key=lambda x: x["total_score"], reverse=True)

    return {
        "average_score": avg_score,
        "total_blocks": len(scored_blocks),
        "top_blocks": scored_blocks[:5],
        "bottom_blocks": scored_blocks[-5:] if len(scored_blocks) > 5 else [],
        "grade_distribution": _grade_distribution(scored_blocks),
    }


def _grade_distribution(blocks: list) -> dict:
    dist = {"A": 0, "B": 0, "C": 0, "D": 0, "F": 0}
    for b in blocks:
        score = b["total_score"]
        if score >= 90:
            dist["A"] += 1
        elif score >= 75:
            dist["B"] += 1
        elif score >= 60:
            dist["C"] += 1
        elif score >= 40:
            dist["D"] += 1
        else:
            dist["F"] += 1
    return dist
