import type { KnowledgeEntryStatus } from "@/data/types";

/**
 * KnowledgeEntry lifecycle status badge (Active / Deprecated / Superseded —
 * PROJECT_SPEC.md §9/§13). Reuses the "approved" (muted green) token for
 * Active and the neutral "pending" (gray) token for Deprecated/Superseded,
 * so de-emphasized entries read as visually quieter without inventing a new
 * color, per §13's restrained, semantic use of color.
 */
const KNOWLEDGE_STATUS_STYLES: Record<KnowledgeEntryStatus, string> = {
  Active: "border-status-approved bg-status-approved-bg text-status-approved",
  Deprecated: "border-border-subtle bg-surface text-foreground/50",
  Superseded: "border-border-subtle bg-surface text-foreground/50",
};

export function KnowledgeStatusBadge({
  status,
}: {
  status: KnowledgeEntryStatus;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${KNOWLEDGE_STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
