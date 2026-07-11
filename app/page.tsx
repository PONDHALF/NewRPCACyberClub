import Link from "next/link";
import { listChallenges } from "@/lib/challenges";
import ChallengeCard from "./ChallengeCard";

export const dynamic = "force-dynamic";

export default function Home() {
  const challenges = listChallenges();

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Nav */}
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface font-mono text-accent">
              &gt;_
            </span>
            <span className="font-mono text-sm font-semibold tracking-tight text-gradient">
              New-RPCA-Cyber-Club
            </span>
          </div>
          <Link
            href="/admin"
            className="btn-secondary btn-press rounded-lg px-4 py-2 text-sm"
          >
            Admin
          </Link>
        </nav>

        {/* Hero */}
        <header className="mt-16 mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
            CAPTURE THE FLAG
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Welcome to <span className="text-gradient">RPCA Cyber Club</span>
          </h1>
          <p className="mt-3 max-w-xl text-muted">
            Browse the challenges below and download the files to get started.
            Good luck, and happy hacking.
          </p>
        </header>

        {/* List */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-sm uppercase tracking-widest text-muted">
            Challenges
          </h2>
          <span className="font-mono text-sm text-muted">
            {String(challenges.length).padStart(2, "0")} total
          </span>
        </div>

        {challenges.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 rounded-2xl py-20 text-center">
            <span className="font-mono text-3xl text-muted">{"{ }"}</span>
            <p className="text-muted">No challenges published yet.</p>
            <p className="text-sm text-muted/70">Check back soon.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {challenges.map((c, i) => (
              <ChallengeCard key={c.id} challenge={c} index={i} />
            ))}
          </ul>
        )}

        <footer className="mt-16 border-t border-border pt-6 text-center font-mono text-xs text-muted/60">
          New-RPCA-Cyber-Club · CTF Challenge Vault
        </footer>
      </div>
    </div>
  );
}
