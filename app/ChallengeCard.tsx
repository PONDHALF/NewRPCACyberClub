"use client";

import { useState } from "react";
import type { Challenge } from "@/lib/challenges";

function formatSize(bytes: number | null): string {
  if (bytes == null) return "";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

export default function ChallengeCard({
  challenge: c,
  index,
}: {
  challenge: Challenge;
  index: number;
}) {
  const [showHint, setShowHint] = useState(false);

  return (
    <li className="card card-hover rounded-xl px-5 py-4">
      <div className="flex items-center gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-border bg-surface-2 font-mono text-sm text-accent">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-foreground">{c.name}</p>
          <p className="mt-0.5 flex items-center gap-2 font-mono text-xs text-muted">
            <span className="truncate">{c.file_name}</span>
            {c.file_size != null && (
              <span className="shrink-0 rounded bg-surface-2 px-1.5 py-0.5">
                {formatSize(c.file_size)}
              </span>
            )}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {c.hint && (
            <button
              type="button"
              onClick={() => setShowHint((v) => !v)}
              aria-expanded={showHint}
              className="btn-secondary btn-press flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                <path d="M9 18h6" />
                <path d="M10 22h4" />
              </svg>
              <span className="hidden sm:inline">
                {showHint ? "Hide Hint" : "View Hint"}
              </span>
            </button>
          )}

          <a
            href={`/download/${c.id}`}
            className="btn-secondary btn-press flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </div>

      {showHint && c.hint && (
        <p className="animate-pop-in mt-3 flex items-start gap-1.5 rounded-lg border border-accent/20 bg-accent/5 px-3 py-2 text-xs text-accent/90">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 h-3.5 w-3.5 shrink-0"
          >
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
          </svg>
          <span className="whitespace-pre-line">{c.hint}</span>
        </p>
      )}
    </li>
  );
}
