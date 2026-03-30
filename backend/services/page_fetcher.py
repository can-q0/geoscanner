"""Wraps fetch_page.py functions for the scan pipeline."""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts"))

from fetch_page import fetch_page, fetch_robots_txt, fetch_llms_txt, crawl_sitemap, extract_content_blocks


def fetch_all_quick(url: str) -> dict:
    """Fetch all data needed for a quick scan."""
    page_data = fetch_page(url)
    robots_data = fetch_robots_txt(url)
    llmstxt_data = fetch_llms_txt(url)
    content_blocks = extract_content_blocks(page_data.get("html", "")) if page_data.get("html") else []

    return {
        "page": page_data,
        "robots": robots_data,
        "llmstxt": llmstxt_data,
        "content_blocks": content_blocks,
    }


def fetch_all_full(url: str, max_pages: int = 20) -> dict:
    """Fetch all data needed for a full audit."""
    page_data = fetch_page(url)
    robots_data = fetch_robots_txt(url)
    llmstxt_data = fetch_llms_txt(url)

    sitemap_pages = crawl_sitemap(url, max_pages=50)
    pages_to_fetch = sitemap_pages[:max_pages] if sitemap_pages else []

    if not pages_to_fetch and page_data.get("internal_links"):
        pages_to_fetch = page_data["internal_links"][:max_pages]

    additional_pages = []
    for page_url in pages_to_fetch[:max_pages]:
        try:
            additional_pages.append(fetch_page(page_url))
        except Exception:
            continue

    return {
        "homepage": page_data,
        "robots": robots_data,
        "llmstxt": llmstxt_data,
        "additional_pages": additional_pages,
        "total_pages_found": len(sitemap_pages) if sitemap_pages else len(page_data.get("internal_links", [])),
    }
