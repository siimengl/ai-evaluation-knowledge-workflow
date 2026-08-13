/**
 * Phase 4 — synthetic HumanReview records.
 *
 * `HumanReview` is deliberately a separate entity from `Evaluation`
 * (PROJECT_SPEC.md §8) — the mock data mirrors that separation by living in
 * its own module, joined by `evaluationId` rather than being embedded in
 * `evaluations.ts`.
 *
 * Outcomes below are FIXED per PROJECT_SPEC.md §8's decision table and
 * IMPLEMENTATION_PLAN.md Phase 4 — final, not illustrative:
 *   - Case 1 (Copilot / Summarization)        → Approved with Controls
 *   - Case 2 (Claude / Extraction)             → Pilot Only
 *   - Case 3 (ChatGPT / Draft Assistance)      → Not Recommended
 *   - Case 4 (Enterprise AI Retrieval)         → Approved
 *
 * Every rationale is scoped to that case's specific synthetic use case and
 * test configuration — never a general verdict on the underlying tool
 * (PROJECT_SPEC.md §8 "Decision scope"). Reviewer personas are synthetic,
 * labeled roles, never implying a real person or firm.
 */

import type { Evaluation, HumanReview } from "./types";

export const HUMAN_REVIEWS: HumanReview[] = [
  {
    id: "review-1",
    evaluationId: "eval-1",
    reviewerName: "Dana Whitfield",
    reviewerRole: "Practice Knowledge Lead (synthetic)",
    decision: "Approved with Controls",
    rationale:
      "As tested, this summary correctly captured the termination and renewal terms but omitted the liability cap's carve-out for data-security-breach and willful-misconduct claims — a gap that changes the actual risk picture for anyone who reads the summary as complete. That is a completeness defect in this specific summarization configuration, not a fabrication, so the underlying workflow (first-pass triage of vendor agreements ahead of attorney review) remains sound. Approved for continued use in that workflow, with controls addressing the specific gap this case surfaced.",
    conditions: [
      "A reviewer must re-open the source agreement's liability section (and any other capped or limited clause) to check for carve-outs before the summary is used to inform a renewal or negotiation decision.",
      "This approval covers first-pass triage summarization only — it does not substitute for full attorney review of liability, indemnification, or other risk-allocation clauses.",
    ],
    date: "2026-01-20",
  },
  {
    id: "review-2",
    evaluationId: "eval-2",
    reviewerName: "Aisha Konte",
    reviewerRole: "Knowledge Management Lead (synthetic)",
    decision: "Pilot Only",
    rationale:
      "As tested, the extraction correctly captured three of the renewal clause's data points but rendered the invoice-currency condition invisible, presenting an inherently conditional term as a flat 'Automatic' value. A spreadsheet consumer would have no way to know a second condition existed without independently rereading the source. That is a workflow-fit defect specific to this schema and this clause type, not a case for abandoning extraction generally. This use case moves to a supervised pilot, not general release, until the schema (or the reviewer process around it) reliably flags compound or conditional terms instead of dropping them.",
    conditions: [
      "Every extracted renewal, termination, or other conditional field must be manually verified against the source clause before it is entered into any matter-tracking system.",
      "Pilot scope is limited to supervised use within the knowledge management team; not approved for general extraction use until the conditional-term gap is addressed.",
    ],
    date: "2026-01-28",
  },
  {
    id: "review-3",
    evaluationId: "eval-3",
    reviewerName: "Thomas Ferreira",
    reviewerRole: "Risk & Ethics Counsel (synthetic)",
    decision: "Not Recommended",
    rationale:
      "As tested, the draft took a genuine source figure — the 90-day security-log retention period — and applied it to a different subject, client-content retention, which the source explicitly states was not provided. The output's confident, client-ready phrasing gave that misapplied figure the same apparent authority as a verified fact, with nothing in the format signaling it had been carried over from the wrong data category. Because this output is intended for external client-facing use and the error is not visually distinguishable from a correct statement, drafting client-facing paragraphs from vendor questionnaire responses in this configuration is not recommended. This finding is specific to this use case and test configuration — it is not a general verdict on ChatGPT (simulated) or on AI draft assistance in other contexts with different source material or guardrails.",
    conditions: [],
    date: "2026-02-03",
  },
  {
    id: "review-4",
    evaluationId: "eval-4",
    reviewerName: "Dana Whitfield",
    reviewerRole: "Practice Knowledge Lead (synthetic)",
    decision: "Approved",
    rationale:
      "As tested, the retrieval tool returned the complete, accurate metadata set for an already-reviewed knowledge entry — status, version, owner, last-reviewed date, approved use, known limitation, and required review — with nothing invented and nothing dropped. This is the target-state contrast to Cases 1–3: a well-grounded retrieval that surfaces existing guidance rather than generating new content. Approved for this use case — checking for existing approved guidance before starting a new AI evaluation — on the understanding that the retrieved entry's status must still be reconfirmed at the point of use.",
    conditions: [
      "A user relying on a retrieved entry must confirm its status is still Active (not since Deprecated or Superseded) before acting on it — retrieval accuracy at query time does not guarantee the guidance is still current.",
    ],
    date: "2026-02-09",
  },
];

export function getHumanReviewByEvaluationId(
  evaluationId: string,
): HumanReview | undefined {
  return HUMAN_REVIEWS.find((review) => review.evaluationId === evaluationId);
}

/**
 * Publish-eligibility gate (PROJECT_SPEC.md §9, IMPLEMENTATION_PLAN.md Phase
 * 4). Only an evaluation whose HumanReview decision is `Approved` or
 * `Approved with Controls` may source a general-use KnowledgeEntry.
 * `Pilot Only` (Case 2) and `Not Recommended` (Case 3) are both
 * non-publishing outcomes, as is an evaluation with no recorded review at
 * all. This is enforced here, in code, ahead of Phase 5 actually creating
 * any KnowledgeEntry — not left as a documentation-only rule.
 */
export function canPublish(evaluation: Evaluation): boolean {
  const review = getHumanReviewByEvaluationId(evaluation.id);
  if (!review) return false;
  return (
    review.decision === "Approved" ||
    review.decision === "Approved with Controls"
  );
}
