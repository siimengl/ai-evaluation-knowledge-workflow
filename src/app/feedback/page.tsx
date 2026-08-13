import type { Metadata } from "next";
import { FEEDBACK_ITEMS } from "@/data/feedback-items";
import { KNOWLEDGE_ENTRIES } from "@/data/knowledge-entries";
import { FeedbackBoard } from "@/components/feedback-board";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Real-world usage feedback submitted against published knowledge entries, and the human disposition that resolves it — open, accepted into a new version, or rejected with rationale.",
};

/**
 * Feedback & Version Loop (PROJECT_SPEC.md §10, IMPLEMENTATION_PLAN.md
 * Phase 6).
 *
 * Introduced in the app for the first time in this phase — see
 * `site-nav.tsx` for the corresponding nav addition. Every item here
 * attaches to a specific KnowledgeEntry (and, implicitly, the version that
 * was current when it was submitted). Dispositions are pre-authored,
 * human-labeled mock states; the only interactive part of this page is
 * submitting a new (always-Open) item to local component state, which is
 * disclosed as non-persisted.
 */
export default function FeedbackPage() {
  return (
    <main className="flex-1">
      <section className="workspace-container py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Feedback</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-foreground/80">
          Published guidance is not written once and left alone. A real-world
          usage note against a specific knowledge entry and version starts as{" "}
          <span className="font-medium text-foreground">Open</span>, and a
          human — never the AI, never this form — resolves it to either{" "}
          <span className="font-medium text-foreground">
            Accepted → New Version
          </span>{" "}
          (a version increment with a stated change summary, as demonstrated
          below by the pre-authored feedback items — new items submitted
          through this page&apos;s form are session-only and are not
          persisted, so they do not produce one) or{" "}
          <span className="font-medium text-foreground">Rejected</span> (kept
          visible, with a stated rationale — not all feedback changes
          guidance, and a system where everything is accepted isn&apos;t
          demonstrating judgment).
        </p>

        <FeedbackBoard
          initialItems={FEEDBACK_ITEMS}
          knowledgeEntries={KNOWLEDGE_ENTRIES}
        />
      </section>
    </main>
  );
}
