"use client";

import { useState } from "react";

export function SaveShareButtons() {
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      setShared(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setSaved((prev) => !prev)}
        className="flex items-center gap-1 font-label-md text-label-md font-semibold text-on-surface"
      >
        <span className="material-symbols-outlined text-[20px]">{saved ? "favorite" : "favorite_border"}</span>
        {saved ? "Saved" : "Save"}
      </button>
      <button
        type="button"
        onClick={share}
        className="flex items-center gap-1 font-label-md text-label-md font-semibold text-on-surface"
      >
        <span className="material-symbols-outlined text-[20px]">share</span>
        {shared ? "Copied!" : "Share"}
      </button>
    </div>
  );
}
