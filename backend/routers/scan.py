from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import FileResponse

from models.schemas import ScanRequest
from database import get_pool
from workers.quick_scan import run_quick_scan
from workers.full_audit import run_full_audit

router = APIRouter()


@router.post("/quick")
async def start_quick_scan(request: ScanRequest, bg: BackgroundTasks):
    bg.add_task(run_quick_scan, request.url, request.scan_id)
    return {"status": "started", "scan_id": request.scan_id}


@router.post("/full")
async def start_full_audit(request: ScanRequest, bg: BackgroundTasks):
    bg.add_task(run_full_audit, request.url, request.scan_id)
    return {"status": "started", "scan_id": request.scan_id}


@router.get("/{scan_id}/status")
async def get_scan_status(scan_id: str):
    p = await get_pool()
    row = await p.fetchrow(
        "SELECT status, progress, progress_message FROM scans WHERE id = $1",
        scan_id,
    )
    if not row:
        return {"status": "not_found"}
    return {
        "status": row["status"],
        "progress": row["progress"],
        "progress_message": row["progress_message"],
    }


@router.get("/{scan_id}/pdf")
async def get_pdf(scan_id: str):
    p = await get_pool()
    row = await p.fetchrow(
        "SELECT pdf_url, is_paid FROM scans WHERE id = $1", scan_id
    )
    if not row or not row["is_paid"] or not row["pdf_url"]:
        return {"error": "not_available"}
    return FileResponse(row["pdf_url"], media_type="application/pdf", filename="GEO-Report.pdf")
