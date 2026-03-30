"""Composite GEO score calculation."""

WEIGHTS = {
    "citability": 0.25,
    "brand": 0.20,
    "content_eeat": 0.20,
    "technical": 0.15,
    "schema": 0.10,
    "platform": 0.10,
}


def compute_geo_score(scores: dict) -> int:
    """Compute weighted GEO score from category scores."""
    total = 0.0
    for category, weight in WEIGHTS.items():
        total += scores.get(category, 0) * weight
    return round(total)


def score_label(score: int) -> str:
    if score >= 90:
        return "Excellent"
    elif score >= 75:
        return "Good"
    elif score >= 60:
        return "Fair"
    elif score >= 40:
        return "Poor"
    else:
        return "Critical"
