import Link from "next/link";
import { listChallenges } from "@/lib/challenges";

export const dynamic = "force-dynamic";

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
            href="/login"
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-accent/50 hover:text-foreground"
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
              <li key={c.id}>
                <a
                  href={`/download/${c.id}`}
                  className="card card-hover group flex items-center gap-4 rounded-xl px-5 py-4"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-border bg-surface-2 font-mono text-sm text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">
                      {c.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-2 font-mono text-xs text-muted">
                      <span className="truncate">{c.file_name}</span>
                      {c.file_size != null && (
                        <span className="shrink-0 rounded bg-surface-2 px-1.5 py-0.5">
                          {formatSize(c.file_size)}
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted transition-colors group-hover:border-accent/50 group-hover:text-accent">
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
                    Download
                  </span>
                </a>
              </li>
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
