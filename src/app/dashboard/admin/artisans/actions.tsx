"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  artisanUserId: string;
}

export function ArtisanReviewActions({ artisanUserId }: Props) {
  const router = useRouter();
  const [action, setAction] = useState<"idle" | "approving" | "declining">("idle");
  const [message, setMessage] = useState("");

  async function handleAction(type: "approve" | "decline") {
    setAction(type === "approve" ? "approving" : "declining");
    setMessage("");

    try {
      const res = await fetch("/api/admin/review-artisan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artisanUserId, action: type }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || "Failed");
        return;
      }

      router.refresh();
    } catch {
      setMessage("Something went wrong");
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {message && (
        <span className="text-xs text-red-500">{message}</span>
      )}
      <button
        onClick={() => handleAction("approve")}
        disabled={action !== "idle"}
        className="rounded-full bg-green-600 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
      >
        {action === "approving" ? "..." : "✓ Approve"}
      </button>
      <button
        onClick={() => handleAction("decline")}
        disabled={action !== "idle"}
        className="rounded-full border border-red-300 px-4 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
      >
        {action === "declining" ? "..." : "✕ Decline"}
      </button>
    </div>
  );
}
