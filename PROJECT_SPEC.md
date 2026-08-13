# PROJECT_SPEC.md

## AI Evaluation & Knowledge Workflow — Project Specification

Status: **Planning artifact — no application code exists yet.**

---

## 1. Purpose, Audience, Portfolio Goal

**Purpose.** This is an independent, synthetic-data portfolio prototype that demonstrates a repeatable operating model for evaluating AI tools and turning individual evaluation results into reviewable, versioned, reusable organizational knowledge — without pretending the AI's output is authoritative on its own.

**Audience.**
- Hiring managers / interviewers assessing product, UX, and systems-thinking ability around applied AI governance (the primary audience given the legal/professional-services framing).
- Technical reviewers assessing code quality, architecture judgment, and restraint (not over-building).
- The author, as a working reference implementation for a real operating pattern.

**Portfolio goal.** Show — not just describe — that:
1. AI evaluation can be structured (not vibes-based).
2. Human review is a distinct, visible, accountable step, not a rubber stamp.
3. Approved knowledge is versioned, scoped, and traceable back to the evaluation and decision that produced it.
4. The author understands where enterprise integration (M365 / SharePoint / Power Automate / Airtable / n8n) would plug in, without falsely claiming those integrations exist yet.

This is a **demonstration of a workflow and a way of thinking**, not a SaaS product pitch and not a claim of deployed governance tooling.

---

## 2. Scope and Non-Goals

