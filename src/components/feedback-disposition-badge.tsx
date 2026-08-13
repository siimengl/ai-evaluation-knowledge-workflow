import type { FeedbackDisposition } from "@/data/types";

/**
 * FeedbackItem disposition badge (PROJECT_SPEC.md §10/§13). Reuses the
 * existing semantic status-color tokens rather than inventing new ones:
 * Accepted borrows the "approved" green, Rejected the "not-recommended"
 * red, Open the neutral "pending" gray — consistent with how
 * `DecisionBadge`/`StatusBadge` apply color sparingly and semantically.
 */
const DISPOSITION_STYLES: Record<FeedbackDisposition, string> = {
  Open: "border-status-pending bg-status-pending-bg text-status-pending",
  "Accepted → New Version":
    "border-status-approved bg-status-approved-bg text-status-approved",
  Rejected:
    "border-status-not-recommended bg-status-not-recommended-bg text-status-not-recommended",
};

export function FeedbackDispositionBadge({
  disposition,
}: {
  disposition: FeedbackDisposition;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${DISPOSITION_STYLES[disposition]}`}
    >
      {disposition}
    </span>
  );
}
