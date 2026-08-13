import type { Metadata } from "next";
import { WorkflowStrip } from "@/components/workflow-strip";

export const metadata: Metadata = {
  title: "Workflow",
  description:
    "The 8-step workflow model: how an AI use case becomes reviewed, versioned organizational knowledge.",
};

const VOCABULARY = [
  {
    term: "Evaluation",
    definition:
      "A single, structured test of one AI tool against one use case — simulated AI output plus scoring against a fixed four-dimension framework (accuracy, completeness, source grounding, workflow fit).",
  },
  {
    term: "Reviewer",
    definition:
      "A labeled human persona who examines an evaluation and renders a decision. Reviewers are never AI — this is enforced in the data model, not just described in copy.",
  },
  {
    term: "Decision",
    definition:
      "One of a fixed set of outcomes (Approved, Approved with Controls, Pilot Only, Not Recommended) recorded with required rationale. A decision is scoped to the specific case and test configuration it was made against, never a general verdict on the underlying vendor or tool.",
  },
  {
    term: "Knowledge Entry",
    definition:
      "Reusable, versioned guidance produced only from an eligible decision (Approved or Approved with Controls). Every entry traces back to the evaluation and decision that produced it.",
  },
  {
    term: "Evidence & Decision Trail",
    definition:
      "A read-only, chronological, attributed reconstruction of one case's lifecycle, spanning all 8 steps — evidence of process, not a claim of legal or compliance-grade, tamper-proof record-keeping.",
  },
] as const;

export default function WorkflowPage() {
  return (
    <main className="flex-1">
      <section className="content-container pt-14 pb-8">
        <h1 className="text-4xl font-semibold tracking-tight">
          The 8-step workflow
        </h1>
        <p className="mt-5 text-lg leading-8 text-foreground/80">
          Every evaluation case in this prototype moves through the same
          8-step model. Later steps depend on the outcome of earlier ones —
          a case that is not recommended stops at Decision and never reaches
          Knowledge Published. Running alongside all 8 steps, not as an
          additional step, is the Evidence &amp; Decision Trail: the
          chronological record of what happened at each one.
        </p>
      </section>

      <section className="workspace-container pb-16">
        <WorkflowStrip variant="full" />
      </section>

      <section className="border-t border-border-subtle bg-surface">
        <div className="content-container py-14">
          <h2 className="text-xl font-semibold tracking-tight">
            Vocabulary
          </h2>
          <p className="mt-2 text-sm text-foreground/70">
            These terms are used consistently throughout the app.
          </p>
          <dl className="mt-6 space-y-5">
            {VOCABULARY.map((item) => (
              <div key={item.term}>
                <dt className="text-sm font-semibold">{item.term}</dt>
                <dd className="mt-1 text-sm leading-6 text-foreground/80">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}
