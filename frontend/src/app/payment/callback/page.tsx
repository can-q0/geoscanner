"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");

  useEffect(() => {
    const token = searchParams.get("token");
    const scanId = searchParams.get("scanId");

    if (!token && scanId) {
      router.push(`/scan/${scanId}`);
      return;
    }

    if (token) {
      fetch("/api/payment/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, status: "success" }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.scanId) {
            setStatus("success");
            setTimeout(() => router.push(`/scan/${data.scanId}`), 2000);
          } else {
            setStatus("error");
          }
        })
        .catch(() => setStatus("error"));
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        {status === "processing" && (
          <>
            <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-emerald-400" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-gray-400">Processing payment...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="text-5xl mb-4">&#10003;</div>
            <p className="text-emerald-400 text-lg font-medium">Payment successful!</p>
            <p className="text-gray-400 mt-2">Redirecting to your full report...</p>
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-red-400 text-lg mb-4">Payment verification failed</p>
            <button onClick={() => router.push("/dashboard")} className="text-emerald-400 hover:underline">
              Go to dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400">Loading...</p>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  );
}
