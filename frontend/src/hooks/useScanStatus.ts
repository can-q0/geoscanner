"use client";

import { useState, useEffect, useCallback } from "react";

interface ScanData {
  id: string;
  url: string;
  domain: string;
  scanType: string;
  status: string;
  progress: number;
  progressMessage: string | null;
  geoScore: number | null;
  scoresSummary: Record<string, unknown> | null;
  isPaid: boolean;
  resultsFull: Record<string, unknown> | null;
  pdfUrl: string | null;
  createdAt: string;
  completedAt: string | null;
  errorMessage: string | null;
}

export function useScanStatus(scanId: string) {
  const [data, setData] = useState<ScanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/scan/${scanId}`);
      if (!res.ok) {
        setError("Failed to fetch scan status");
        return;
      }
      const scanData = await res.json();
      setData(scanData);
      setError(null);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [scanId]);

  useEffect(() => {
    fetchStatus();

    // Poll while processing
    const interval = setInterval(() => {
      if (data?.status === "completed" || data?.status === "failed" || data?.status === "pending_payment") {
        clearInterval(interval);
        return;
      }
      fetchStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchStatus, data?.status]);

  return { data, loading, error, refetch: fetchStatus };
}
