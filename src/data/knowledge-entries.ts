/**
 * Phase 5 — synthetic KnowledgeEntry records.
 *
 * A KnowledgeEntry exists ONLY for an evaluation whose HumanReview decision
 * passes `canPublish()` (PROJECT_SPEC.md §9, IMPLEMENTATION_PLAN.md Phase
 * 4/5) — `Approved` or `Approved with Controls`. Of the four cases, that is
 * Case 1 (Approved with Controls) and Case 4 (Approved) only. Case 2 (Pilot
 * Only) and Case 3 (Not Recommended) are deliberately absent here — see
 * `src/app/knowledge/page.tsx` for where those cases are surfaced as
 * non-published rather than silently omitted.
 *
 * Each entry is derived directly from its source evaluation's content and
 * its HumanReview's rationale/conditions — nothing here introduces guidance
 * unrelated to what was actually tested and reviewed. Version history is a
 * single v1 entry at this phase; feedback-driven increments arrive in
 * Phase 6.
 */

import type { Evaluation, KnowledgeEntry } from "./types";
import { EVALUATIONS } from "./evaluations";
import { canPublish } from "./human-reviews";

export const KNOWLEDGE_ENTRIES: KnowledgeEntry[] = [
  {
    id: "knowledge-1",
    title: "Vendor Services Agreement Summarization — Microsoft Copilot (simulated)",
    sourceEvaluationId: "eval-1",
    status: "Active",
    approvedUse:
      "First-pass triage summarization of vendor services agreements ahead of full attorney review — producing a quick-reference summary of term, termination, liability, and renewal provisions to help prioritize which sections need close reading. Not a substitute for full attorney review of liability, indemnification, or other risk-allocation clauses.",
    knownLimitations:
      "As tested, the summary can state a liability cap or other limitation without surfacing carve-outs or exceptions to it (in this case, the exclusion of data-security-breach and willful-misconduct claims from an otherwise-capped liability provision). A stated cap or limit should never be treated as the complete picture without checking the source clause.",
    requiredReview:
      "A reviewer must re-open the source agreement's liability section (and any other capped or limited clause) to confirm whether carve-outs or exceptions apply before the summary is used to inform a renewal or negotiation decision.",
    promptGuidance:
      "When requesting a vendor agreement summary, explicitly instruct the tool to flag any exceptions, carve-outs, or conditions attached to caps, limits, or renewal terms — not just the headline figure — and to note when a clause could not be fully summarized in one line.",
    owner: "Dana Whitfield, Practice Knowledge Lead (synthetic)",
    version: "v1",
    versionHistory: [
      {
        version: "v1",
        date: "2026-01-20",
        changeSummary:
          "Initial publication from Case 1's evaluation review (decision: Approved with Controls).",
        changedBy: "Dana Whitfield, Practice Knowledge Lead (synthetic)",
      },
    ],
    date: "2026-01-20",
  },
  {
    id: "knowledge-4",
    title:
      "Checking the Knowledge Base Before a New AI Evaluation — Enterprise AI Retrieval (simulated)",
    sourceEvaluationId: "eval-4",
    status: "Active",
    approvedUse:
      "Use the internal retrieval tool to check whether approved guidance already exists for a proposed AI use case (a specific tool applied to a specific task type) before starting a new evaluation from scratch.",
    knownLimitations:
      "Retrieval accuracy at query time does not guarantee the surfaced guidance is still current — an entry could be deprecated or superseded after it was last indexed by the retrieval tool.",
    requiredReview:
      "A user relying on a retrieved entry must confirm its status is still Active (not since Deprecated or Superseded) before acting on it, even when the retrieval itself returned complete and accurate metadata.",
    promptGuidance:
      "Phrase retrieval queries by naming both the tool and the task type sought (e.g., 'AI summarization of vendor services agreements'), and always read the returned status field before treating an entry as current guidance.",
    owner: "Dana Whitfield, Practice Knowledge Lead (synthetic)",
    version: "v1",
    versionHistory: [
      {
        version: "v1",
        date: "2026-02-09",
        changeSummary:
          "Initial publication from Case 4's evaluation review (decision: Approved).",
        changedBy: "Dana Whitfield, Practice Knowledge Lead (synthetic)",
      },
    ],
    date: "2026-02-09",
  },
];

export function getKnowledgeEntryById(id: string): KnowledgeEntry | undefined {
  return KNOWLEDGE_ENTRIES.find((entry) => entry.id === id);
}

export function getKnowledgeEntryBySourceEvaluationId(
  evaluationId: string,
): KnowledgeEntry | undefined {
  return KNOWLEDGE_ENTRIES.find(
    (entry) => entry.sourceEvaluationId === evaluationId,
  );
}

/**
 * Evaluations that were reviewed but are NOT publish-eligible
 * (`canPublish()` false) — Case 2 (`Pilot Only`) and Case 3
 * (`Not Recommended`) in this prototype. Exposed so `/knowledge` can
 * represent these cases explicitly as non-published, per
 * IMPLEMENTATION_PLAN.md Phase 5, rather than silently omitting them.
 */
export function getNonPublishedEvaluations(): Evaluation[] {
  return EVALUATIONS.filter(
    (evaluation) => !canPublish(evaluation) && evaluation.status === "Reviewed",
  );
}

/**
 * Sanity check, enforced in code: every KnowledgeEntry's source evaluation
 * must actually pass `canPublish()`. Runs at module load so a future
 * mis-authored entry (e.g., accidentally sourced from Case 2 or 3) fails
 * immediately rather than silently rendering.
 */
KNOWLEDGE_ENTRIES.forEach((entry) => {
  const sourceEvaluation = EVALUATIONS.find(
    (evaluation) => evaluation.id === entry.sourceEvaluationId,
  );
  if (!sourceEvaluation || !canPublish(sourceEvaluation)) {
    throw new Error(
      `KnowledgeEntry "${entry.id}" is sourced from an evaluation that is not publish-eligible: ${entry.sourceEvaluationId}`,
    );
  }
});
