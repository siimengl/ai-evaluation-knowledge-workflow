import { ActorTag } from "@/components/actor-tag";
import { WORKFLOW_STEPS } from "@/lib/workflow-steps";

/**
 * Shared visual presentation of the 8-step workflow model, connected by a
 * restrained spine (a single line threading through the steps) rather than
 * eight unrelated cards, with a labeled Evidence & Decision Trail band that
 * spans and connects all 8 steps beneath them — it is explicitly not a 9th
 * step (PROJECT_SPEC.md §11). No icons, no animation.
 *
 * `variant="compact"` is used on `/` (summary-only); `variant="full"` is
 * used on `/workflow` (full detail text) — both share this one component so
 * the two pages can't drift out of sync.
 */
export function WorkflowStrip({ variant }: { variant: "compact" | "full" }) {
  return (
    <div>
      <ol className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {WORKFLOW_STEPS.map((step) => (
          <li key={step.number} className="relative pl-8 sm:pl-0">
            {/* Connector spine: a single restrained rule running through the
                step markers, not a decorative flourish. */}
            <span
              aria-hidden
              className="absolute top-4 left-3 h-full w-px bg-border-subtle sm:top-3 sm:left-0 sm:h-px sm:w-full"
            />
            <div className="relative flex items-center gap-2 sm:mb-3">
              <span
                aria-hidden
                className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-background text-[11px] font-semibold"
              >
                {step.number}
              </span>
              <ActorTag actorType={step.actorType} />
            </div>
            <div className="relative rounded-lg border border-border-subtle bg-background p-4 sm:ml-0">
              <p className="text-sm font-semibold">{step.label}</p>
              <p className="mt-1 text-sm text-foreground/70">
                {variant === "full" ? step.detail : step.summary}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-lg border border-dashed border-border-subtle bg-surface px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Evidence &amp; Decision Trail
        </p>
        <p className="mt-1 text-sm text-foreground/70">
          A read-only, chronological record that spans and connects all 8
          steps above — attributed, timestamped, and reconstructed from what
          actually happened. It is not an additional step in the sequence;
          it is the record of the sequence.
        </p>
      </div>
    </div>
  );
}
