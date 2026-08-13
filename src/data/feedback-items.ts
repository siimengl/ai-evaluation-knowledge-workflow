/**
 * Phase 6 — synthetic FeedbackItem records + the version increment they
 * produce (PROJECT_SPEC.md §10, IMPLEMENTATION_PLAN.md Phase 6).
 *
 * These are the pre-authored mock dispositions the `/feedback` page
 * demonstrates. Dispositions are human-authored mock states, never
 * AI-derived — the disposition step is a labeled human judgment, distinct
 * from the act of submitting feedback in the first place (PROJECT_SPEC.md
 * §10 point 3, §8's "only a human decides" principle extended to knowledge
 * maintenance).
 *
 * `feedback-1` is the primary version-update demonstration required by this
 * phase: it is `Accepted → New Version` against `knowledge-1`, and the
 * resulting `knowledge-1` v1.1 entry (see `knowledge-entries.ts`) is a real,
 * materially different guidance update — not a wording pass — generalizing
 * the original single-clause finding (liability cap carve-outs) into the
 * broader pattern the feedback surfaced (a governing condition defined in a
 * different section than the term it governs).
 */

import type { FeedbackItem } from "./types";

export const FEEDBACK_ITEMS: FeedbackItem[] = [
  {
    id: "feedback-1",
    knowledgeEntryId: "knowledge-1",
    submittedBy: "Marcus Iyer, Associate (synthetic)",
    note:
      "Used this guidance on a services-agreement renewal review. The Copilot (simulated) summary correctly stated the auto-renewal date, but didn't flag that the renewal notice deadline is actually defined in a separate 'Term' section of the agreement, not next to the renewal clause itself. Nearly missed the notice window because the summary read as complete on its own — this feels like the same blind spot the liability-cap limitation already describes, just showing up on a different clause pair.",
    dateSubmitted: "2026-03-04",
    disposition: "Accepted → New Version",
    dispositionRationale:
      "Confirmed: this is not a one-off miss, it's the same underlying pattern recurring on a second, unrelated clause pair. The original guidance (v1) only warned about carve-outs on a stated liability cap. Generalizing it — any standalone figure, date, or limit in the summary may have a governing condition defined elsewhere in the document — is a materially broader, more reusable caution than the single-clause version, so this warrants a real version update rather than a note appended to the existing text. Known Limitations, Required Review, and Prompt Guidance all updated on knowledge-1 to reflect the general pattern; see v1.1 in its version history.",
    resultingVersion: "v1.1",
  },
  {
    id: "feedback-2",
    knowledgeEntryId: "knowledge-1",
    submittedBy: "Priya Nakamura, Paralegal (synthetic)",
    note:
      "Noticed the AI summary used 'will terminate' in one place and the source agreement uses 'may terminate' — the meaning is the same but the wording doesn't match verbatim. Suggest the guidance require exact verb-for-verb matching to source language.",
    dateSubmitted: "2026-02-18",
    disposition: "Rejected",
    dispositionRationale:
      "Rejected — this is a stylistic wording variance, not a substantive accuracy or completeness defect, and 'may terminate' vs. 'will terminate' does not change the actual right being described. This guidance's purpose is triage-level accuracy on business terms (cited in Approved Use), not verbatim linguistic fidelity to the source. Requiring exact verb matching would not improve reusable guidance and is outside this entry's Required Review scope, so no version change follows from this item.",
  },
  {
    id: "feedback-3",
    knowledgeEntryId: "knowledge-4",
    submittedBy: "Jordan Castellano, Knowledge Coordinator (synthetic)",
    note:
      "During a retrieval test, one returned entry was Deprecated. The status field was technically present and correct, but it didn't stand out on a quick scan of the result — easy to skim past. Wondering whether this guidance should say more about how prominently a reviewer needs to treat the status field, or whether that's really a retrieval-tool display issue rather than something this entry's guidance can fix.",
    dateSubmitted: "2026-03-11",
    disposition: "Open",
    dispositionRationale:
      "Not yet reviewed. Still deciding whether this belongs as an update to this entry's Required Review (e.g., an explicit instruction to read the status field first, not last) or is a presentation concern for the retrieval tool itself and out of scope for the guidance entry — flagged for the next knowledge-maintenance cycle rather than dispositioned under time pressure.",
  },
];

export function getFeedbackItemsByKnowledgeEntryId(
  knowledgeEntryId: string,
): FeedbackItem[] {
  return FEEDBACK_ITEMS.filter(
    (item) => item.knowledgeEntryId === knowledgeEntryId,
  );
}
