import { requireAdmin } from "@/lib/auth";
import { listChallenges } from "@/lib/challenges";
import { logout } from "@/app/login/actions";
import CreateChallengeForm from "./CreateChallengeForm";
import DeleteButton from "./DeleteButton";
import { renameChallengeAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await requireAdmin();
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
            <div className="leading-tight">
              <p className="font-mono text-sm font-semibold text-gradient">
                Admin Console
              </p>
              <p className="font-mono text-xs text-muted">
                signed in as {session.username}
              </p>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="btn-secondary btn-secondary-warn btn-press rounded-lg px-4 py-2 text-sm"
            >
              Log out
            </button>
          </form>
        </nav>

        {/* Create */}
        <div className="mt-10">
          <CreateChallengeForm />
        </div>

        {/* List */}
        <div className="mt-12 mb-4 flex items-center justify-between">
          <h2 className="font-mono text-sm uppercase tracking-widest text-muted">
            Manage Challenges
          </h2>
          <span className="font-mono text-sm text-muted">
            {String(challenges.length).padStart(2, "0")} total
          </span>
        </div>

        {challenges.length === 0 ? (
          <div className="card rounded-2xl py-14 text-center text-muted">
            No challenges yet — add your first one above.
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {challenges.map((c, i) => (
              <li key={c.id} className="card rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-surface-2 font-mono text-xs text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <form
                    id={`rename-${c.id}`}
                    action={renameChallengeAction}
                    className="flex min-w-0 flex-1 flex-col gap-2"
                  >
                    <input type="hidden" name="id" value={c.id} />
                    <input
                      name="name"
                      defaultValue={c.name}
                      aria-label="Challenge name"
                      className="field w-full rounded-lg px-3 py-2 font-medium"
                    />
                    <textarea
                      name="hint"
                      defaultValue={c.hint ?? ""}
                      rows={2}
                      aria-label="Hint"
                      placeholder="Hint (optional) — shown to players"
                      className="field w-full resize-y rounded-lg px-3 py-2 text-sm"
                    />
                  </form>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3 pl-12">
                  <a
                    href={`/download/${c.id}`}
                    className="btn-secondary btn-press flex h-9 min-w-0 items-center gap-1.5 truncate rounded-lg px-3 text-xs"
                    title={c.file_name}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5 shrink-0"
                    >
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                      <path d="M13 2v7h7" />
                    </svg>
                    <span className="truncate font-mono">{c.file_name}</span>
                  </a>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="submit"
                      form={`rename-${c.id}`}
                      className="btn-secondary btn-press h-9 rounded-lg px-3 text-sm"
                    >
                      Save
                    </button>
                    <DeleteButton id={c.id} name={c.name} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
