import type { EvaluationStatus } from "@/data/types";

/**
 * Evaluation lifecycle status badge (Pending Review / Reviewed / Superseded).
 * Distinct from a HumanReview *decision* badge (Phase 4) — this only
 * reflects where the case sits in the process, not what was decided, so it
 * intentionally does not borrow the Approved/Controls/Not Recommended
 * decision colors from PROJECT_SPEC.md §13.
 */
const STATUS_STYLES: Record<EvaluationStatus, string> = {
  "Pending Review":
    "border-status-pending bg-status-pending-bg text-status-pending",
  Reviewed: "border-border-subtle bg-surface text-foreground/80",
  Superseded: "border-border-subtle bg-surface text-foreground/50",
};

export function StatusBadge({ status }: { status: EvaluationStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
