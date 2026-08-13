import type { ReviewDecision } from "@/data/types";

/**
 * Human Review decision badge (PROJECT_SPEC.md §8/§13). Deliberately
 * distinct from `StatusBadge` — status describes where a case sits in the
 * process, this describes what a labeled human reviewer decided. Uses the
 * semantic decision-color tokens (approved / controls / not-recommended),
 * sparingly, per §13.
 */
const DECISION_STYLES: Record<ReviewDecision, string> = {
  Approved:
    "border-status-approved bg-status-approved-bg text-status-approved",
  "Approved with Controls":
    "border-status-controls bg-status-controls-bg text-status-controls",
  "Pilot Only":
    "border-status-controls bg-status-controls-bg text-status-controls",
  "Not Recommended":
    "border-status-not-recommended bg-status-not-recommended-bg text-status-not-recommended",
};

export function DecisionBadge({ decision }: { decision: ReviewDecision }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${DECISION_STYLES[decision]}`}
    >
      {decision}
    </span>
  );
}
