import type { WorkflowStep } from "@/lib/workflow-steps";

const ACTOR_STYLES: Record<WorkflowStep["actorType"], string> = {
  Human: "border-actor-human-border bg-actor-human-bg text-foreground/70",
  AI: "border-actor-ai-border bg-actor-ai-bg text-foreground/70",
  System: "border-actor-system-border bg-actor-system-bg text-foreground/70",
};

/**
 * Small, restrained label distinguishing which kind of actor drives a
 * workflow step (Human / AI / System) — tint + border only, per
 * PROJECT_SPEC.md §13 (no gradients, no saturated color blocks).
 */
export function ActorTag({ actorType }: { actorType: WorkflowStep["actorType"] }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${ACTOR_STYLES[actorType]}`}
    >
      {actorType}
    </span>
  );
}
