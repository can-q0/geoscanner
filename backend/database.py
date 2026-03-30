from typing import Optional
import asyncpg
from config import DATABASE_URL

pool: Optional[asyncpg.Pool] = None


async def get_pool() -> asyncpg.Pool:
    global pool
    if pool is None:
        pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
    return pool


async def close_pool():
    global pool
    if pool:
        await pool.close()
        pool = None


async def update_scan_progress(scan_id: str, progress: int, message: str):
    p = await get_pool()
    await p.execute(
        "UPDATE scans SET progress = $1, progress_message = $2 WHERE id = $3",
        progress, message, scan_id,
    )


async def update_scan_quick_result(scan_id: str, geo_score: int, scores_summary: str):
    p = await get_pool()
    await p.execute(
        """UPDATE scans
           SET status = 'completed', geo_score = $1, scores_summary = $2::jsonb,
               completed_at = NOW(), progress = 100, progress_message = 'Complete'
           WHERE id = $3""",
        geo_score, scores_summary, scan_id,
    )


async def update_scan_full_result(scan_id: str, geo_score: int, scores_summary: str, results_full: str, pdf_url: Optional[str]):
    p = await get_pool()
    await p.execute(
        """UPDATE scans
           SET status = 'completed', geo_score = $1, scores_summary = $2::jsonb,
               results_full = $3::jsonb, pdf_url = $4,
               completed_at = NOW(), progress = 100, progress_message = 'Complete'
           WHERE id = $5""",
        geo_score, scores_summary, results_full, pdf_url, scan_id,
    )


async def update_scan_error(scan_id: str, error: str):
    p = await get_pool()
    await p.execute(
        "UPDATE scans SET status = 'failed', error_message = $1 WHERE id = $2",
        error, scan_id,
    )
