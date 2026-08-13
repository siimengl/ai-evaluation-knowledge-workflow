import type { Metadata } from "next";
import Link from "next/link";
import {
  KNOWLEDGE_ENTRIES,
  getNonPublishedEvaluations,
} from "@/data/knowledge-entries";
import { getUseCaseById } from "@/data/use-cases";
import { getHumanReviewByEvaluationId } from "@/data/human-reviews";
import { KnowledgeStatusBadge } from "@/components/knowledge-status-badge";
import { DecisionBadge } from "@/components/decision-badge";

export const metadata: Metadata = {
  title: "Knowledge",
  description:
    "Reusable guidance entries produced from approved evaluation reviews, each traceable to its source evaluation and human decision.",
};

/**
 * Knowledge Hub.
 *
 * Every entry here exists only because its source evaluation passed the
 * publish-eligibility check — an `Approved` or `Approved with Controls`
 * human review decision. Cases 2 and 3 (`Pilot Only`, `Not Recommended`)
 * are reviewed but deliberately do not appear as entries; this page states
 * that explicitly rather than leaving their absence unexplained.
 */
export default function KnowledgePage() {
  const activeEntries = KNOWLEDGE_ENTRIES.filter(
    (entry) => entry.status === "Active",
  );
  const otherEntries = KNOWLEDGE_ENTRIES.filter(
    (entry) => entry.status !== "Active",
  );
  const nonPublished = getNonPublishedEvaluations();

  return (
    <main className="flex-1">
      <section className="workspace-container py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Knowledge</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-foreground/80">
          Reusable guidance entries, each produced from one reviewed
          evaluation and the human decision made about it — not written from
          scratch. Every entry below carries its approved use, known
          limitations, required review, prompt guidance, owner, and version,
          and links back to the evaluation and human review that produced
          it.
        </p>
        <p className="mt-3 max-w-3xl text-sm text-foreground/60">
          A knowledge entry is created only from a human review decision of{" "}
          <span className="font-medium text-foreground/80">Approved</span> or{" "}
          <span className="font-medium text-foreground/80">
            Approved with Controls
          </span>{" "}
          — enforced by a publish-eligibility gate in code, not just by
          hand-authoring correctly. See &ldquo;Not Published&rdquo; below for
          the reviewed cases that did not meet that bar.
        </p>

        {/* Active entries — the default-visible set. */}
        <div className="mt-10 overflow-x-auto rounded-lg border border-border-subtle">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-surface text-left text-xs font-semibold uppercase tracking-wide text-muted">
                <th scope="col" className="px-4 py-3">
                  Title
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
                <th scope="col" className="px-4 py-3">
                  Owner
                </th>
                <th scope="col" className="px-4 py-3">
                  Version
                </th>
                <th scope="col" className="px-4 py-3">
                  Source Evaluation
                </th>
                <th scope="col" className="px-4 py-3">
                  Last Reviewed
                </th>
              </tr>
            </thead>
            <tbody>
              {activeEntries.map((entry) => {
                const review = getHumanReviewByEvaluationId(
                  entry.sourceEvaluationId,
                );
                return (
                  <tr
                    key={entry.id}
                    className="border-b border-border-subtle last:border-b-0 hover:bg-surface"
                  >
                    <td className="px-4 py-4 align-top">
                      <Link
                        href={`/knowledge/${entry.id}`}
                        className="font-medium text-foreground underline-offset-2 hover:underline"
                      >
                        {entry.title}
                      </Link>
                      {review && (
                        <p className="mt-1 text-xs text-muted">
                          Source decision: {review.decision}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <KnowledgeStatusBadge status={entry.status} />
                    </td>
                    <td className="px-4 py-4 align-top text-foreground/80">
                      {entry.owner}
                    </td>
                    <td className="px-4 py-4 align-top text-foreground/80">
                      {entry.version}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <Link
                        href={`/evaluations/${entry.sourceEvaluationId}`}
                        className="text-foreground/80 underline-offset-2 hover:underline"
                      >
                        {entry.sourceEvaluationId}
                      </Link>
                    </td>
                    <td className="px-4 py-4 align-top text-foreground/80">
                      {entry.date}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Deprecated / Superseded — visible but visually de-emphasized.
            None exist yet, since version increments only happen through a
            reviewed update to an entry, but the section is honest about
            that rather than omitted, so the lifecycle model reads as real
            even before it has produced a non-Active entry. */}
        <div className="mt-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
            Deprecated / Superseded
          </h2>
          {otherEntries.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {otherEntries.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-surface p-4 opacity-70"
                >
                  <Link
                    href={`/knowledge/${entry.id}`}
                    className="text-sm font-medium text-foreground underline-offset-2 hover:underline"
                  >
                    {entry.title}
                  </Link>
                  <KnowledgeStatusBadge status={entry.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-foreground/60">
              No entries have been deprecated or superseded yet — every
              published entry is still on its initial version.
            </p>
          )}
        </div>

        {/* Non-published — Cases 2 and 3, represented explicitly rather
            than silently absent. */}
        <div className="mt-14 border-t border-border-subtle pt-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
            Not Published
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-foreground/70">
            These evaluations were reviewed by a labeled human reviewer but
            did not receive a decision that meets the publish-eligibility
            bar. They are not missing knowledge entries — they are reviewed
            cases whose outcome was a scoped pilot or a non-recommendation,
            and the prototype represents that outcome as-is rather than
            manufacturing guidance around it.
          </p>
          <ul className="mt-5 space-y-3">
            {nonPublished.map((evaluation) => {
              const useCase = getUseCaseById(evaluation.useCaseId);
              const review = getHumanReviewByEvaluationId(evaluation.id);
              return (
                <li
                  key={evaluation.id}
                  className="rounded-lg border border-dashed border-border-subtle p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link
                      href={`/evaluations/${evaluation.id}`}
                      className="text-sm font-medium text-foreground underline-offset-2 hover:underline"
                    >
                      {useCase?.title ?? evaluation.id}
                    </Link>
                    {review && <DecisionBadge decision={review.decision} />}
                  </div>
                  {review && (
                    <p className="mt-2 text-xs leading-5 text-foreground/60">
                      {review.decision === "Pilot Only"
                        ? "A Pilot Only decision represents a scoped, supervised trial outcome — not a publishable, general-use guidance state in this prototype."
                        : "A Not Recommended decision does not produce a knowledge entry — see the evaluation for the reviewer's full rationale."}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}
