# IMPLEMENTATION_PLAN.md

## AI Evaluation & Knowledge Workflow — Implementation Plan

Status: **Planning artifact — no application code exists yet.** See `PROJECT_SPEC.md` for the full specification this plan implements against. Phases are strictly sequential; do not begin phase *n+1* until phase *n*'s acceptance criteria are met.

---

## Phase 1 — Shell, Navigation, Home, Workflow, Case-Study Skeleton

**Objective.** Stand up the app shell and the three "explanatory" routes (`/`, `/workflow`, `/case-study`) so the thesis is legible before any case data exists.

**Implementation scope.**
- Root layout: global nav with the 5 top-level route labels from §3 that exist as of Phase 1 — `/`, `/workflow`, `/evaluations`, `/knowledge`, `/case-study` (dynamic `[id]` routes and `/evidence/[id]` are never standalone nav items per §3; `/feedback` is not introduced until Phase 6 per §10) — footer with a short "synthetic data / portfolio prototype" disclosure line (supports §15).
- `/` : thesis statement, 8-step workflow strip (visual, non-interactive), links into `/workflow` and `/evaluations`.
- `/workflow` : the full 8-step model as static, labeled content — this is the vocabulary reference the rest of the app depends on.
- `/case-study` : skeleton with section headers only (Problem, Approach, What's Simulated vs. Real, Enterprise Extension) — full prose can land incrementally as later phases give it something to describe, but the "What's Simulated vs. Real" section must be accurate as of *this* phase (i.e., say "no case data yet" if true).
- Stub pages for `/evaluations` and `/knowledge` with a placeholder ("coming in Phase 2/5") so nav links don't 404 — no `/evaluations/[id]`, `/knowledge/[id]`, `/evidence/[id]` stubs yet since they require an `id`. `/feedback` is **not** stubbed, routed, or linked in nav yet — per PROJECT_SPEC §3/§10 it does not exist at all until Phase 6, not even as a "coming soon" placeholder.
- Base Tailwind design tokens: type scale, neutral palette, status-color variables (defined but not yet used) per §13.
- `src/data/` directory created with entity types from PROJECT_SPEC §6 (types only, no case data yet).

**Explicitly deferred.**
- Any real evaluation/knowledge/feedback content.
- `/evidence/[id]` (has no data to point at yet).
- Any dynamic route.

**Acceptance criteria.**
- All 5 nav links present at this phase resolve (no 404s), each to either real content or an honest "coming soon." `/feedback` is intentionally absent from nav and routing at this phase.
- `/`, `/workflow`, `/case-study` communicate the thesis and vocabulary without referencing unbuilt features as if they exist.
- No entity data yet — only TypeScript types.
- Lint and typecheck pass.

**Validation steps.**
- `npm run lint` clean.
- `npx tsc --noEmit` clean (strict mode, per existing `tsconfig.json`).
- `npm run dev` manual click-through of all nav links.
- Re-read §15 against all new copy.

---

## Phase 2 — Four Synthetic Cases

**Objective.** Author the complete mock-data fixtures for all four cases (Copilot summarization, Claude extraction, ChatGPT draft assistance, Enterprise AI Retrieval) so every later phase has real content to render.

**Implementation scope.**
- Populate `src/data/` with 4 `UseCase` + 4 `Evaluation` records matching the case definitions in the brief exactly (Case 1: omitted qualification; Case 2: conditional flattened to unconditional; Case 3: confident language exceeding source support; Case 4: well-grounded retrieval with full metadata as the contrast case).
- Write the synthetic "source material" narratively (§12) for each — no realistic reproduced legal documents.
- Write the synthetic AI output for each case, deliberately containing the specified failure mode.
- Score each case on the four evaluation dimensions with written rationale (not just numbers).
- Write `failureMode` and `reviewBoundary` for cases 1–3; write the (mild/absent) equivalent framing for case 4.
- `/evaluations` now lists these 4 real cases (index UI can be minimal/table-like at this stage — full visual polish belongs to Phase 3).

**Explicitly deferred.**
- The full `/evaluations/[id]` detail-page UI/layout (Phase 3).
- `HumanReview` records (Phase 4).
- `KnowledgeEntry` records (Phase 5).

**Acceptance criteria.**
- 4 cases exist, each traceable to one of the 4 named tools and one of the 4 named case types, each with a clearly identifiable failure mode matching the brief.
- All content passes the §12 mock-data rules and §15 safety boundaries (synthetic names, "(simulated)" qualifiers, no real-sounding entities).
- `/evaluations` renders all 4 without errors.

**Validation steps.**
- Manual read-through of each case against its brief description to confirm the failure mode is actually demonstrated, not just asserted.
- Lint/typecheck clean.
- Spot-check every tool mention for the "(simulated)" qualifier.

---

## Phase 3 — Evaluation Workspace

**Objective.** Build the full `/evaluations/[id]` experience: the "workspace" view of intake, AI output, and structured scoring.

**Implementation scope.**
- `/evaluations/[id]` dynamic route with typed params.
- Layout sections: Use-Case Intake summary, Simulated AI Output (clearly labeled panel), Structured Scoring (4-dimension breakdown with rationale), Failure Mode callout, Review Boundary callout.
- Visual separation established here between "AI produced" content and everything else, since Human Review (Phase 4) will attach to this same page.
- `/evaluations` index upgraded to full scannable table/card view (tool, case type, status, date) per §13.
- Status badges (Pending Review / Reviewed / Superseded) using the semantic status-color tokens from Phase 1.

**Explicitly deferred.**
- Human Review section content (Phase 4) — this phase can reserve the layout slot but should not fabricate review data early.
- Links to `/knowledge/[id]` and `/evidence/[id]` (both depend on later phases' data existing) — add as dead/placeholder links only if honestly labeled, otherwise omit until the target exists.

**Acceptance criteria.**
- All 4 cases render correctly at `/evaluations/[id]`.
- A reader unfamiliar with the project can distinguish "what the AI said" from "structured evaluation of it" at a glance, purely from layout/typography (no user testing required — self-review against §13/§5).
- No broken links.

**Validation steps.**
- Manual review of each of the 4 detail pages against PROJECT_SPEC §5's "must not" column (AI output must not read as final word).
- Responsive check at mobile width (basic, not exhaustive — full a11y/QA is Phase 10).
- Lint/typecheck clean.

---

## Phase 4 — Human Review

**Objective.** Add the `HumanReview` entity and its UI, making the human-in-the-loop decision structurally and visually explicit.

**Implementation scope.**
- Author `HumanReview` mock records using the fixed case outcomes from PROJECT_SPEC §8 (final, not illustrative): Case 1 (Document Summarization) → `Approved with Controls`; Case 2 (Structured Information Extraction) → `Pilot Only`; Case 3 (Draft Assistance) → `Not Recommended`; Case 4 (Internal Knowledge Retrieval) → `Approved`. This distribution already proves the model doesn't rubber-stamp (one full approval, one conditional approval, one pilot-scoped, one non-recommendation) — no further distribution decision is needed in this phase.
- On every page rendering a decision badge or decision-derived copy, make explicit that the decision is scoped to that case's specific synthetic use case/test configuration, not a general verdict on the underlying tool (PROJECT_SPEC §8 "Decision scope").
- `/evaluations/[id]` renders the Human Review section: reviewer persona, decision badge, rationale, conditions (if any) — visually distinct panel per Phase 3's reserved slot.
- Update `/evaluations` status badges to reflect the real review outcomes above.
- Enforce in code (not just content) that only evaluations with an `Approved`/`Approved with Controls` `HumanReview` are eligible to source a general-use `KnowledgeEntry` — e.g., a typed helper `canPublish(evaluation): boolean` that Phase 5 will consume, so the constraint exists before the feature that could violate it does. `Pilot Only` (Case 2) and `Not Recommended` (Case 3) are both non-publishing outcomes for this gate; Case 2 is not represented as a general-use `KnowledgeEntry` in this prototype (per PROJECT_SPEC §9).

**Explicitly deferred.**
- Actual `KnowledgeEntry` creation/publication (Phase 5).
- Any interactive "submit a review" form (out of scope entirely per PROJECT_SPEC — review is presented as a recorded outcome, not something a site visitor performs).

**Acceptance criteria.**
- Every case has a `HumanReview` with required rationale, matching the fixed outcomes table in PROJECT_SPEC §8 exactly.
- `canPublish()` (or equivalent) correctly gates on decision type — `true` for `Approved`/`Approved with Controls` (Cases 1 and 4), `false` for `Pilot Only`/`Not Recommended` (Cases 2 and 3); unit-testable logic (even if tested manually via a few asserted cases at this stage, given no test framework is yet installed).
- AI output and human decision are visually and structurally distinct on the page.
- Decision badges/copy read as case-scoped, not vendor-wide (PROJECT_SPEC §8 "Decision scope").

**Validation steps.**
- Manual trace: for each case, decision type → expected publish-eligibility matches PROJECT_SPEC §9.
- Re-confirm §15 boundary #8 (only labeled human reviewer finalizes) is visibly true on every case page.
- Lint/typecheck clean.

---

## Phase 5 — Knowledge Hub

**Objective.** Build `/knowledge` and `/knowledge/[id]`, turning approved reviews into browsable, versioned guidance.

**Implementation scope.**
- Author `KnowledgeEntry` records for every publish-eligible evaluation from Phase 4 (via the `canPublish` gate — no entry exists without a real source evaluation).
- `/knowledge` index: status (Active/Deprecated/Superseded), owner, version, title, scannable table per §13; Active entries default-visible, others de-emphasized but present.
- `/knowledge/[id]` detail: approved use, known limitations, required review, prompt guidance, owner, version, date, and a version-history list (single-entry history at this stage — feedback-driven growth comes in Phase 6).
- Bidirectional linking: `/knowledge/[id]` links back to its `sourceEvaluationId` at `/evaluations/[id]`; `/evaluations/[id]` (for publish-eligible cases) now links forward to its resulting `/knowledge/[id]`.
- This phase is also where Case 4 (Enterprise AI Retrieval) is demonstrated meaningfully: its evaluation should show it "retrieving" one of the other cases' knowledge entries, proving the retrieval-quality contrast described in PROJECT_SPEC §7.

**Explicitly deferred.**
- Feedback-driven version increments (Phase 6) — version history starts at v1 for every entry here.
- Airtable-backed data (Phase 8) — still static modules.

**Acceptance criteria.**
- Every `KnowledgeEntry` traces to a real `sourceEvaluationId` with an `Approved`/`Approved with Controls` review (Cases 1 and 4 only) — verified programmatically via the Phase 4 gate, not just by hand-authoring correctly.
- Bidirectional links work in both directions for every eligible case.
- Case 4's evaluation page demonstrably references a real knowledge entry from another case.

**Validation steps.**
- Manual link-trace for every case: Evaluation ↔ Knowledge Entry.
- Confirm no `KnowledgeEntry` exists for Case 2 (`Pilot Only`) or Case 3 (`Not Recommended`) from Phase 4.
- Lint/typecheck clean.

---

## Phase 6 — Feedback / Version Loop

**Objective.** Introduce `/feedback` for the first time (it does not exist in Phases 1–5, per PROJECT_SPEC §3/§10) and wire it to produce a real version increment on at least one `KnowledgeEntry`, closing the "reusable, maintained" loop — using local/mock state only.

**Implementation scope.**
- Add `/feedback` to routing and global nav for the first time.
- Author 2–3 `FeedbackItem` mock records against existing knowledge entries, covering all three dispositions (`Open`, `Accepted → New Version`, `Rejected`) per PROJECT_SPEC §10.
- For the `Accepted → New Version` case, actually add a second `versionHistory` entry to the target `KnowledgeEntry` (v1 → v1.1) with change summary and who changed it, and update that entry's top-level version/date — this is the concrete artifact proving the loop closes, not just a feedback list.
- `/feedback` page: list of feedback items with disposition badges and rationale; a visually present submission form backed by **local/mock, session-only state** (component state or an in-memory array — never a file, API route, or anything surviving reload), clearly and visibly labeled "Demo only — not persisted; changes reset on reload" per PROJECT_SPEC §10 (persistence arrives in Phase 8, which swaps the storage layer only).
- `/knowledge/[id]` version-history section now shows multiple entries for the affected entry; link from that feedback item to the affected `/knowledge/[id]`.

**Explicitly deferred.**
- Real persistence of new submissions (Phase 8) — Phase 8 replaces this phase's local/mock state with Airtable without changing the `FeedbackItem` entity model.
- Any automated/AI-driven disposition logic — dispositions remain human-authored mock states, consistent with §8's "only a human decides" rule extending conceptually to knowledge maintenance.

**Acceptance criteria.**
- All three disposition states are represented at least once.
- At least one `KnowledgeEntry` shows a real 2-entry version history driven by an `Accepted` feedback item.
- Submission form cannot be mistaken for a live/persisted action — disclosure is visible, not buried, and state genuinely resets on reload.

**Validation steps.**
- Manual trace: feedback item → disposition → (if accepted) resulting version bump visible on the knowledge entry page.
- Confirm rejected feedback item still displays with rationale (not hidden).
- Lint/typecheck clean.

---

## Phase 7 — Evidence & Decision Trail

**Objective.** Build `/evidence/[id]`, reconstructing each case's full lifecycle from the data already authored in Phases 2–6.

**Implementation scope.**
- Derive (not hand-author separately, to avoid data drift) an `EvidenceTrailEntry` event list per evaluation from existing entities: intake (`UseCase`) → AI test recorded (`Evaluation.aiOutput` present) → structured evaluation recorded (`Evaluation` scores) → human review (`HumanReview`) → decision → knowledge published (`KnowledgeEntry`, if applicable) → feedback received (`FeedbackItem`, if any) → version updated (if any).
- Each event renders with explicit `actorType` (AI/Human) styling per PROJECT_SPEC §11 and §13.
- `/evidence/[id]` reachable via a clearly placed link from `/evaluations/[id]` and, where applicable, `/knowledge/[id]` — not exposed as a browsable index (per PROJECT_SPEC §3).
- Copy audit: confirm "Evidence & Decision Trail" label used consistently everywhere; confirm no "audit trail"/"immutable" language anywhere in the codebase (grep check).

**Explicitly deferred.**
- Any persistence changes (still static derivation from Phases 2–6 data).
- Airtable/n8n (Phases 8–9).

**Acceptance criteria.**
- Every one of the 4 cases has a working `/evidence/[id]` page with a chronologically correct, internally consistent event list (no case where a later step's date precedes an earlier step's).
- `actorType` is visually distinct for every event.
- Repo-wide grep for "audit trail" / "immutable" returns zero matches outside of this plan's own explanatory text.

**Validation steps.**
- `grep -ri "immutable\|audit trail" src/` returns nothing (or only intentional negative-framing, e.g., "not an immutable audit trail," if used deliberately in `/case-study` to clarify the distinction — judgment call, document if used).
- Manual chronology check per case.
- Lint/typecheck clean.
- **This phase completes the core prototype (Phases 1–7).** Full pause point for portfolio review before optional infrastructure phases 8–10.

---

## Phase 8 — Airtable Persistence

**Objective.** Replace static mock-data modules with Airtable as the system of record, without changing the entity shapes defined in PROJECT_SPEC §6.

**Implementation scope.**
- Airtable base modeled 1:1 to the §6 entities (bases/tables: UseCases, Evaluations, HumanReviews, KnowledgeEntries, FeedbackItems).
- Server-side data access (Route Handlers or Server Actions) reading from Airtable via its REST API; API key via environment variable, never committed, `.env.example` documents required vars without real values.
- `/feedback` submission form becomes a real (rate-limited/minimal-validation) write to Airtable, replacing the Phase 6 "demo only" labeling — update that copy accordingly.
- Migration script/seed step to populate the Airtable base from the existing static fixtures (one-time, run manually, not part of the app runtime).
- Caching/error-handling: graceful degraded state if Airtable is unreachable (don't hard-crash the portfolio site on a transient API issue).

**Explicitly deferred.**
- Any write path other than `/feedback` submission (evaluations/reviews/knowledge remain read-only from the UI — they represent a curated internal process, not open editing).
- n8n (Phase 9).

**Acceptance criteria.**
- All pages render identical content to Phase 7's static version, now sourced from Airtable (content parity is the regression check).
- A new `/feedback` submission actually appears in the Airtable base and, on next load, in the UI.
- No API keys committed; `.env.example` present and accurate.
- Graceful fallback UI if Airtable is unreachable (manually tested by simulating a bad key).

**Validation steps.**
- Content diff/spot-check between pre-migration static output and post-migration Airtable-backed output for all 4 cases.
- Submit a test feedback item end-to-end and confirm it appears in both Airtable and the rendered page.
- Deliberately break the API key locally and confirm a non-crashing, honest error state.
- Lint/typecheck clean; confirm no secrets in git history for this phase's commits.

---

## Phase 9 — One n8n Publication Workflow

**Objective.** Add exactly one narrowly scoped n8n workflow demonstrating "human-approved publication event → downstream system-of-record write," per PROJECT_SPEC §14. This is a **publication** workflow, not a notification workflow — no Slack/Discord, no notify-only path.

**Implementation scope.**
- Single n8n workflow with exactly this trigger/step sequence, matching PROJECT_SPEC §14 exactly:
  1. **Trigger**: a human-approved **Publish** action in the app UI (an explicit reviewer/owner action on a `KnowledgeEntry` — never an automatic status transition, scheduled job, or polling trigger).
  2. The app performs a **server-side POST to the n8n webhook** (Route Handler/Server Action calling the webhook URL — never a client-side call with exposed credentials).
  3. The n8n workflow **upserts the approved `KnowledgeEntry`** in Airtable.
  4. The n8n workflow **creates its Version record** (the corresponding `versionHistory` entry) in Airtable.
  5. The n8n workflow **returns publication success/failure** to the caller, which the app surfaces honestly (no silent success on failure).
- Failure handling: if the publication automation fails (webhook unreachable, n8n error, Airtable write failure), the app must **preserve the reviewer's already-saved review/decision state** — publication failure never discards or rolls back a saved human review.
- Document the workflow (screenshot or exported JSON) referenced from `/case-study`, since the workflow itself lives in n8n, not in this repo.
- No general-purpose automation platform claims and no notification/messaging side effect — this is one workflow, one human-triggered action, one Airtable write path, by design (matches the brief's "narrowly scoped" instruction).

**Explicitly deferred.**
- Any additional n8n workflows.
- Any notification/messaging integration (Slack, Discord, Teams, email) — explicitly out of scope for this workflow, not just deferred to a later phase.
- Power Automate (remains architecture-concept only, per PROJECT_SPEC §14).

**Acceptance criteria.**
- Exactly one workflow exists and is documented.
- The workflow only fires from an explicit human Publish action — never automatically.
- Triggering it produces exactly the Airtable upsert + Version-record creation described above, plus a success/failure result surfaced in the UI — verified manually.
- Simulated publication failure (e.g., bad webhook URL) leaves the saved `HumanReview`/decision state intact and shows an honest failure state, not a silent success.
- `/case-study` accurately describes what's real (this one publication workflow) vs. conceptual (Power Automate/SharePoint/M365), and does not describe it as a notification workflow.

**Validation steps.**
- End-to-end manual trigger test: perform the human Publish action, confirm the Airtable `KnowledgeEntry` upsert and Version record are created exactly once (not duplicated).
- Deliberately break the webhook call (bad URL/simulated network failure) and confirm the saved review is preserved and the UI reports failure honestly.
- Re-read all copy referencing this workflow for scope accuracy against §15 (no Slack/Discord/notification framing).

---

## Phase 10 — Production QA, Accessibility, Vercel

**Objective.** Final hardening pass and deployment.

**Implementation scope.**
- Accessibility pass: semantic landmarks, heading order, color-contrast check on all status badges/tokens (per §13's semantic-but-restrained color use), keyboard navigability of all interactive elements (nav, feedback form, links), alt text on any images.
- Responsive QA across common breakpoints for all 9 routes.
- Metadata/SEO basics per-route (title/description) consistent with this Next.js version's Metadata API.
- Full repo-wide copy audit against PROJECT_SPEC §15 (one final grep/read pass across all routes and data files).
- Performance sanity check (no obviously unbounded client bundles; static/server rendering used appropriately for mostly-static content).
- Deploy to Vercel; environment variables (Airtable key, n8n webhook if applicable) configured in Vercel project settings, not committed.
- Final README update: what's real vs. simulated, link to `/case-study`, local dev setup instructions including required env vars.

**Explicitly deferred.**
- Nothing — this is the final phase. Any issue found here that implies new scope (e.g., "we should add auth") is logged as a future-work note in `/case-study`, not implemented ad hoc.

**Acceptance criteria.**
- Lighthouse or equivalent accessibility check passes with no critical violations on representative pages (`/`, `/evaluations/[id]`, `/knowledge/[id]`, `/evidence/[id]`).
- Site is live on a Vercel URL, fully navigable, matching Phase 9's functionality.
- README and `/case-study` both accurately describe current real vs. conceptual scope, final sign-off against §15.

**Validation steps.**
- Automated accessibility scan + manual keyboard-only click-through.
- Cross-browser spot check (at least Chrome + Safari/Firefox).
- Fresh `git clone` + documented setup steps actually work end-to-end for a new environment.
- Final full-repo grep for prohibited terms/claims (§15) before calling this done.

---

## Cross-Phase Risks and Corrections

Identified while authoring this plan, corrected in-line above; restated here for visibility:

1. **Risk: implying live integrations before Phase 8/9.** Corrected by not exposing `/feedback` at all until Phase 6, then backing it with local/mock, session-only state and explicit "demo only / not persisted" labeling through Phase 7, and by keeping Phases 1–7 entirely static, with copy in `/case-study` scoped to match whatever phase is actually complete at any given time.
2. **Risk: knowledge entries appearing without a valid source review** (data-integrity risk that would silently violate the thesis). Corrected by introducing the `canPublish()` gate in Phase 4, before Phase 5 can create any entry, and using it as a hard constraint rather than a documentation-only rule.
3. **Risk: "Evidence & Decision Trail" data drifting from the entities it summarizes** if hand-authored separately. Corrected by deriving trail events from existing entities in Phase 7 rather than maintaining a parallel hand-written record.
4. **Risk: prohibited terminology ("audit trail," "immutable") entering copy inadvertently**, especially in later phases written under time pressure. Corrected by adding an explicit grep-based validation step in Phase 7 and repeating it in Phase 10's final pass.
5. **Risk: reviewer personas or synthetic company names reading as real.** Corrected by the explicit naming convention in PROJECT_SPEC §12 (obviously synthetic names, "(synthetic)" qualifiers on organization names) applied starting Phase 2.
6. **Risk: scope creep toward a general automation/integration platform** in Phases 8–9 (e.g., adding multiple n8n workflows or broad Airtable write access "while we're in there"). Corrected by keeping Phase 8 writes limited to `/feedback` only and Phase 9 fixed at exactly one workflow, both stated explicitly in those phases' scope sections.
7. **Risk: legal-advice-adjacent language leaking into synthetic case content** (e.g., a knowledge entry that reads as actual legal guidance rather than a demonstration artifact). Corrected by Phase 2's requirement that all source material and guidance be framed narratively/generically (contract-adjacent but genuinely synthetic and non-actionable), checked again in Phase 10's final audit.
8. **Risk: unnecessary dependencies/components** (e.g., pulling in a full UI kit or state-management library for what is fundamentally a mostly-static content site). Corrected by PROJECT_SPEC §14's default-to-no-new-dependencies stance, revisited only if a specific phase justifies one.

No corrections required further changes to PROJECT_SPEC.md beyond what's already reflected there — risks above were designed against during spec authoring, not discovered as post-hoc gaps.
