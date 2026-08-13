import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case Study",
  description:
    "The thinking behind this prototype: the problem, the design question, what was built, and how the pieces fit together.",
};

export default function CaseStudyPage() {
  return (
    <main className="flex-1">
      <section className="content-container pt-14 pb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Independent prototype — synthetic data only
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Case Study
        </h1>
        <p className="mt-5 text-lg leading-8 text-foreground/80">
          This page explains the thinking behind the system for a reader who
          wants the &ldquo;why,&rdquo; not just the &ldquo;what.&rdquo; It
          does not duplicate every screen — for the live system, start at{" "}
          <Link
            href="/workflow"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            /workflow
          </Link>{" "}
          and{" "}
          <Link
            href="/evaluations"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            /evaluations
          </Link>
          .
        </p>
      </section>

      <section className="content-container space-y-14 pb-20">
        {/* Problem */}
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Problem</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/80">
            Teams in professional-services settings are already experimenting
            with AI tools against real work — summarizing agreements,
            extracting data points, drafting client-facing language. The
            common failure mode is not that the AI is unusably bad; it&apos;s
            that its output looks complete and confident even when it
            isn&apos;t, and there&apos;s rarely a structured, repeatable way
            to decide whether an evaluation deserves trust, capture that
            decision, and turn it into guidance the next person can actually
            reuse. Without that structure, adoption tends to go one of two
            ways: ad hoc trust in whatever the tool produced, or blanket
            distrust that ignores when a tool is genuinely useful under
            specific conditions. Both are unstructured, and neither leaves a
            trail.
          </p>
        </div>

        {/* Design Question */}
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Design Question
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/80">
            What does a repeatable operating model look like for evaluating
            an AI tool against a real use case, keeping a human accountable
            for the decision, and turning only what&apos;s approved into
            knowledge that&apos;s reusable, versioned, and traceable back to
            the evaluation and reviewer that produced it — without ever
            treating the AI&apos;s output as the final word?
          </p>
        </div>

        {/* What I Built */}
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            What I Built
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/80">
            A navigable Next.js app that implements that operating model
            end-to-end, using four hand-authored synthetic evaluation cases.
            Each case pairs one simulated AI tool with one task type, is
            scored against a fixed four-dimension framework, is reviewed by a
            labeled human reviewer persona who records a decision and
            rationale, and — if that decision clears a publish-eligibility
            bar enforced in code — produces a versioned Knowledge Entry. A
            feedback item against that entry can trigger a real version
            increment, closing the loop from one-time evaluation to
            maintained guidance.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/80">
            Everything is real application code and real UI; nothing is a
            wireframe. What&apos;s synthetic is the data underneath it — see{" "}
            <Link
              href="#scope-and-data"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              Scope &amp; Data
            </Link>{" "}
            below.
          </p>
        </div>

        {/* Operating Model */}
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Operating Model
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/80">
            Every case moves through the same 8-step model — Intake, AI Test
            Run, Structured Evaluation, Human Review, Decision, Knowledge
            Published, Feedback Received, Version Updated — with later steps
            conditional on earlier outcomes (a{" "}
            <span className="font-medium text-foreground/80">
              Not Recommended
            </span>{" "}
            decision stops at Decision and never reaches Knowledge Published).
            Full definitions live on{" "}
            <Link
              href="/workflow"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              /workflow
            </Link>
            . The model is deliberately linear and legible rather than
            configurable — the point of this prototype is to demonstrate the
            operating pattern clearly, not to build a general-purpose
            workflow engine.
          </p>
        </div>

        {/* Four evaluation patterns */}
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Four Evaluation Patterns
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/80">
            Each case is built around one deliberate, named failure mode —
            not a generic &ldquo;AI can be wrong,&rdquo; but a specific defect
            an evaluator would actually need to catch:
          </p>
          <ul className="mt-5 max-w-3xl space-y-4 text-sm leading-7 text-foreground/80">
            <li>
              <span className="font-medium text-foreground">
                Case 1 — Summarization (Microsoft Copilot, simulated):
              </span>{" "}
              an omitted qualification. The summary states a liability cap
              without surfacing its carve-outs — accurate as far as it goes,
              incomplete in a way that changes the actual risk picture.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Case 2 — Structured Extraction (Claude, simulated):
              </span>{" "}
              a conditional term flattened into an unconditional field. A
              renewal clause governed by two conditions is extracted as a
              single flat value, silently dropping the second condition.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Case 3 — Draft Assistance (ChatGPT, simulated):
              </span>{" "}
              confident language exceeding source support. A genuine figure
              from the source is applied to the wrong subject, with fluent
              phrasing giving it the same apparent authority as a verified
              fact.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Case 4 — Knowledge Retrieval (Enterprise AI Retrieval,
                simulated):
              </span>{" "}
              the contrast case. A well-grounded retrieval surfaces an
              already-reviewed knowledge entry with its full metadata intact
              — showing the target state the other three cases are measured
              against, not a new defect.
            </li>
          </ul>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-foreground/70">
            Every case is scored on the same four dimensions — accuracy,
            completeness, source grounding, workflow fit — each with a
            written rationale, plus a named failure mode, a severity framed
            as impact-if-unreviewed, and an explicit review boundary: what a
            human must still verify even when the output looks correct. See
            any case at{" "}
            <Link
              href="/evaluations"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              /evaluations
            </Link>
            .
          </p>
        </div>

        {/* Human review -> knowledge -> feedback/version loop */}
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Human Review → Knowledge → Feedback/Version Loop
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/80">
            <span className="font-medium text-foreground">
              Human Review
            </span>{" "}
            is a separate entity from the evaluation, not a field bolted onto
            it — deliberately, so the data model itself enforces &ldquo;the
            AI does not decide.&rdquo; A labeled reviewer persona records one
            of a fixed set of decisions (Approved, Approved with Controls,
            Pilot Only, Not Recommended) with required rationale, scoped to
            that case&apos;s specific test configuration — never a general
            verdict on the underlying tool.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/80">
            Only an{" "}
            <span className="font-medium text-foreground">Approved</span> or{" "}
            <span className="font-medium text-foreground">
              Approved with Controls
            </span>{" "}
            decision can produce a{" "}
            <span className="font-medium text-foreground">
              Knowledge Entry
            </span>{" "}
            — a versioned, owned guidance record with approved use, known
            limitations, required review, and prompt guidance. That gate is
            enforced in code (a `canPublish` check), not just documented, so
            Case 2&apos;s pilot-scoped outcome and Case 3&apos;s
            non-recommendation cannot silently produce guidance. Both are
            still shown at{" "}
            <Link
              href="/knowledge"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              /knowledge
            </Link>{" "}
            as reviewed-but-not-published, rather than omitted.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/80">
            Knowledge isn&apos;t published once and left alone. A{" "}
            <span className="font-medium text-foreground">
              Feedback Item
            </span>{" "}
            submitted against a published entry starts{" "}
            <span className="font-medium text-foreground">Open</span>, and a
            human disposition — never automatic — resolves it to{" "}
            <span className="font-medium text-foreground">
              Accepted → New Version
            </span>{" "}
            (a version increment with a stated change summary, as
            demonstrated by the pre-authored feedback items — new items
            submitted through the form on /feedback are session-only and
            are not persisted, so they do not produce one) or{" "}
            <span className="font-medium text-foreground">Rejected</span>{" "}
            (kept visible with a stated rationale, so the loop doesn&apos;t
            read as a rubber stamp where everything gets accepted). The demo
            entry at{" "}
            <Link
              href="/knowledge"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              /knowledge
            </Link>{" "}
            carries a real v1 → v1.1 history produced this way. See{" "}
            <Link
              href="/feedback"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              /feedback
            </Link>{" "}
            for the live loop, including an interactive submission form
            (session-only — it does not persist).
          </p>
        </div>

        {/* Design Principles */}
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Design Principles
          </h2>
          <ul className="mt-5 max-w-3xl space-y-4 text-sm leading-7 text-foreground/80">
            <li>
              <span className="font-medium text-foreground">
                The AI&apos;s output is never the final word.
              </span>{" "}
              Every page that shows a simulated AI output separates it
              visually and structurally from the structured evaluation and
              human review around it — different panel, different treatment,
              an explicit actor tag.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Only a labeled human decides.
              </span>{" "}
              Reviewer identity, decision, and rationale are a distinct data
              entity, not a status flag — enforced in the schema, not just
              asserted in copy.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Decisions are scoped, not vendor verdicts.
              </span>{" "}
              A Not Recommended outcome on Case 3 means &ldquo;draft
              assistance, as tested here, is not recommended for this
              workflow&rdquo; — never &ldquo;this tool is bad.&rdquo; This is
              stated explicitly everywhere a decision renders.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Traceability is a hard constraint, not a nice-to-have.
              </span>{" "}
              Every Knowledge Entry resolves to the evaluation and review
              that produced it; the publish-eligibility gate is enforced in
              code so a knowledge entry without a valid source review is not
              a state the app can render.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Restraint over scope.
              </span>{" "}
              No fabricated metrics, no dashboards, no integrations that
              don&apos;t exist. Where the pattern would extend into a real
              enterprise stack, that&apos;s named as a concept, not built as
              a prop.
            </li>
          </ul>
        </div>

        {/* Scope & Data */}
        <div id="scope-and-data" className="scroll-mt-20">
          <h2 className="text-xl font-semibold tracking-tight">
            Scope &amp; Data
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/80">
            This is an independent, synthetic-data portfolio prototype. It
            is not affiliated with, and does not claim to be deployed at, any
            law firm or organization.
          </p>
          <ul className="mt-4 max-w-3xl space-y-2 text-sm leading-7 text-foreground/70">
            <li>
              All people, companies, matters, and agreements are synthetic —
              no real client, matter, or firm data of any kind.
            </li>
            <li>
              All AI outputs are pre-written fixtures. Nothing on this site
              calls a real AI API — tool names (Copilot, Claude, ChatGPT) are
              labels for a simulated evaluation subject, always marked
              &ldquo;(simulated).&rdquo;
            </li>
            <li>
              Nothing here is legal advice, real or simulated as
              authoritative — the cases demonstrate AI evaluation, not legal
              conclusions to rely on.
            </li>
            <li>
              &ldquo;Reviewer&rdquo; is a labeled synthetic persona in mock
              data, not a login system — there is no authentication or real
              multi-user accounts.
            </li>
            <li>
              Enterprise integration points this pattern would extend into —
              SharePoint/M365 as a document source, Power Automate or a
              similar trigger layer, an enterprise retrieval platform like
              the one Case 4 simulates — are named here as concepts this
              approach would extend into, not as connected systems.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
