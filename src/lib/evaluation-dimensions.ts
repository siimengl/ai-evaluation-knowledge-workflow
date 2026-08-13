/**
 * The four fixed scoring dimensions of the evaluation framework
 * (PROJECT_SPEC.md §7). Static vocabulary content, shared wherever a
 * `Evaluation.scores` object needs to be rendered — kept here so the
 * dimension question/label pairing can't drift between pages, mirroring the
 * pattern already used by `workflow-steps.ts`.
 */

import type { EvaluationScores } from "@/data/types";

export interface EvaluationDimensionMeta {
  key: keyof EvaluationScores;
  label: string;
  /** The question this dimension answers, verbatim from PROJECT_SPEC.md §7. */
  question: string;
}

export const EVALUATION_DIMENSIONS: EvaluationDimensionMeta[] = [
  {
    key: "accuracy",
    label: "Accuracy",
    question: "Does the AI output correctly reflect the source material?",
  },
  {
    key: "completeness",
    label: "Completeness",
    question: "Does it omit material information?",
  },
  {
    key: "sourceGrounding",
    label: "Source Grounding",
    question:
      "Is every claim traceable to the input, vs. invented/inferred?",
  },
  {
    key: "workflowFit",
    label: "Workflow Fit",
    question:
      "Does the output's format/structure match how a human would actually use it downstream?",
  },
];
