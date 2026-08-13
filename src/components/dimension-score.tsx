import type { DimensionScore } from "@/data/types";
import type { EvaluationDimensionMeta } from "@/lib/evaluation-dimensions";

/**
 * One scored dimension from the structured evaluation framework
 * (PROJECT_SPEC.md §7): the fixed question it answers, the 1–5 score as a
 * restrained dot scale, and the written rationale — never a bare number.
 */
export function DimensionScoreCard({
  meta,
  score,
}: {
  meta: EvaluationDimensionMeta;
  score: DimensionScore;
}) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {meta.label}
          </h3>
          <p className="mt-0.5 text-xs text-muted">{meta.question}</p>
        </div>
        <ScoreDots score={score.score} />
      </div>
      <p className="mt-3 text-sm leading-6 text-foreground/80">
        {score.rationale}
      </p>
    </div>
  );
}

function ScoreDots({ score }: { score: DimensionScore["score"] }) {
  return (
    <div
      className="flex shrink-0 items-center gap-1 pt-0.5"
      role="img"
      aria-label={`Score: ${score} out of 5`}
    >
      <span className="text-sm font-semibold tabular-nums text-foreground">
        {score}
      </span>
      <span className="text-xs text-muted">/5</span>
      <span className="ml-1 flex gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              i < score ? "bg-foreground/70" : "bg-border-subtle"
            }`}
          />
        ))}
      </span>
    </div>
  );
}
