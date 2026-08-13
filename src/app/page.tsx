import Link from "next/link";
import { WorkflowStrip } from "@/components/workflow-strip";

export default function Home() {
  return (
    <main className="flex-1">
      <section className="content-container pt-20 pb-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Portfolio prototype — synthetic data only
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          AI evaluation → human-reviewed knowledge, with a visible trail.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/80">
          This prototype demonstrates a repeatable way to evaluate AI tools
          against representative use cases, keep human review as a distinct
          and accountable step, and turn only what a reviewer actually
          approves into versioned, traceable organizational knowledge —
          without treating the AI&apos;s output as the final word.
        </p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Link
            href="/workflow"
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:opacity-90"
          >
            See the workflow
          </Link>
          <Link
            href="/evaluations"
            className="rounded-full border border-border-subtle px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
          >
            Browse evaluation cases
          </Link>
        </div>
      </section>

      <section className="border-t border-border-subtle bg-surface">
        <div className="workspace-container py-14">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
            The 8-step workflow, at a glance
          </h2>
          <div className="mt-6">
            <WorkflowStrip variant="compact" />
          </div>
          <p className="mt-6 text-sm text-muted">
            Full definitions and vocabulary are on{" "}
            <Link href="/workflow" className="underline underline-offset-2">
              /workflow
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
