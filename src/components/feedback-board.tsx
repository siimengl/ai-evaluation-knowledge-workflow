"use client";

import { useId, useState } from "react";
import Link from "next/link";
import type { FeedbackItem, KnowledgeEntry } from "@/data/types";
import { FeedbackDispositionBadge } from "@/components/feedback-disposition-badge";

/**
 * Client-side feedback board (Phase 6, PROJECT_SPEC.md §10).
 *
 * Renders the pre-authored `FeedbackItem` list plus a submission form. The
 * form only ever creates `Open` items — a site visitor can submit feedback,
 * but never set its disposition, keeping "feedback submission" and "the
 * human decision that accepts/rejects it" structurally distinct (mirrors
 * §8's "only a human decides" principle). Anything submitted here lives in
 * local component state only: it is never written to a file, API route, or
 * any store that survives a reload. That is disclosed inline, not just in
 * a transient toast, so it can't be mistaken for a live/persisted action.
 */

const PENDING_RATIONALE =
  "Not yet reviewed — this is a demo submission; awaiting a human disposition decision.";

export function FeedbackBoard({
  initialItems,
  knowledgeEntries,
}: {
  initialItems: FeedbackItem[];
  knowledgeEntries: KnowledgeEntry[];
}) {
  const [items, setItems] = useState<FeedbackItem[]>(initialItems);
  const [submittedBy, setSubmittedBy] = useState("");
  const [knowledgeEntryId, setKnowledgeEntryId] = useState(
    knowledgeEntries[0]?.id ?? "",
  );
  const [note, setNote] = useState("");
  const [justSubmitted, setJustSubmitted] = useState(false);
  const formId = useId();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!submittedBy.trim() || !note.trim() || !knowledgeEntryId) return;

    const newItem: FeedbackItem = {
      id: `local-${items.length}-${Math.round(performance.now())}`,
      knowledgeEntryId,
      submittedBy: submittedBy.trim(),
      note: note.trim(),
      dateSubmitted: "Just now (demo — not a real timestamp)",
      disposition: "Open",
      dispositionRationale: PENDING_RATIONALE,
    };

    setItems((prev) => [newItem, ...prev]);
    setSubmittedBy("");
    setNote("");
    setJustSubmitted(true);
  }

  return (
    <div className="mt-10 space-y-12">
      {/* Persistence disclosure — inline and always visible, not a
          dismissible toast, per PROJECT_SPEC.md §10. */}
      <div className="rounded-lg border-2 border-dashed border-border-subtle bg-surface p-4 text-sm text-foreground/80">
        <p className="font-semibold text-foreground">
          Demo only — not persisted.
        </p>
        <p className="mt-1 text-foreground/70">
          The list below starts from pre-authored mock feedback items. If you
          submit the form, it is added to this page&apos;s local state only —
          nothing is written to a file, database, or API. Reload the page and
          any submission you made disappears.
        </p>
      </div>

      {/* Submission form — always produces an Open item; disposition is
          never settable from here. */}
      <section aria-labelledby={`${formId}-heading`}>
        <h2
          id={`${formId}-heading`}
          className="text-xs font-semibold uppercase tracking-widest text-muted"
        >
          Submit Feedback
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">
          Submitting here only creates an <strong>Open</strong> item — a
          human disposition step (Accepted → New Version, or Rejected) is a
          separate, deliberately human action, never automatic.
        </p>
        <form onSubmit={handleSubmit} className="mt-5 max-w-2xl space-y-4">
          <div>
            <label
              htmlFor={`${formId}-submittedBy`}
              className="block text-sm font-medium text-foreground"
            >
              Your name (synthetic persona)
            </label>
            <input
              id={`${formId}-submittedBy`}
              type="text"
              required
              value={submittedBy}
              onChange={(event) => setSubmittedBy(event.target.value)}
              placeholder="e.g. Alex Rivera, Associate (synthetic)"
              className="mt-1 w-full rounded-md border border-border-subtle bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
          <div>
            <label
              htmlFor={`${formId}-knowledgeEntryId`}
              className="block text-sm font-medium text-foreground"
            >
              Knowledge entry
            </label>
            <select
              id={`${formId}-knowledgeEntryId`}
              required
              value={knowledgeEntryId}
              onChange={(event) => setKnowledgeEntryId(event.target.value)}
              className="mt-1 w-full rounded-md border border-border-subtle bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            >
              {knowledgeEntries.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.title} ({entry.version})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor={`${formId}-note`}
              className="block text-sm font-medium text-foreground"
            >
              Feedback note
            </label>
            <textarea
              id={`${formId}-note`}
              required
              rows={4}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Describe what happened when you used this guidance..."
              className="mt-1 w-full rounded-md border border-border-subtle bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
          <button
            type="submit"
            className="rounded-md border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Submit feedback (demo only)
          </button>
          {justSubmitted && (
            <p role="status" className="text-sm text-status-approved">
              Added to this page&apos;s local state as an Open item — not
              persisted, and it will reset on reload.
            </p>
          )}
        </form>
      </section>

      {/* Feedback list */}
      <section aria-labelledby="feedback-list-heading">
        <h2
          id="feedback-list-heading"
          className="text-xs font-semibold uppercase tracking-widest text-muted"
        >
          Feedback Items
        </h2>
        <ul className="mt-5 space-y-4">
          {items.map((item) => {
            const entry = knowledgeEntries.find(
              (candidate) => candidate.id === item.knowledgeEntryId,
            );
            return (
              <li
                key={item.id}
                className="rounded-lg border border-border-subtle p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.submittedBy}
                    </p>
                    <p className="text-xs text-muted">
                      {item.dateSubmitted} · re:{" "}
                      {entry ? (
                        <Link
                          href={`/knowledge/${entry.id}`}
                          className="underline-offset-2 hover:underline"
                        >
                          {entry.title}
                        </Link>
                      ) : (
                        item.knowledgeEntryId
                      )}
                    </p>
                  </div>
                  <FeedbackDispositionBadge disposition={item.disposition} />
                </div>

                <p className="mt-3 text-sm leading-6 text-foreground/85">
                  {item.note}
                </p>

                <div className="mt-4 rounded-md border border-border-subtle bg-surface p-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Disposition rationale (human decision)
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-foreground/80">
                    {item.dispositionRationale}
                  </p>
                  {item.resultingVersion && entry && (
                    <p className="mt-2 text-sm text-status-approved">
                      Produced{" "}
                      <Link
                        href={`/knowledge/${entry.id}`}
                        className="font-medium underline-offset-2 hover:underline"
                      >
                        {entry.title} {item.resultingVersion}
                      </Link>{" "}
                      — see its version history for the full change.
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
