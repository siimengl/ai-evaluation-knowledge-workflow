import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Knowledge",
  description: "Index of reviewed, versioned knowledge base entries.",
};

export default function KnowledgePage() {
  return (
    <main className="flex-1">
      <section className="content-container py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Knowledge</h1>
        <p className="mt-5 text-lg leading-8 text-foreground/80">
          Coming in Phase 5. This page will list knowledge entries produced
          from approved evaluation reviews, each with status, owner, and
          version.
        </p>
      </section>
    </main>
  );
}
