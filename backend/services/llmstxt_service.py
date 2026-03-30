"""Wraps llmstxt_generator.py for the scan pipeline."""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts"))

from llmstxt_generator import validate_llmstxt


def check_llmstxt(url):
    """Validate llms.txt for the given URL."""
    try:
        return validate_llmstxt(url)
    except Exception as e:
        return {"exists": False, "error": str(e)}
