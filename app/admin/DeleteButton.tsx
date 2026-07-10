"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteChallengeAction } from "./actions";

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-press rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

export default function DeleteButton({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Delete ${name}`}
        className="btn-press grid h-9 w-9 place-items-center rounded-lg border border-border text-muted transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
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
          <path d="M3 6h18" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" x2="10" y1="11" y2="17" />
          <line x1="14" x2="14" y1="11" y2="17" />
        </svg>
      </button>

      {open && (
        <div
          className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="animate-pop-in card w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Delete challenge?
            </h3>
            <p className="mt-1 text-sm text-muted">
              &ldquo;{name}&rdquo; and its file will be permanently removed.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-press rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                Cancel
              </button>
              <form action={deleteChallengeAction}>
                <input type="hidden" name="id" value={id} />
                <ConfirmButton />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
