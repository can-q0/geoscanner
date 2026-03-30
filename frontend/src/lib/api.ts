const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_KEY = process.env.API_SECRET_KEY || "geoscanner-internal-api-key-2026";

export async function backendFetch(path: string, options: RequestInit = {}) {
  const url = `${API_URL}${path}`;
  console.log(`[backendFetch] ${options.method || "GET"} ${url}`);
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        ...options.headers,
      },
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`[backendFetch] ${res.status}: ${text}`);
      throw new Error(`Backend returned ${res.status}: ${text}`);
    }
    return res.json();
  } catch (err) {
    console.error(`[backendFetch] Error calling ${url}:`, err);
    throw err;
  }
}

export async function startQuickScan(url: string, scanId: string) {
  return backendFetch("/scan/quick", {
    method: "POST",
    body: JSON.stringify({ url, scan_id: scanId }),
  });
}

export async function startFullAudit(url: string, scanId: string) {
  return backendFetch("/scan/full", {
    method: "POST",
    body: JSON.stringify({ url, scan_id: scanId }),
  });
}
