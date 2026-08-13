import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  KNOWLEDGE_ENTRIES,
  getKnowledgeEntryById,
} from "@/data/knowledge-entries";
import { getEvaluationById } from "@/data/evaluations";
import { getUseCaseById } from "@/data/use-cases";
import { getHumanReviewByEvaluationId } from "@/data/human-reviews";
import { KnowledgeStatusBadge } from "@/components/knowledge-status-badge";
import { DecisionBadge } from "@/components/decision-badge";
import { ActorTag } from "@/components/actor-tag";

/**
 * Knowledge Entry detail.
 *
 * Presents one guidance entry in full: scope, approved use, limitations,
 * prompt guidance, owner, version history, and — critically — a visible
 * trace back to the evaluation and human review that produced it, so this
 * page can never be mistaken for guidance that appeared without a source.
 */

export function generateStaticParams() {
  return KNOWLEDGE_ENTRIES.map((entry) => ({ id: entry.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/knowledge/[id]">): Promise<Metadata> {
  const { id } = await params;
  const entry = getKnowledgeEntryById(id);

  if (!entry) {
    return { title: "Knowledge Entry" };
  }

  return {
    title: entry.title,
    description: entry.approvedUse,
  };
}

export default async function KnowledgeEntryDetailPage({
  params,
}: PageProps<"/knowledge/[id]">) {
  const { id } = await params;
  const entry = getKnowledgeEntryById(id);

  if (!entry) {
    notFound();
  }

  const evaluation = getEvaluationById(entry.sourceEvaluationId);
  const useCase = evaluation ? getUseCaseById(evaluation.useCaseId) : undefined;
  const review = getHumanReviewByEvaluationId(entry.sourceEvaluationId);

  return (
    <main className="flex-1">
      <section className="workspace-container py-12">
        <Link
          href="/knowledge"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← All knowledge entries
        </Link>

        <div className="mt-4 flex flex-col gap-4 border-b border-border-subtle pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {entry.title}
            </h1>
            <p className="mt-2 text-sm text-foreground/70">
              Owner: {entry.owner} · {entry.version} · last updated{" "}
              {entry.date}
            </p>
          </div>
          <KnowledgeStatusBadge status={entry.status} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="min-w-0 space-y-10">
            <section aria-labelledby="approved-use-heading">
              <h2
                id="approved-use-heading"
                className="text-xs font-semibold uppercase tracking-widest text-muted"
              >
                Approved Use
              </h2>
              <p className="mt-3 text-sm leading-6 text-foreground/85">
                {entry.approvedUse}
              </p>
            </section>

            <section aria-labelledby="limitations-heading">
              <h2
                id="limitations-heading"
                className="text-xs font-semibold uppercase tracking-widest text-muted"
              >
                Known Limitations
              </h2>
              <p className="mt-3 text-sm leading-6 text-foreground/85">
                {entry.knownLimitations}
              </p>
            </section>

            <section aria-labelledby="required-review-heading">
              <h2
                id="required-review-heading"
                className="text-xs font-semibold uppercase tracking-widest text-muted"
              >
                Required Review
              </h2>
              <p className="mt-3 text-sm leading-6 text-foreground/85">
                {entry.requiredReview}
              </p>
            </section>

            <section aria-labelledby="prompt-guidance-heading">
              <h2
                id="prompt-guidance-heading"
                className="text-xs font-semibold uppercase tracking-widest text-muted"
              >
                Prompt Guidance
              </h2>
              <p className="mt-3 text-sm leading-6 text-foreground/85">
                {entry.promptGuidance}
              </p>
            </section>

            <section aria-labelledby="version-history-heading">
              <h2
                id="version-history-heading"
                className="text-xs font-semibold uppercase tracking-widest text-muted"
              >
                Version History
              </h2>
              <p className="mt-2 text-sm text-foreground/70">
                Currently a single entry — version increments only happen
                through a reviewed feedback disposition or an equivalent
                governance decision, never silently.
              </p>
              <ol className="mt-4 space-y-3">
                {entry.versionHistory.map((versionEntry) => (
                  <li
                    key={versionEntry.version}
                    className="rounded-lg border border-border-subtle bg-surface p-4"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {versionEntry.version}
                      </p>
                      <p className="text-xs text-muted">
                        {versionEntry.date}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-foreground/80">
                      {versionEntry.changeSummary}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Changed by {versionEntry.changedBy}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* Side rail — traceability back to the originating evaluation
              and Human Review, kept visually separate so this entry never
              reads as guidance that appeared from nowhere. */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:h-fit">
            <div className="rounded-lg border border-border-subtle p-5">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
                Source Evaluation
              </h2>
              {evaluation && useCase ? (
                <>
                  <Link
                    href={`/evaluations/${evaluation.id}`}
                    className="mt-3 block text-sm font-medium text-foreground underline-offset-2 hover:underline"
                  >
                    {useCase.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted">
                    {evaluation.tool} (simulated) · {evaluation.caseType}
                  </p>
                </>
              ) : (
                <p className="mt-3 text-sm text-foreground/70">
                  Source evaluation not found.
                </p>
              )}
            </div>

            {review && (
              <div className="rounded-lg border-2 border-actor-human-border bg-actor-human-bg p-5">
                <div className="flex items-center gap-2">
                  <ActorTag actorType="Human" />
                  <p className="text-sm font-semibold text-foreground">
                    {review.reviewerName}
                  </p>
                </div>
                <p className="mt-0.5 text-xs text-muted">
                  {review.reviewerRole} · reviewed {review.date}
                </p>
                <div className="mt-3">
                  <DecisionBadge decision={review.decision} />
                </div>
                <p className="mt-4 text-xs leading-5 text-muted">
                  This entry exists because this human review decision met
                  the publish-eligibility bar (Approved / Approved with
                  Controls). The decision itself is scoped to this
                  case&apos;s specific synthetic use case and test
                  configuration, not a general verdict on{" "}
                  {evaluation?.tool ?? "the underlying tool"} (simulated).
                </p>
              </div>
            )}

            <p className="text-xs leading-5 text-muted">
              This guidance describes what a human reviewer found and
              approved for a specific, scoped use case in this prototype —
              it is not legal advice and should not be treated as
              unconditionally reliable outside the required review noted
              above.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
