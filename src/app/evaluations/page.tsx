import type { Metadata } from "next";
import Link from "next/link";
import { EVALUATIONS } from "@/data/evaluations";
import { getUseCaseById } from "@/data/use-cases";
import { getHumanReviewByEvaluationId } from "@/data/human-reviews";
import { getKnowledgeEntryBySourceEvaluationId } from "@/data/knowledge-entries";
import { StatusBadge } from "@/components/status-badge";
import { DecisionBadge } from "@/components/decision-badge";

export const metadata: Metadata = {
  title: "Evaluations",
  description: "Index of synthetic AI evaluation cases.",
};

/**
 * Phase 3 — full scannable index (IMPLEMENTATION_PLAN.md Phase 3 upgrades
 * this from Phase 2's minimal list to a dense table linking into each
 * case's full `/evaluations/[id]` workspace).
 */
export default function EvaluationsPage() {
  return (
    <main className="flex-1">
      <section className="workspace-container py-16">
        <h1 className="text-4xl font-semibold tracking-tight">
          Evaluations
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-foreground/80">
          Four synthetic evaluation cases, each testing one simulated AI
          tool against one case type. Every case pairs a simulated AI
          output with structured scoring, a named failure mode, and an
          explicit review boundary, plus a labeled human reviewer&apos;s
          decision. Open a case for the full intake, output, scoring, and
          review workspace.
        </p>
        <p className="mt-3 max-w-3xl text-sm text-foreground/60">
          Each decision below is scoped to that case&apos;s specific
          synthetic use case and test configuration — not a general verdict
          on the underlying tool.
        </p>

        <div className="mt-10 overflow-x-auto rounded-lg border border-border-subtle">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-surface text-left text-xs font-semibold uppercase tracking-wide text-muted">
                <th scope="col" className="px-4 py-3">
                  Case
                </th>
                <th scope="col" className="px-4 py-3">
                  Tool
                </th>
                <th scope="col" className="px-4 py-3">
                  Case Type
                </th>
                <th scope="col" className="px-4 py-3">
                  Failure Mode
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
                <th scope="col" className="px-4 py-3">
                  Human Review Decision
                </th>
                <th scope="col" className="px-4 py-3">
                  Knowledge Entry
                </th>
              </tr>
            </thead>
            <tbody>
              {EVALUATIONS.map((evaluation) => {
                const useCase = getUseCaseById(evaluation.useCaseId);
                const review = getHumanReviewByEvaluationId(evaluation.id);
                const knowledgeEntry = getKnowledgeEntryBySourceEvaluationId(
                  evaluation.id,
                );
                return (
                  <tr
                    key={evaluation.id}
                    className="border-b border-border-subtle last:border-b-0 hover:bg-surface"
                  >
                    <td className="px-4 py-4 align-top">
                      <Link
                        href={`/evaluations/${evaluation.id}`}
                        className="font-medium text-foreground underline-offset-2 hover:underline"
                      >
                        {useCase?.title ?? evaluation.id}
                      </Link>
                      <p className="mt-1 text-xs text-muted">
                        {useCase?.submittedBy}
                      </p>
                    </td>
                    <td className="px-4 py-4 align-top text-foreground/80">
                      {evaluation.tool}
                      <span className="text-muted"> (simulated)</span>
                    </td>
                    <td className="px-4 py-4 align-top text-foreground/80">
                      {evaluation.caseType}
                    </td>
                    <td className="px-4 py-4 align-top text-foreground/80">
                      {evaluation.failureMode.category}
                      <p className="mt-0.5 text-xs text-muted">
                        {evaluation.failureMode.severity} severity
                      </p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <StatusBadge status={evaluation.status} />
                    </td>
                    <td className="px-4 py-4 align-top">
                      {review ? (
                        <DecisionBadge decision={review.decision} />
                      ) : (
                        <span className="text-xs text-muted">
                          Not yet recorded
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 align-top">
                      {knowledgeEntry ? (
                        <Link
                          href={`/knowledge/${knowledgeEntry.id}`}
                          className="text-foreground/80 underline-offset-2 hover:underline"
                        >
                          {knowledgeEntry.version}
                        </Link>
                      ) : (
                        <span className="text-xs text-muted">
                          Not published
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-10 max-w-3xl text-sm text-foreground/60">
          Only evaluations with an Approved or Approved with Controls Human
          Review decision produce a Knowledge Entry in this prototype — see{" "}
          <Link
            href="/knowledge"
            className="font-medium text-foreground/80 underline-offset-2 hover:underline"
          >
            Knowledge
          </Link>{" "}
          for how the other reviewed cases are represented as non-published.
        </p>
      </section>
    </main>
  );
}