### In scope (this prototype)
- A navigable Next.js app implementing the full conceptual workflow end-to-end using synthetic, hardcoded/mock data.
- Four fixed, hand-authored synthetic evaluation cases (see §9 for the two "live" build cases and later phases for the remaining two).
- A structured evaluation framework (accuracy, completeness, source grounding, workflow fit, failure modes, review boundary).
- A human review UI with an explicit reviewer identity, decision, and rationale.
- A knowledge base of approved/deprecated guidance entries with version history and lifecycle status.
- A feedback mechanism that can trigger a new version of a knowledge entry.
- An evidence/decision trail view that reconstructs "what happened, in what order, decided by whom."
- A written case study page explaining the thinking behind the system (for portfolio reviewers who won't reverse-engineer the UI).
- Later phases (8–9): read/write persistence via Airtable, and **one** narrowly scoped n8n workflow (human-approved publication → Airtable upsert + Version record, per §14 — not a notification workflow). These remain **out of scope until explicitly reached** and are not implied to exist before then.

### Non-goals / explicit exclusions
- No real AI API calls (no OpenAI/Anthropic/Microsoft/Google API integration). All model outputs are pre-written synthetic fixtures.
- No authentication or real multi-user accounts. "Reviewer" is a labeled, selectable persona in mock data, not a login system.
- No real SharePoint, Power Apps, Power Automate, or Microsoft Graph calls. These appear only as **architecture-concept diagrams/prose** (§14), never as working integrations, until such work is separately scoped (which is not part of this plan).
- No claim of production-grade governance, compliance, or audit capability. Language is deliberately scoped to "prototype demonstrating an approach."
- No real client, matter, or firm data of any kind, and no law firm names, logos, or copied legal documents.
- No legal advice content of any kind, real or simulated as authoritative.
- No analytics dashboards, fake usage metrics, or fabricated adoption numbers.
- No component/pattern libraries beyond Tailwind utility classes unless a phase explicitly justifies one (avoid unnecessary dependencies).

---

## 3. Information Architecture

```
/                     Landing — thesis, workflow diagram, entry points
/workflow             The 8-step workflow explained end-to-end (static, educational)
/evaluations          List of evaluation cases (filter/sort by tool, case type, status)
/evaluations/[id]     Single evaluation: inputs, AI output, structured scoring, failure modes
/knowledge            List of knowledge base entries (guidance) with status + version
/knowledge/[id]       Single knowledge entry: guidance, prompt, limitations, owner, history
/feedback             Feedback submission + list of feedback items and their disposition (introduced Phase 6 — see §10)
/evidence/[id]        Evidence & Decision Trail for one case: chronological record
/case-study           Written narrative: problem, approach, decisions, what's simulated
```

Navigation shell (global): primary nav linking the above; no deep nested sub-nav in early phases. `/evidence/[id]` is reached primarily via links from `/evaluations/[id]` and `/knowledge/[id]`, not as a standalone browse list (its data model is 1:1 with an evaluation+decision, not an independent index). `/feedback` is not in the global nav until Phase 6 (per §10); before then it is neither linked nor routed, not even as a "coming soon" stub.

---

## 4. User Journey

Primary path (mirrors the core workflow):

1. **Land on `/`** — understand the thesis in under 30 seconds: "AI evaluation → human-reviewed knowledge, with a visible trail."
2. **Read `/workflow`** — see the 8-step model as a labeled diagram/sequence, understand vocabulary (Evaluation, Reviewer, Decision, Knowledge Entry, Evidence & Decision Trail) before looking at data.
3. **Browse `/evaluations`** — see 4 synthetic cases across 4 tools/use cases, each tagged with status (e.g., "Reviewed — Approved with conditions").
4. **Open `/evaluations/[id]`** — see the use-case intake, the simulated AI output, the structured scoring against the evaluation framework, and the specific failure mode the case is designed to demonstrate.
5. **See the Human Review** on the same page (or a clearly linked section) — reviewer identity, decision, rationale, what was accepted vs. what requires ongoing caution.
6. **Follow the link to the resulting `/knowledge/[id]`** — see how the reviewed evaluation became a reusable guidance entry: approved use, required review conditions, known limitations, prompt guidance, owner, version, date.
7. **Visit `/feedback`** — see how a real-world usage note ("this failed in X way") can be submitted and how it maps to a proposed knowledge update.
8. **Follow to `/evidence/[id]`** — see the full chronological trail: intake → test → evaluation → review → decision → publication → feedback → version update, each entry attributed and timestamped (synthetic dates).
9. **Read `/case-study`** — for a reviewer who wants the "why," not just the "what."

Secondary path: a portfolio reviewer skimming only `/case-study` and `/evidence/[id]` should still understand the system without clicking through everything — each of those pages must be self-explanatory.

---

## 5. Page Responsibilities

| Route | Responsibility | Must NOT do |
|---|---|---|
| `/` | Communicate thesis, show workflow at a glance, route into the rest of the app | Contain evaluation detail or claim metrics |
| `/workflow` | Explain the 8-stage model conceptually, define shared vocabulary | Show live/mock data as if it's a dashboard |
| `/evaluations` | Index of evaluation cases with scan-friendly status/tool/type metadata | Duplicate full case detail |
| `/evaluations/[id]` | Present one case fully: intake, AI output, structured scores, failure mode, review outcome | Let the AI's output read as the final word — review must be visually distinct |
| `/knowledge` | Index of guidance entries with status (Active/Deprecated/Superseded), owner, version | Show entries with no traceable origin evaluation |
| `/knowledge/[id]` | Present one guidance entry: scope, approved use, limitations, prompt guidance, owner, version history | Present guidance as legal advice or as unconditionally reliable |
| `/feedback` | Collect/display feedback items and show resulting disposition (accepted → new version / rejected → rationale / open) | Auto-apply feedback without a human decision step |
| `/evidence/[id]` | Chronological, attributed reconstruction of one case's full lifecycle | Be editable in the UI; must read as a record, not a form |
| `/case-study` | Explain problem framing, design decisions, what is real vs. simulated | Overstate scope beyond §2 |

---

## 6. Data Entities & Relationships

All entities are **TypeScript types + static/mock data modules** in this phase (and through Phase 7). Phase 8 introduces Airtable as the persistence layer for the same shapes.

```
UseCase (intake)
 ├─ id, title, submittedBy, businessContext, targetTool, dateSubmitted

Evaluation
 ├─ id, useCaseId → UseCase
 ├─ tool: "Microsoft Copilot" | "Claude" | "ChatGPT" | "Enterprise AI Retrieval"  (all labeled "simulated")
 ├─ caseType: "Summarization" | "Extraction" | "Draft Assistance" | "Knowledge Retrieval"
 ├─ inputSummary (synthetic source text description, not real documents)
 ├─ aiOutput (synthetic simulated model output)
 ├─ scores: { accuracy, completeness, sourceGrounding, workflowFit }  (each: score + rationale)
 ├─ failureMode: { description, severity, category }
 ├─ reviewBoundary (what a human must still check)
 ├─ status: "Pending Review" | "Reviewed" | "Superseded"
 ├─ reviewId → HumanReview (0 or 1)
 └─ evidenceId → EvidenceTrail (1)

HumanReview
 ├─ id, evaluationId → Evaluation
 ├─ reviewerName, reviewerRole (synthetic persona, clearly labeled "Human Reviewer")
 ├─ decision: "Approved" | "Approved with Controls" | "Pilot Only" | "Not Recommended"
 ├─ rationale
 ├─ conditions[] (if applicable)
 └─ date

KnowledgeEntry
 ├─ id, title, sourceEvaluationId → Evaluation
 ├─ status: "Active" | "Deprecated" | "Superseded"
 ├─ approvedUse, knownLimitations, requiredReview, promptGuidance
 ├─ owner (synthetic role/name)
 ├─ version (semantic-ish: v1, v1.1, v2)
 ├─ versionHistory[]: { version, date, changeSummary, changedBy }
 └─ date

FeedbackItem
 ├─ id, knowledgeEntryId → KnowledgeEntry
 ├─ submittedBy, note, dateSubmitted
 ├─ disposition: "Open" | "Accepted → New Version" | "Rejected"
 ├─ dispositionRationale
 └─ resultingVersion? → KnowledgeEntry.version

EvidenceTrailEntry (belongs to EvidenceTrail, 1 per Evaluation)
 ├─ evaluationId → Evaluation
 └─ events[]: { step, actor, actorType: "AI" | "Human", timestamp, description, artifactLink? }
```

Relationships are strictly traceable one direction at minimum: every `KnowledgeEntry` must resolve to a `sourceEvaluationId`; every `Evaluation` with `status: "Reviewed"` must have a `HumanReview`; every `Evaluation` must have exactly one `EvidenceTrail`.

---

## 7. Evaluation Framework

Each evaluation is scored on four fixed dimensions (1–5 scale + written rationale, not just a number):

1. **Accuracy** — Does the AI output correctly reflect the source material?
2. **Completeness** — Does it omit material information (the deliberate failure axis for Case 1)?
3. **Source Grounding** — Is every claim traceable to the input, vs. invented/inferred (the deliberate failure axis for Case 3)?
4. **Workflow Fit** — Does the output's format/structure match how a human would actually use it downstream (the deliberate failure axis for Case 2, where a conditional becomes an unconditional field)?

Additional structured fields per evaluation:
- **Failure Mode** — a named, specific defect the case demonstrates (not generic "AI can be wrong").
- **Severity** — Low / Medium / High, framed as "impact if unreviewed," not a claim about the underlying model's general quality.
- **Review Boundary** — an explicit statement of what a human must still verify even when the AI output looks correct. This is the conceptual core of the thesis and must appear on every evaluation.

Case 4 (Knowledge Retrieval) is scored on the same four dimensions but its "failure mode" is deliberately mild/absent — it demonstrates the **target state** (a well-grounded retrieval that surfaces already-reviewed guidance with full metadata), acting as the contrast case to the other three.

---

## 8. Human-Review Model

- Review is a **separate entity** (`HumanReview`) from the evaluation, not a field bolted onto it — this is the clearest way to visually and structurally enforce "AI does not decide."
- Every reviewer is a **labeled synthetic persona** (e.g., "Reviewer: Dana Whitfield, Practice Knowledge Lead") — never implying a real person or real firm role.
- Decisions are constrained to a fixed enum (`Approved`, `Approved with Controls`, `Pilot Only`, `Not Recommended`) so the UI can render decision state consistently and so `Not Recommended` evaluations visibly do **not** produce knowledge entries.
- Rationale is required text, not optional — a decision without a stated reason is not a valid state in the mock data.
- The UI must visually separate "what the AI produced" from "what the human decided" (distinct sections/panels, not interleaved), reinforcing the non-negotiable rule: **only a labeled human reviewer may finalize a decision or publish guidance.**
- **Decision scope.** Every `HumanReview` decision is a judgment about *this evaluation's specific synthetic use case and test configuration* (a named tool, applied to a named task type, under the conditions described in that evaluation) — never a general verdict on the underlying AI vendor/tool. `Not Recommended` on Case 3 means "draft assistance, as tested here, is not recommended for this workflow," not "this tool is bad." This scoping must be stated explicitly on any page that renders a decision badge or decision-derived copy (at minimum `/evaluations/[id]`, `/knowledge/[id]`, `/case-study`), so a reader cannot mistake a case-scoped outcome for a vendor-wide claim.

**Fixed case outcomes for this prototype** (final; not illustrative):

| Case | Case Type | Tool | Decision |
|---|---|---|---|
| Case 1 | Document Summarization | Microsoft Copilot (simulated) | `Approved with Controls` |
| Case 2 | Structured Information Extraction | Claude (simulated) | `Pilot Only` |
| Case 3 | Draft Assistance | ChatGPT (simulated) | `Not Recommended` |
| Case 4 | Internal Knowledge Retrieval | Enterprise AI Retrieval (simulated) | `Approved` |

(Tool assignments above follow the order already implied by the parallel `tool` and `caseType` enums in §6 — Copilot/Summarization, Claude/Extraction, ChatGPT/Draft Assistance, Enterprise AI Retrieval/Knowledge Retrieval — restated here only to make the decision table unambiguous.)

---

## 9. Knowledge Lifecycle

States: **Draft → Active → (Deprecated | Superseded)**

- A `KnowledgeEntry` is created only from a `HumanReview` with decision `Approved` or `Approved with Controls`. A `Pilot Only` decision (Case 2) does not by itself produce a general-use `KnowledgeEntry` in this prototype — it represents a scoped, supervised trial outcome, not a publishable guidance state; `Not Recommended` and unreviewed evaluations never produce a knowledge entry either. This is enforced in the mock-data layer, not just in prose.
- `Active` entries are what `/knowledge` surfaces by default; `Deprecated`/`Superseded` remain visible but visually de-emphasized, to demonstrate that knowledge has a maintained lifecycle rather than being published once and forgotten.
- Each entry carries **owner**, **version**, **date**, **approved use**, **known limitations**, **required review**, and **prompt guidance** — this exact field set is what Case 4 (Knowledge Retrieval) demonstrates surfacing correctly, so the schema is shared, not case-specific.
- Version increments happen only through the feedback loop (§10) or through direct governance action represented the same way (a new `HumanReview`-equivalent decision) — never silently.

---

## 10. Feedback & Version Model

1. A `FeedbackItem` is submitted against a specific `KnowledgeEntry` (synthetic submitter, free-text note, date).
2. Feedback starts as `Open`.
3. A (synthetic, human-labeled) disposition step resolves it to either:
   - **Accepted → New Version**: produces a new `versionHistory` entry on the `KnowledgeEntry` (e.g., v1 → v1.1), with a change summary and who changed it. The entry's top-level `version`/`date` updates to match.
   - **Rejected**: stays visible with a stated rationale, demonstrating that not all feedback changes guidance — this matters for credibility (a system where all feedback is "accepted" isn't demonstrating judgment).
4. This loop is what proves the "reusable, maintained knowledge" half of the thesis, as opposed to a one-time static publish.

**Feedback timing across phases.**
- **Phases 1–5**: `/feedback` is not exposed in navigation or routing at all — no page, no stub, no route. The feedback/version concept is described only in this spec and in `/workflow`'s static vocabulary explanation, not demonstrated live, since there is nothing yet to submit feedback against in a meaningful way.
- **Phase 6**: `/feedback` is introduced for the first time. Dispositions shown are pre-authored mock states (to demonstrate the model, per points 1–4 above). If an interactive submission form is included, it operates on **local/mock, session-only state** (e.g., component state or an in-memory array) — never written to a file, API, or any store that survives a page reload — and must carry a clear, visible disclosure that changes are demo-only and not persisted (e.g., a toast or inline banner: "Demo only — not persisted; changes reset on reload").
- **Phase 8**: Replaces Phase 6's local/mock state with real Airtable-backed persistence for `/feedback` submissions, per §14. This is a storage-layer swap only — the `FeedbackItem` entity model defined in §6, its disposition enum, and the version-increment behavior in points 1–4 above do not change.

---

## 11. Evidence & Decision Traceability

**Canonical 8-step workflow model** (authoritative labels, used verbatim on `/workflow`, the `/` workflow strip, and `/evidence/[id]`):

1. **Intake** — a `UseCase` is submitted (synthetic requester, business context, target tool).
2. **AI Test Run** — the tool is exercised against the use case; a simulated AI output is recorded.
3. **Structured Evaluation** — the output is scored against the four-dimension framework (§7), with failure mode and review boundary recorded.
4. **Human Review** — a labeled human reviewer examines the evaluation.
5. **Decision** — the reviewer records a decision (§8 enum), with rationale.
6. **Knowledge Published** — if publish-eligible (§9), a `KnowledgeEntry` is created from the decision.
7. **Feedback Received** — a `FeedbackItem` is submitted against the published entry (§10; not before Phase 6).
8. **Version Updated** — accepted feedback produces a new `versionHistory` entry, closing the loop.

Steps 6–8 do not apply to every case (e.g., a `Not Recommended` decision stops at step 5); `/workflow` presents all 8 as the general model and notes that later steps are conditional on earlier outcomes.

- Label used throughout the app and docs: **"Evidence & Decision Trail"** — never "audit trail," never "immutable," never implying legal/compliance evidentiary weight.
- Each `EvidenceTrailEntry` is a **read-only, chronological list of attributed events** tied 1:1 to an `Evaluation`, using the 8-step model above: intake → AI test run → structured evaluation recorded → human review → decision → (if applicable) knowledge published → feedback received → version updated.
- Every event has an explicit `actorType` (`AI` or `Human`) rendered distinctly — this is the visual proof of the thesis at the most granular level.
- The trail is presented as evidence of **process**, not as a legal or compliance artifact, and the UI/copy must not claim tamper-proofing, immutability, or regulatory sufficiency.

---

## 12. Mock-Data Rules

- All data lives in `src/data/` (or `src/lib/data/`) as typed TypeScript modules — no database, no fetch calls, in Phases 1–7.
- All names (people, companies, matters, documents) are obviously synthetic (e.g., "Dana Whitfield," "Northfield Manufacturing Co. (synthetic)"). No real company, firm, or product-adjacent-but-real-sounding name that could be mistaken for a real entity.
- Every AI tool reference must carry a "(simulated)" qualifier at first mention on any page that names it, and tool names are used only as **labels for a simulated evaluation subject**, never implying a real API call occurred.
- Dates are synthetic and internally consistent (chronological order must hold within each Evidence Trail).
- No numeric claims that resemble real analytics (no "94% accuracy across 10,000 documents" style fabrication) — scores are the 1–5 framework values only, explicitly framed as this-prototype's evaluation output, not industry benchmarks.
- Source "documents" referenced by evaluations are described narratively (e.g., "a 4-page synthetic vendor services agreement excerpt") rather than reproduced as realistic-looking legal documents, per the Truth/Safety constraint against copied legal documents.

---

## 13. Visual Principles

- Professional, restrained, credible for a legal/professional-services knowledge-management context.
- Strong typographic hierarchy (clear H1/H2/H3 scale, generous line-height for dense text) over decorative UI.
- Neutral palette (near-black/near-white/gray, one restrained accent color for status/decision states only — not for branding flourish).
- Status and decision states use color **semantically and sparingly** (e.g., muted green = Approved, muted amber = Approved with Controls / Pilot Only, muted red = Not Recommended, gray = Pending/Deprecated) — not a rainbow of badges.
- Dense, scannable tables/lists for index pages (`/evaluations`, `/knowledge`, `/feedback`); generous whitespace and clear section breaks for detail pages.
- No gradients, no glassmorphism, no floating chat widgets, no animated hero sections, no fabricated logos/testimonials/analytics.
- Motion, if any, limited to simple opacity/transform transitions on interactive elements (hover/focus) — nothing decorative.

---

## 14. Technology Architecture

**Current phase (1–7):**
- Next.js 16.3.0 (App Router), React 19.2.8, TypeScript (strict), Tailwind CSS v4 — all already present in this scaffold; no additional framework changes.
- Static/typed mock-data modules under `src/data/`; no external I/O.
- File-based routing per the routes in §3, using the App Router conventions for this Next.js version (dynamic segments `[id]`, typed route params per this project's generated `LayoutProps`/`PageProps` helpers).
- No new runtime dependencies unless a later phase justifies one explicitly (e.g., a date-formatting or table utility) — default to hand-rolled components on top of Tailwind.

**Later phases (not yet implemented):**
- **Phase 8 — Airtable**: Airtable used as the system of record for the entities in §6, replacing static modules with server-side reads (and, for `/feedback` submission, writes) via Next.js Route Handlers / Server Actions. Credentials via environment variables, never committed. Airtable chosen (over a hosted DB) specifically because it's a realistic "knowledge ops" tool a non-engineering team could actually maintain — reinforcing the enterprise-knowledge-management framing.
- **Phase 9 — n8n**: exactly **one** narrowly scoped workflow, and it is a **publication** workflow, not a notification workflow — no Slack/Discord and no notify-only path. Trigger is a human-approved **Publish** action on a `KnowledgeEntry` (an explicit human action in the app UI, not an automatic status transition and not a scheduled/polling trigger). That action performs a server-side POST to the n8n webhook; the n8n workflow then: (1) upserts the approved `KnowledgeEntry` in Airtable, (2) creates its `versionHistory`/Version record in Airtable, and (3) returns a publication success/failure result to the caller. If publication automation fails, the app must preserve the reviewer's saved review/decision state (it is not lost or rolled back) and surface the failure honestly rather than silently reporting success. This demonstrates "human-approved publication event → downstream system-of-record write" without overreaching into a general automation or notification platform claim.
- **Phase 10 — Vercel**: deployment target; production QA/accessibility pass.

**Enterprise-integration concept (architecture-only, prose/diagram, not implemented):**
- SharePoint / M365 as the eventual document source-of-truth for real `UseCase` intake material.
- Power Automate as an alternative/complementary trigger layer to n8n in an enterprise that already standardizes on M365.
- An enterprise AI retrieval platform (i.e., what Case 4 simulates) as the eventual consumer of `KnowledgeEntry` data — the thing that would actually surface "Active" guidance to end users inside their tools.
- This section is explicitly framed in `/case-study` as **"how this would extend in an enterprise," not as work performed** — no diagrams or copy may imply these are connected today.

---

## 15. Truth / Privacy / Safety Boundaries

Restated as hard constraints on every phase of this project:

1. Synthetic data only — no real client, matter, or firm data, ever.
2. No implication of affiliation with, or deployment at, any law firm.
3. No legal advice, real or simulated-as-authoritative — evaluation cases demonstrate AI *evaluation*, not legal conclusions a user should rely on.
4. No claim of production governance/compliance capability — this is a prototype/demonstration, stated as such in `/case-study` and, where relevant, in page copy.
5. No fake integrations or fabricated metrics — anything not actually built (Airtable, n8n, SharePoint, Power Automate, auth, live AI APIs) is either absent or explicitly labeled conceptual/future in the UI and docs.
6. No law firm logos or copied legal documents — all source material is narratively described or clearly synthetic when shown.
7. Named AI tools (Copilot, Claude, ChatGPT) appear only as labeled simulated evaluation subjects, with "(simulated)" qualifiers, unless genuinely integrated later (out of current scope).
8. Only an explicitly labeled human reviewer may render a final decision or publish guidance — enforced in data model (§8–9), not just copy.
9. The term **"Evidence & Decision Trail"** is used consistently; "audit trail" and "immutable" are prohibited terms in this codebase and its copy.

---

## 16. Acceptance Criteria (for this planning phase)

- [x] `PROJECT_SPEC.md` exists and covers all sections requested in the brief.
- [x] `IMPLEMENTATION_PLAN.md` exists with the 10 specified sequential phases, each with objective, scope, deferred work, acceptance criteria, and validation steps.
- [x] No application code, routes, or UI have been added or modified in this phase.
- [x] All planned content complies with §15 (Truth/Privacy/Safety).
- [x] Terminology matches the brief exactly ("Evidence & Decision Trail," case labels, route list, phase list).
- [x] Identified risks are called out explicitly (see IMPLEMENTATION_PLAN.md §"Cross-Phase Risks" and the final report to the user).

**Acceptance criteria for the product itself** (to be validated cumulatively as later phases complete):
- A first-time visitor can articulate the thesis after visiting `/` and `/workflow` alone.
- Every `KnowledgeEntry` visible in the UI can be traced, via a visible link, back to the `Evaluation` and `HumanReview` that produced it.
- Every `Evaluation` marked `Reviewed` shows a distinct, clearly human-attributed review section separate from the AI output.
- `/evidence/[id]` reconstructs a case's full lifecycle from links reachable off `/evaluations/[id]` and `/knowledge/[id]` without requiring URL guessing.
- No page, at any phase, contains content that violates §15.
