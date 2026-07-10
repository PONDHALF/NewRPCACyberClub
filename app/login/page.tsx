"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-surface font-mono text-lg text-accent shadow-[0_0_24px_-6px_var(--accent)]">
            &gt;_
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Admin Access</h1>
          <p className="mt-1 text-sm text-muted">
            Sign in to manage challenges.
          </p>
        </div>

        <form
          action={formAction}
          className="card flex flex-col gap-4 rounded-2xl p-6"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="font-mono text-xs uppercase tracking-wider text-muted"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="field rounded-lg px-3 py-2.5"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="font-mono text-xs uppercase tracking-wider text-muted"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="field rounded-lg px-3 py-2.5"
            />
          </div>

          {state.error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="btn-primary mt-1 rounded-lg px-4 py-2.5"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="font-mono text-xs text-muted transition-colors hover:text-accent"
          >
            ← back to challenges
          </Link>
        </div>
      </div>
    </div>
  );
}
