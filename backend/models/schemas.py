from typing import Optional
from pydantic import BaseModel


class ScanRequest(BaseModel):
    url: str
    scan_id: str


class ScanStatusResponse(BaseModel):
    status: str
    progress: int
    progress_message: Optional[str] = None
