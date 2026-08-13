/**
 * Entity types for the AI Evaluation & Knowledge Workflow prototype.
 *
 * Phase 1 note: these are TYPE DEFINITIONS ONLY, per PROJECT_SPEC.md §6 and
 * IMPLEMENTATION_PLAN.md Phase 1. No case data / mock records exist yet —
 * those are authored in Phase 2 onward. Nothing in this file should be
 * imported for rendering real content until later phases populate
 * `src/data/` with actual fixtures.
 *
 * Shapes mirror PROJECT_SPEC.md §6 "Data Entities & Relationships" exactly.
 */

/** A submitted use case — the intake step (workflow step 1). */
export interface UseCase {
  id: string;
  title: string;
  submittedBy: string;
  businessContext: string;
  targetTool: string;
  dateSubmitted: string;
}

/** One of the four fixed AI tools this prototype evaluates, always simulated. */
export type EvaluationTool =
  | "Microsoft Copilot"
  | "Claude"
  | "ChatGPT"
  | "Enterprise AI Retrieval";

/** One of the four fixed case types this prototype demonstrates. */
export type EvaluationCaseType =
  | "Summarization"
  | "Extraction"
  | "Draft Assistance"
  | "Knowledge Retrieval";

/** A single scored dimension of the evaluation framework (PROJECT_SPEC.md §7). */
export interface DimensionScore {
  score: 1 | 2 | 3 | 4 | 5;
  rationale: string;
}

/** The four fixed scoring dimensions applied to every evaluation. */
export interface EvaluationScores {
  accuracy: DimensionScore;
  completeness: DimensionScore;
  sourceGrounding: DimensionScore;
  workflowFit: DimensionScore;
}

/** Severity of a failure mode, framed as impact-if-unreviewed (never a claim about model quality generally). */
export type FailureSeverity = "Low" | "Medium" | "High";

/** A named, specific defect the case demonstrates. */
export interface FailureMode {
  description: string;
  severity: FailureSeverity;
  category: string;
}

/** Lifecycle status of an evaluation. */
export type EvaluationStatus = "Pending Review" | "Reviewed" | "Superseded";

/**
 * One simulated AI evaluation case: intake, simulated output, structured
 * scoring, failure mode, and the boundary of what a human must still check.
 */
export interface Evaluation {
  id: string;
  useCaseId: string;
  tool: EvaluationTool;
  caseType: EvaluationCaseType;
  inputSummary: string;
  aiOutput: string;
  scores: EvaluationScores;
  failureMode: FailureMode;
  reviewBoundary: string;
  status: EvaluationStatus;
  reviewId?: string;
  evidenceId: string;
  /**
   * Set only on the Case 4 (Enterprise AI Retrieval) evaluation, whose
   * simulated output is itself a retrieval of an existing KnowledgeEntry
   * from another case (PROJECT_SPEC.md §7, IMPLEMENTATION_PLAN.md Phase 5) —
   * a real, in-app link rather than a described-but-unlinked reference.
   */
  retrievesKnowledgeEntryId?: string;
}

/**
 * Human decision on an evaluation. Decisions are scoped to the specific
 * synthetic use case/test configuration they were recorded against — never
 * a general verdict on the underlying AI vendor/tool (PROJECT_SPEC.md §8
 * "Decision scope").
 */
export type ReviewDecision =
  | "Approved"
  | "Approved with Controls"
  | "Pilot Only"
  | "Not Recommended";

/**
 * The recorded human review of an evaluation — a distinct entity from the
 * evaluation itself, never a field bolted onto it (PROJECT_SPEC.md §8).
 * Only a labeled human reviewer may finalize a decision.
 */
export interface HumanReview {
  id: string;
  evaluationId: string;
  reviewerName: string;
  reviewerRole: string;
  decision: ReviewDecision;
  rationale: string;
  conditions?: string[];
  date: string;
}

/** Lifecycle status of a knowledge entry (PROJECT_SPEC.md §9). */
export type KnowledgeEntryStatus = "Active" | "Deprecated" | "Superseded";

/** One entry in a knowledge entry's version history. */
export interface KnowledgeEntryVersion {
  version: string;
  date: string;
  changeSummary: string;
  changedBy: string;
}

/**
 * A reviewed, versioned guidance entry produced from an approved evaluation.
 * Every entry must trace back to a `sourceEvaluationId` with an eligible
 * HumanReview decision (`Approved` or `Approved with Controls`) — enforced
 * in code, not just authored correctly (see Phase 4's `canPublish` gate).
 */
export interface KnowledgeEntry {
  id: string;
  title: string;
  sourceEvaluationId: string;
  status: KnowledgeEntryStatus;
  approvedUse: string;
  knownLimitations: string;
  requiredReview: string;
  promptGuidance: string;
  owner: string;
  version: string;
  versionHistory: KnowledgeEntryVersion[];
  date: string;
}

/** Disposition of a submitted feedback item (PROJECT_SPEC.md §10). */
export type FeedbackDisposition = "Open" | "Accepted → New Version" | "Rejected";

/**
 * Real-world usage feedback submitted against a knowledge entry. Not
 * exposed in the UI until Phase 6 (PROJECT_SPEC.md §10); Phases 1–5 define
 * the shape only.
 */
export interface FeedbackItem {
  id: string;
  knowledgeEntryId: string;
  submittedBy: string;
  note: string;
  dateSubmitted: string;
  disposition: FeedbackDisposition;
  dispositionRationale: string;
  resultingVersion?: string;
}

/** Which kind of actor performed an evidence trail event. */
export type EvidenceActorType = "AI" | "Human";

/**
 * One event in an Evidence & Decision Trail. Never call this an "audit
 * trail" or describe it as "immutable" (PROJECT_SPEC.md §11/§15).
 */
export interface EvidenceTrailEvent {
  step: string;
  actor: string;
  actorType: EvidenceActorType;
  timestamp: string;
  description: string;
  artifactLink?: string;
}

/**
 * The full Evidence & Decision Trail for one evaluation — a read-only,
 * chronological, attributed reconstruction, not a legal/compliance artifact.
 */
export interface EvidenceTrail {
  evaluationId: string;
  events: EvidenceTrailEvent[];
}
