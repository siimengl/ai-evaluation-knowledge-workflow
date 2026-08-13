import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Study",
  description:
    "The thinking behind this prototype: problem framing, design decisions, and what is real vs. simulated.",
};

export default function CaseStudyPage() {
  return (
    <main className="flex-1">
      <section className="content-container pt-14 pb-8">
        <h1 className="text-4xl font-semibold tracking-tight">Case Study</h1>
        <p className="mt-5 text-lg leading-8 text-foreground/80">
          This page explains the thinking behind the system for readers who
          want the &ldquo;why,&rdquo; not just the &ldquo;what.&rdquo; It is a
          skeleton as of this build phase — sections fill in as the
          corresponding parts of the app are built, and each section&apos;s
          content stays accurate to what actually exists at the time it is
          read.
        </p>
      </section>

      <section className="content-container space-y-10 pb-16">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Problem</h2>
          <p className="mt-2 text-sm leading-6 text-foreground/60">
            To be written as later phases give this section something
            concrete to describe.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight">Approach</h2>
          <p className="mt-2 text-sm leading-6 text-foreground/60">
            To be written as later phases give this section something
            concrete to describe.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            What&apos;s Simulated vs. Real
          </h2>
          <p className="mt-2 text-sm leading-6 text-foreground/80">
            As of this build phase, the app shell, navigation, home page,
            workflow explanation, and this case-study skeleton exist. There
            is no case data yet — no evaluations, human reviews, knowledge
            entries, feedback, or evidence trails have been authored. Nothing
            on this site currently calls a real AI API, a real Airtable
            base, or a real n8n workflow; those remain out of scope until
            explicitly reached later in the build.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Enterprise Extension
          </h2>
          <p className="mt-2 text-sm leading-6 text-foreground/60">
            To be written once later phases have concrete decisions to
            connect to an enterprise-integration narrative (SharePoint/M365,
            Power Automate, Airtable, n8n). None of these integrations are
            implemented; this section will describe how the pattern
            demonstrated here would extend into one, not claim it already
            does.
          </p>
        </div>
      </section>
    </main>
  );
}
