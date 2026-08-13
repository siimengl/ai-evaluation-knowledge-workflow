/**
 * Phase 2 — synthetic Evaluation records.
 *
 * Each case pairs one named (simulated) tool with one case type and
 * deliberately demonstrates one failure mode from PROJECT_SPEC.md §7/§9:
 *   - Case 1 (Copilot / Summarization): omitted qualification — completeness axis.
 *   - Case 2 (Claude / Extraction): a conditional term flattened into an
 *     unconditional field — workflow-fit axis.
 *   - Case 3 (ChatGPT / Draft Assistance): confident language exceeding
 *     source support — source-grounding axis.
 *   - Case 4 (Enterprise AI Retrieval / Knowledge Retrieval): the contrast
 *     case — a well-grounded retrieval with a mild/absent failure mode.
 *
 * `status` is "Reviewed" for all four as of Phase 4 — each now has a
 * corresponding HumanReview record in `human-reviews.ts` (PROJECT_SPEC.md
 * §6 requires every "Reviewed" evaluation to have one).
 *
 * `evidenceId` is set equal to the evaluation's own id — the Evidence &
 * Decision Trail (Phase 7) is derived 1:1 from an evaluation's id, not a
 * separately authored record, so this keeps the two from drifting apart.
 *
 * Phase 5 note: Case 4's simulated retrieval output now names and quotes
 * the real KnowledgeEntry published from Case 1 (`knowledge-1` in
 * `knowledge-entries.ts`), rather than a fictional, unlinked entry — see
 * `retrievesKnowledgeEntryId` below — so the retrieval-quality contrast
 * described in PROJECT_SPEC.md §7 is demonstrated with a real, traceable
 * in-app link, not just descriptive prose.
 *
 * Source material is described narratively, never reproduced as a
 * realistic-looking legal document, per PROJECT_SPEC.md §12.
 */

import type { Evaluation } from "./types";

