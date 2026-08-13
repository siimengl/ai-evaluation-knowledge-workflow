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
 * unrelated to what was actually tested and reviewed. Version history was a
 * single v1 entry through Phase 5.
 *
 * Phase 6 note: `knowledge-1` now carries a real v1.1, produced by an
 * `Accepted → New Version` disposition on `feedback-1` (see
 * `feedback-items.ts`). The update is a genuine scope expansion, not a
 * wording pass — it generalizes the original single-clause finding
 * (liability-cap carve-outs) into the broader pattern the feedback
 * surfaced: any standalone figure, date, or limit in the summary may have a
 * governing condition defined in a different section of the source
 * document. v1 is preserved unmodified in `versionHistory` below.
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
      "As tested, the summary can present a standalone figure, date, or limit as complete when a condition governing it is actually defined in a different section of the source document — not necessarily adjacent to the term itself. The original finding was a liability cap stated without its carve-outs for data-security-breach and willful-misconduct claims; a later usage report confirmed the same pattern recurring on a renewal notice deadline defined in a separate 'Term' section from the renewal clause it governs. Any capped, limited, or dated figure in the summary should be treated as potentially incomplete until the reviewer checks the rest of the document, not just the clause it appears under.",
    requiredReview:
      "A reviewer must re-open the source agreement and check the full document — not only the clause the summary places a figure or date under — for any condition that governs it (e.g., liability carve-outs, or a renewal notice period defined in a separate Term section). This applies to every standalone cap, limit, or date in the summary, not only the liability clause originally identified.",
    promptGuidance:
      "When requesting a vendor agreement summary, explicitly instruct the tool to (1) flag any exceptions, carve-outs, or conditions attached to caps, limits, dates, or renewal terms, and (2) state explicitly if it cannot confirm whether a governing condition exists elsewhere in the document. Conditions are often defined in a separate section from the term they govern (e.g., a renewal notice deadline in a 'Term' section vs. the renewal clause itself) — the absence of a flagged exception in one clause's text is not confirmation that no exception exists.",
    owner: "Dana Whitfield, Practice Knowledge Lead (synthetic)",
    version: "v1.1",
    versionHistory: [
      {
        version: "v1",
        date: "2026-01-20",
        changeSummary:
          "Initial publication from Case 1's evaluation review (decision: Approved with Controls).",
        changedBy: "Dana Whitfield, Practice Knowledge Lead (synthetic)",
      },
      {
        version: "v1.1",
        date: "2026-03-04",
        changeSummary:
          "Accepted feedback from Marcus Iyer (Associate, synthetic) — feedback-1 — reported the same blind spot recurring on a renewal notice deadline, not just the original liability cap. Generalized Known Limitations, Required Review, and Prompt Guidance from a single-clause caution into the broader, more reusable pattern: a stated figure, date, or limit can have a governing condition defined in a different section of the document than the term itself. This is a scope expansion of the guidance, not a wording edit.",
        changedBy: "Dana Whitfield, Practice Knowledge Lead (synthetic)",
      },
    ],
    date: "2026-03-04",
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
