"""Wraps brand_scanner.py for the scan pipeline."""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts"))

from brand_scanner import generate_brand_report


def scan_brand(brand_name, domain=None):
    """Run brand mention scan across YouTube, Reddit, Wikipedia, LinkedIn."""
    try:
        return generate_brand_report(brand_name, domain)
    except Exception as e:
        return {"error": str(e), "brand_name": brand_name}
