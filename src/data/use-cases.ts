/**
 * Phase 2 — synthetic UseCase intake records.
 *
 * Four fixed cases, one per PROJECT_SPEC.md §8's decision table (Copilot /
 * Summarization, Claude / Extraction, ChatGPT / Draft Assistance,
 * Enterprise AI Retrieval / Knowledge Retrieval). All names, companies, and
 * business context are synthetic per PROJECT_SPEC.md §12 — no real
 * client/matter/firm data.
 */

import type { UseCase } from "./types";

export const USE_CASES: UseCase[] = [
  {
    id: "use-case-1",
    title: "Summarize vendor services agreement for renewal review",
    submittedBy: "Priya Nandakumar, Contracts Coordinator (synthetic)",
    businessContext:
      "Ahead of a vendor services agreement renewal decision, the contracts team wanted a fast first-pass summary of a lengthy vendor agreement's key terms (term, termination, liability, renewal) to help prioritize which sections warranted full attorney review.",
    targetTool: "Microsoft Copilot (simulated)",
    dateSubmitted: "2026-01-12",
  },
  {
    id: "use-case-2",
    title: "Extract renewal terms from a services agreement into structured fields",
    submittedBy: "Marcus Feld, Knowledge Management Associate (synthetic)",
    businessContext:
      "The knowledge management team wanted to test whether an AI tool could extract standard contract data points (renewal type, notice period, conditions) directly into structured fields for a matter-tracking spreadsheet, instead of requiring a manual read-through of each agreement.",
    targetTool: "Claude (simulated)",
    dateSubmitted: "2026-01-19",
  },
  {
    id: "use-case-3",
    title: "Draft a client-facing paragraph on a vendor's data retention practice",
    submittedBy: "Elena Voss, Associate (synthetic)",
    businessContext:
      "An associate wanted a fast draft of a short client-facing paragraph describing a vendor's data retention practice, to be reviewed and edited before inclusion in a broader vendor-risk summary memo.",
    targetTool: "ChatGPT (simulated)",
    dateSubmitted: "2026-01-26",
  },
  {
    id: "use-case-4",
    title: "Retrieve approved guidance on using AI to summarize vendor services agreements",
    submittedBy: "Renata Osei, Knowledge Management Associate (synthetic)",
    businessContext:
      "Before requesting a first-pass AI summary of a new vendor services agreement, an associate wanted to check whether the firm's internal knowledge base already had approved guidance on doing so, instead of starting a fresh evaluation each time the same question comes up.",
    targetTool: "Enterprise AI Retrieval (simulated)",
    dateSubmitted: "2026-02-02",
  },
];

export function getUseCaseById(id: string): UseCase | undefined {
  return USE_CASES.find((useCase) => useCase.id === id);
}
