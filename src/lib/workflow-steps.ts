/**
 * The canonical 8-step workflow model (PROJECT_SPEC.md §11 "Canonical
 * 8-step workflow model"). This is static, hand-authored vocabulary
 * content — not mock entity data — shared by `/` (workflow strip) and
 * `/workflow` (full explanation) so the two never drift apart.
 */

export interface WorkflowStep {
  /** 1-indexed step number. */
  number: number;
  /** Short label used in the home-page strip and as a heading on /workflow. */
  label: string;
  /** One-sentence description of what happens at this step. */
  summary: string;
  /** Which kind of actor drives this step. */
  actorType: "AI" | "Human" | "System";
  /** Longer explanation for the /workflow page. */
  detail: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    number: 1,
    label: "Intake",
    summary: "A use case is submitted for evaluation.",
    actorType: "Human",
    detail:
      "A synthetic requester submits a use case: what they want an AI tool to do, the business context, and the target tool. This is the entry point for every evaluation — nothing is evaluated without a recorded intake.",
  },
  {
    number: 2,
    label: "AI Test Run",
    summary: "The tool is exercised against the use case; its output is recorded.",
    actorType: "AI",
    detail:
      "The named tool (always labeled \"(simulated)\" in this prototype) is run against the use case, and its output is recorded as-is — unedited, unreviewed, and not yet trusted.",
  },
  {
    number: 3,
    label: "Structured Evaluation",
    summary: "The output is scored against a fixed four-dimension framework.",
    actorType: "System",
    detail:
      "The AI output is scored on accuracy, completeness, source grounding, and workflow fit, each with a 1–5 score and written rationale — plus a named failure mode and an explicit review boundary describing what a human must still verify.",
  },
  {
    number: 4,
    label: "Human Review",
    summary: "A labeled human reviewer examines the evaluation.",
    actorType: "Human",
    detail:
      "A named, labeled human reviewer — never an AI — examines the structured evaluation. This step is a distinct entity in the data model, not a field on the evaluation, to make the human-in-the-loop boundary structurally explicit.",
  },
  {
    number: 5,
    label: "Decision",
    summary: "The reviewer records a decision and rationale, scoped to this case.",
    actorType: "Human",
    detail:
      "The reviewer records one of a fixed set of decisions — Approved, Approved with Controls, Pilot Only, or Not Recommended — with required rationale. Every decision is scoped to the specific use case and test configuration evaluated, never a general verdict on the underlying tool.",
  },
  {
    number: 6,
    label: "Knowledge Published",
    summary: "An eligible decision produces a reusable knowledge entry.",
    actorType: "System",
    detail:
      "Only an Approved or Approved with Controls decision can produce a Knowledge Entry — a versioned, owned guidance record with approved use, known limitations, required review, and prompt guidance. A Pilot Only or Not Recommended decision stops the trail here.",
  },
  {
    number: 7,
    label: "Feedback Received",
    summary: "A simulated usage note is submitted against a published entry.",
    actorType: "Human",
    detail:
      "Once an entry is published, a synthetic submitter can log a written note about how the guidance held up in a simulated scenario — modeling the kind of feedback loop a deployed system would need, not a report from an actual deployment. This step is not exposed in the app until later in the build — see /case-study for what's live today.",
  },
  {
    number: 8,
    label: "Version Updated",
    summary: "Accepted feedback produces a new, traceable version.",
    actorType: "Human",
    detail:
      "If feedback is accepted, the knowledge entry gains a new version-history entry with a change summary and who made the change. Rejected feedback stays visible with its rationale — not every note changes guidance.",
  },
];