export const EVALUATIONS: Evaluation[] = [
  {
    id: "eval-1",
    useCaseId: "use-case-1",
    tool: "Microsoft Copilot",
    caseType: "Summarization",
    inputSummary:
      "A 9-page synthetic vendor services agreement between Northfield Manufacturing Co. (synthetic) and a synthetic managed-IT-services vendor. The liability section caps damages at 12 months' fees paid, except that the cap does not apply to claims arising from a data-security breach or the vendor's willful misconduct, which remain uncapped. The termination section allows either party to terminate for convenience with 90 days' written notice.",
    aiOutput:
      "Summary produced by Microsoft Copilot (simulated):\n\nTerm & Termination: Either party may terminate for convenience with 90 days' written notice.\n\nLiability: Damages are capped at 12 months' fees paid under the agreement.\n\nRenewal: The agreement renews automatically for successive one-year terms absent notice.\n\nThis summary is intended to support a quick first-pass review of the agreement's key terms.",
    scores: {
      accuracy: {
        score: 4,
        rationale:
          "The stated terms (90-day termination notice, the 12-month fee cap figure, automatic renewal) are each individually accurate quotes from the source agreement's plain language.",
      },
      completeness: {
        score: 2,
        rationale:
          "The summary omits the carve-out that the liability cap does not apply to data-security-breach or willful-misconduct claims — a materially different risk picture than 'damages are capped' read on its own. This is the deliberate failure this case demonstrates.",
      },
      sourceGrounding: {
        score: 4,
        rationale:
          "Every sentence traces to specific agreement language; nothing is invented. The failure here is an omission, not a fabrication.",
      },
      workflowFit: {
        score: 4,
        rationale:
          "The three-heading structure (Term & Termination / Liability / Renewal) matches how the contracts team actually triages agreements, making the summary easy to act on — which is exactly why an omitted qualification here is risky: it reads as usable and complete.",
      },
    },
    failureMode: {
      description:
        "The liability summary states a flat damages cap without surfacing the source agreement's carve-out for data-security-breach and willful-misconduct claims, which remain uncapped. A reader relying on the summary alone would materially understate the vendor's actual liability exposure.",
      severity: "Medium",
      category: "Omitted Qualification",
    },
    reviewBoundary:
      "A human must re-open the source agreement's liability section (and any other capped or limited clause) to confirm whether carve-outs or exceptions apply — a summary stating a cap or limit should never be treated as the complete picture without that check.",
    status: "Reviewed",
    reviewId: "review-1",
    evidenceId: "eval-1",
  },
  {
    id: "eval-2",
    useCaseId: "use-case-2",
    tool: "Claude",
    caseType: "Extraction",
    inputSummary:
      "A synthetic master services agreement between the firm's internal operations group and Solenne Data Partners (synthetic), a records-management vendor. The renewal clause states the agreement 'renews automatically for a one-year term unless either party gives 60 days' written notice of non-renewal, and provided that all outstanding invoices are paid current as of the renewal date; if invoices are not current, the agreement lapses regardless of notice.'",
    aiOutput:
      "Structured extraction produced by Claude (simulated):\n\nField: Renewal Type — Value: Automatic\nField: Notice Period — Value: 60 days\nField: Renewal Term Length — Value: 1 year\n\nExtraction confidence: High.",
    scores: {
      accuracy: {
        score: 4,
        rationale:
          "The renewal type, notice period, and term length values are each individually correct as extracted from the clause.",
      },
      completeness: {
        score: 3,
        rationale:
          "The invoice-currency condition is dropped from the field set entirely — the extraction captures only part of what actually governs renewal.",
      },
      sourceGrounding: {
        score: 4,
        rationale:
          "The three fields that are present are directly grounded in the clause language; nothing extracted is fabricated.",
      },
      workflowFit: {
        score: 2,
        rationale:
          "The schema presents 'Renewal Type: Automatic' as a flat, unconditional field. A spreadsheet consumer reading this row would reasonably conclude renewal happens on notice alone, when the source clause makes renewal conditional on a second, unrelated requirement (current invoices). This is the deliberate failure this case demonstrates: a conditional clause flattened into an unconditional field.",
      },
    },
    failureMode: {
      description:
        "The extraction schema has no field type for compound or conditional terms, so a renewal clause governed by two independent conditions (notice period AND invoice-currency status) is rendered as a single flat 'Automatic' value — silently dropping the second condition rather than flagging that the clause is conditional.",
      severity: "Medium",
      category: "Conditional Flattened to Unconditional Field",
    },
    reviewBoundary:
      "A human must re-check the source clause any time an extracted field represents a renewal, termination, or other conditional term — the flat schema can only signal that a value exists, not that it was one of several conditions.",
    status: "Reviewed",
    reviewId: "review-2",
    evidenceId: "eval-2",
  },
  {
    id: "eval-3",
    useCaseId: "use-case-3",
    tool: "ChatGPT",
    caseType: "Draft Assistance",
    inputSummary:
      "A synthetic three-paragraph vendor security questionnaire response from Corvet Cloud Systems (synthetic). The relevant paragraph states that 'security event logs are retained for a fixed 90-day period following capture, in accordance with Corvet's internal logging policy,' and separately that 'client content data is retained in accordance with Corvet's internal data handling policy' and that 'a copy of the specific client-content retention schedule was not provided with this questionnaire response.' The 90-day figure applies only to security logs; the source is explicit that the client-content retention schedule is unspecified.",
    aiOutput:
      "Draft paragraph produced by ChatGPT (simulated):\n\n\"Corvet Cloud Systems retains client data for a fixed 90-day period following contract termination. This approach aligns with common vendor data governance expectations and should not raise concerns during vendor risk review.\"",
    scores: {
      accuracy: {
        score: 2,
        rationale:
          "The draft applies the source's 90-day figure to client data, but that figure describes only security-log retention in the source; the client-content retention schedule is explicitly stated as unspecified.",
      },
      completeness: {
        score: 3,
        rationale:
          "The draft omits the one fact the source actually establishes about client content — that its specific retention schedule was not provided — in favor of a borrowed figure that belongs to a different data category.",
      },
      sourceGrounding: {
        score: 2,
        rationale:
          "The 90-day figure is real in the source, but it is grounded in security-log retention, not client-content retention — the draft transfers a genuine figure to the wrong subject. This is the deliberate failure this case demonstrates.",
      },
      workflowFit: {
        score: 4,
        rationale:
          "The paragraph is fluent, client-ready in tone, and matches the length/format an associate would drop directly into a memo — which is precisely what makes the misapplied figure dangerous: it reads as a single verified fact about client data, with nothing in the format signaling that it was carried over from a different retention category.",
      },
    },
    failureMode: {
      description:
        "The source states a genuine 90-day retention period for security event logs, and separately states that the client-content retention schedule was not provided. The draft misattributes the security-log figure to client-data retention. The AI's confident, fluent phrasing gives a real figure — applied to the wrong subject — the same apparent authority as a verified fact.",
      severity: "High",
      category: "Confident Language Exceeding Source Support",
    },
    reviewBoundary:
      "A human must verify every specific figure or timeframe in a draft against the source document line-by-line — including confirming which data category a figure actually describes — before it is used externally; fluent, professional-sounding phrasing is not evidence that a claim is grounded, and a real number can still be misapplied.",
    status: "Reviewed",
    reviewId: "review-3",
    evidenceId: "eval-3",
  },
  {
    id: "eval-4",
    useCaseId: "use-case-4",
    tool: "Enterprise AI Retrieval",
    caseType: "Knowledge Retrieval",
    inputSummary:
      "A query submitted to the internal retrieval tool: 'What is our approved guidance for using AI to produce a first-pass summary of a vendor services agreement, and what conditions apply?' The tool has read access to the (synthetic) internal knowledge base of already-reviewed guidance entries. That knowledge base independently contains the entry published from Case 1 of this same evaluation program — 'Vendor Services Agreement Summarization — Microsoft Copilot (simulated),' Status: Active, v1, Owner: Dana Whitfield, Practice Knowledge Lead (synthetic), last reviewed 2026-01-20 — approved for first-pass triage summarization of vendor services agreements ahead of full attorney review, with a stated limitation that the summary can state a cap or limit without surfacing carve-outs or exceptions to it, and a required-review condition that a reviewer re-open the source agreement's liability section to check for carve-outs before the summary informs a renewal or negotiation decision.",
    aiOutput:
      "Retrieval result produced by Enterprise AI Retrieval (simulated):\n\n\"Found 1 matching guidance entry: 'Vendor Services Agreement Summarization — Microsoft Copilot (simulated)' — Status: Active, v1, Owner: Dana Whitfield, Practice Knowledge Lead (synthetic), last reviewed 2026-01-20. Approved use: first-pass triage summarization of vendor services agreements ahead of full attorney review. Known limitation: the summary can state a cap or limit without surfacing carve-outs or exceptions to it. Required review: a reviewer must re-open the source agreement's liability section to confirm whether carve-outs apply before the summary informs a renewal or negotiation decision.\"",
    scores: {
      accuracy: {
        score: 5,
        rationale:
          "Every field returned (status, version, owner, last-reviewed date, approved use, known limitation, required review) matches the underlying knowledge entry exactly.",
      },
      completeness: {
        score: 5,
        rationale:
          "The retrieval surfaces the full required-field set (owner, version, last-reviewed date, approved use, known limitation, required review) rather than a partial excerpt that would understate the entry's conditions.",
      },
      sourceGrounding: {
        score: 5,
        rationale:
          "Nothing is inferred or added beyond the entry's own recorded content — the retrieval quotes the entry's actual fields rather than paraphrasing them in a way that could drift from the source.",
      },
      workflowFit: {
        score: 4,
        rationale:
          "Returning the required-review condition alongside the approved use means a reader sees the guidance's boundary, not just its permission — matching how the entry is meant to be used downstream. Scored one point short of 5 only because a live tool would also need to re-flag the entry's status if it changed after retrieval, a review-boundary concern captured below rather than a defect in this result.",
      },
    },
    failureMode: {
      description:
        "No material failure identified in this test. This case is the contrast to Cases 1–3: it demonstrates a well-grounded retrieval that surfaces already-reviewed guidance with its full metadata intact, rather than a new defect.",
      severity: "Low",
      category: "None Identified — Contrast Case",
    },
    reviewBoundary:
      "Even a well-grounded retrieval requires a human to confirm the surfaced entry is still Active (not since Deprecated or Superseded) before relying on it — retrieval accuracy at query time does not guarantee the guidance is still current.",
    status: "Reviewed",
    reviewId: "review-4",
    evidenceId: "eval-4",
    retrievesKnowledgeEntryId: "knowledge-1",
  },
];

export function getEvaluationById(id: string): Evaluation | undefined {
  return EVALUATIONS.find((evaluation) => evaluation.id === id);
}
