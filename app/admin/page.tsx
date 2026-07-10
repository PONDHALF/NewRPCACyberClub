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
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-red-500/50 hover:text-red-400"
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
              <li
                key={c.id}
                className="card flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-surface-2 font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <form
                  action={renameChallengeAction}
                  className="flex flex-1 items-center gap-2"
                >
                  <input type="hidden" name="id" value={c.id} />
                  <input
                    name="name"
                    defaultValue={c.name}
                    aria-label="Challenge name"
                    className="field min-w-0 flex-1 rounded-lg px-3 py-2"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    Save
                  </button>
                </form>

                <div className="flex items-center gap-2">
                  <a
                    href={`/download/${c.id}`}
                    className="max-w-[10rem] truncate rounded-lg border border-border px-3 py-2 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-accent"
                    title={c.file_name}
                  >
                    {c.file_name}
                  </a>
                  <DeleteButton id={c.id} name={c.name} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
