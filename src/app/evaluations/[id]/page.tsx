import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EVALUATIONS, getEvaluationById } from "@/data/evaluations";
import { getUseCaseById } from "@/data/use-cases";
import { getHumanReviewByEvaluationId } from "@/data/human-reviews";
import { StatusBadge } from "@/components/status-badge";
import { ActorTag } from "@/components/actor-tag";
import { DimensionScoreCard } from "@/components/dimension-score";
import { DecisionBadge } from "@/components/decision-badge";
import { EVALUATION_DIMENSIONS } from "@/lib/evaluation-dimensions";

/**
 * Phase 3 — Evaluation Workspace (IMPLEMENTATION_PLAN.md Phase 3), with the
 * Human Review section now populated (Phase 4).
 *
 * Renders one case in full: use-case intake, a source-to-output comparison
 * panel, structured scoring, failure mode, review boundary, and the
 * recorded Human Review. The Human Review panel is deliberately styled to
 * read as a distinct, human-attributed record — not more AI output, and not
 * an interleaved continuation of the structured scoring above it. Links to
 * /knowledge/[id] and /evidence/[id] remain omitted; neither exists yet.
 */

export function generateStaticParams() {
  return EVALUATIONS.map((evaluation) => ({ id: evaluation.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/evaluations/[id]">): Promise<Metadata> {
  const { id } = await params;
  const evaluation = getEvaluationById(id);
  const useCase = evaluation ? getUseCaseById(evaluation.useCaseId) : undefined;

  if (!evaluation || !useCase) {
    return { title: "Evaluation" };
  }

  return {
    title: useCase.title,
    description: `${evaluation.tool} (simulated) — ${evaluation.caseType} evaluation case.`,
  };
}

export default async function EvaluationDetailPage({
  params,
}: PageProps<"/evaluations/[id]">) {
  const { id } = await params;
  const evaluation = getEvaluationById(id);
  const useCase = evaluation ? getUseCaseById(evaluation.useCaseId) : undefined;

  if (!evaluation || !useCase) {
    notFound();
  }

  const review = getHumanReviewByEvaluationId(evaluation.id);

  return (
    <main className="flex-1">
      <section className="workspace-container py-12">
        <Link
          href="/evaluations"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← All evaluations
        </Link>

        {/* Case header — at-a-glance identity for a dense review workspace. */}
        <div className="mt-4 flex flex-col gap-4 border-b border-border-subtle pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {useCase.title}
            </h1>
            <p className="mt-2 text-sm text-foreground/70">
              {evaluation.tool} (simulated) · {evaluation.caseType} ·
              submitted {useCase.dateSubmitted}
            </p>
          </div>
          <StatusBadge status={evaluation.status} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="min-w-0 space-y-10">
            {/* Use-Case Intake */}
            <section aria-labelledby="intake-heading">
              <h2
                id="intake-heading"
                className="text-xs font-semibold uppercase tracking-widest text-muted"
              >
                Use-Case Intake
              </h2>
              <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-foreground/60">Submitted by</dt>
                  <dd className="mt-0.5 text-foreground/90">
                    {useCase.submittedBy}
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground/60">Target tool</dt>
                  <dd className="mt-0.5 text-foreground/90">
                    {useCase.targetTool}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-foreground/60">Business context</dt>
                  <dd className="mt-0.5 leading-6 text-foreground/90">
                    {useCase.businessContext}
                  </dd>
                </div>
              </dl>
            </section>

            {/* Source-to-output evidence: the two questions "what did the
                source say" and "what did the simulated output say" answered
                side by side, using the case's existing text unchanged, so
                the gap between them is directly comparable. */}
            <section aria-labelledby="evidence-heading">
              <h2
                id="evidence-heading"
                className="text-xs font-semibold uppercase tracking-widest text-muted"
              >
                Source-to-Output Evidence
              </h2>
              <p className="mt-2 text-sm text-foreground/70">
                What the synthetic source actually said, next to what the
                simulated tool produced from it — compare directly before
                reading the scoring below.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border-subtle bg-surface p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      Synthetic Source Material
                    </h3>
                  </div>
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-foreground/85">
                    {evaluation.inputSummary}
                  </p>
                </div>
                <div className="rounded-lg border border-actor-ai-border bg-actor-ai-bg p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      Simulated AI Output
                    </h3>
                    <ActorTag actorType="AI" />
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {evaluation.tool} (simulated)
                  </p>
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-foreground/85">
                    {evaluation.aiOutput}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted">
                This output is what the simulated tool produced — not a
                reviewed or approved result. See Structured Evaluation and
                Human Review below for what a reviewer made of it.
              </p>
            </section>

            {/* Structured Evaluation */}
            <section aria-labelledby="scoring-heading">
              <h2
                id="scoring-heading"
                className="text-xs font-semibold uppercase tracking-widest text-muted"
              >
                Structured Evaluation
              </h2>
              <p className="mt-2 text-sm text-foreground/70">
                Each dimension is scored 1–5 with a written rationale — the
                score alone is never the record.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {EVALUATION_DIMENSIONS.map((dimension) => (
                  <DimensionScoreCard
                    key={dimension.key}
                    meta={dimension}
                    score={evaluation.scores[dimension.key]}
                  />
                ))}
              </div>
            </section>

            {/* Human Review — Phase 4. Rendered with a heavier border, a
                tinted background, and an actor tag so it is unmistakably
                distinct from the AI-output panel above: the AI's output is
                a simulated artifact under review; this panel is the
                accountable human decision made about it. */}
            <section aria-labelledby="review-heading">
              <h2
                id="review-heading"
                className="text-xs font-semibold uppercase tracking-widest text-muted"
              >
                Human Review
              </h2>
              {review ? (
                <div className="mt-4 rounded-lg border-2 border-actor-human-border bg-actor-human-bg p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <ActorTag actorType="Human" />
                        <p className="text-sm font-semibold text-foreground">
                          {review.reviewerName}
                        </p>
                      </div>
                      <p className="mt-0.5 text-xs text-muted">
                        {review.reviewerRole} · reviewed {review.date}
                      </p>
                    </div>
                    <DecisionBadge decision={review.decision} />
                  </div>

                  <div className="mt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">
                      Rationale
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-foreground/85">
                      {review.rationale}
                    </p>
                  </div>

                  {review.conditions && review.conditions.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">
                        Controls / Required Review
                      </h3>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-foreground/85">
                        {review.conditions.map((condition, i) => (
                          <li key={i}>{condition}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="mt-5 border-t border-actor-human-border/60 pt-4 text-xs leading-5 text-muted">
                    This decision is scoped to this case&apos;s specific
                    synthetic use case and test configuration — a{" "}
                    <strong className="font-medium text-foreground/80">
                      {review.decision}
                    </strong>{" "}
                    outcome here means &ldquo;{evaluation.caseType.toLowerCase()},
                    as tested in this case,&rdquo; not a general verdict on{" "}
                    {evaluation.tool} (simulated) as a tool. Recorded by a
                    labeled human reviewer persona — this app has no login
                    system and this is not a real reviewer account.
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-lg border border-dashed border-border-subtle p-5">
                  <p className="text-sm text-foreground/70">
                    Not yet recorded. This evaluation does not have a Human
                    Review yet, and none of the content above should be read
                    as reviewed or approved.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Side rail: failure evidence, kept visually separate from both
              the AI output and the structured scores so it reads as the
              reviewer-facing "why this matters," not more AI output. */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:h-fit">
            <div className="rounded-lg border border-border-subtle p-5">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
                Failure Mode
              </h2>
              <p className="mt-3 text-sm font-medium text-foreground">
                {evaluation.failureMode.category}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-muted">
                {evaluation.failureMode.severity} severity — impact if
                unreviewed
              </p>
              <p className="mt-3 text-sm leading-6 text-foreground/80">
                {evaluation.failureMode.description}
              </p>
            </div>

            <div className="rounded-lg border border-border-subtle bg-surface p-5">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
                Review Boundary
              </h2>
              <p className="mt-3 text-sm leading-6 text-foreground/80">
                {evaluation.reviewBoundary}
              </p>
            </div>

            {!review && (
              <p className="text-xs leading-5 text-muted">
                Any decision recorded here will be scoped to this
                case&apos;s specific synthetic use case and test
                configuration — never a general verdict on{" "}
                {evaluation.tool} (simulated) as a tool.
              </p>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
