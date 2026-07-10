"use client";

import { useActionState, useEffect, useRef } from "react";
import { createChallengeAction, type CreateState } from "./actions";

const initialState: CreateState = {};

export default function CreateChallengeForm() {
  const [state, formAction, pending] = useActionState(
    createChallengeAction,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the form after a successful upload.
  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="card rounded-2xl p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <span className="font-mono text-accent">+</span> Add challenge
      </h2>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1.5">
          <label
            htmlFor="name"
            className="font-mono text-xs uppercase tracking-wider text-muted"
          >
            Challenge name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Baby RSA"
            required
            className="field rounded-lg px-3 py-2.5"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="file"
            className="font-mono text-xs uppercase tracking-wider text-muted"
          >
            File
          </label>
          <input
            id="file"
            name="file"
            type="file"
            required
            className="field cursor-pointer rounded-lg py-2 pr-3 text-sm text-muted file:mr-3 file:cursor-pointer file:border-0 file:bg-surface file:px-3 file:py-2 file:font-medium file:text-accent"
          />
        </div>
      </div>

      {state.error && (
        <p className="animate-pop-in mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="animate-pop-in mt-4 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent">
          ✓ Challenge added.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary mt-5 rounded-lg px-5 py-2.5"
      >
        {pending ? "Uploading…" : "Add challenge"}
      </button>
    </form>
  );
}
