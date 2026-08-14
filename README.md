# AI Evaluation & Knowledge Workflow

A prototype demonstrating how AI outputs can be structurally evaluated, human-reviewed, and turned into versioned, traceable organizational knowledge — rather than trusted at face value.

**Live app:** https://ai-evaluation-knowledge-workflow.vercel.app

## The 8-Step Workflow

1. **Intake** — a use case is submitted with business context and a target AI tool.
2. **AI Test Run** — the tool is exercised against the use case; a simulated output is recorded.
3. **Structured Evaluation** — the output is scored against a four-dimension framework, with failure mode and review boundary recorded.
4. **Human Review** — a labeled human reviewer examines the evaluation.
5. **Decision** — the reviewer records a decision with rationale.
6. **Knowledge Published** — if publish-eligible, a knowledge entry is created from the decision.
7. **Feedback Received** — real-world usage notes are submitted against the published entry.
8. **Version Updated** — accepted feedback produces a new version, closing the loop.

Later steps are conditional on earlier outcomes — e.g. a "Not Recommended" decision stops at step 5.

## Evaluation Patterns & Human Review Decisions

Each case is scored on four fixed dimensions — **Accuracy**, **Completeness**, **Source Grounding**, and **Workflow Fit** — each demonstrating a distinct way an AI output can look correct while still being wrong.

Human reviewers resolve each evaluation to one of four decisions, scoped to that specific case and configuration (never a general verdict on the underlying tool):

- **Approved**
- **Approved with Controls**
- **Pilot Only**
- **Not Recommended**

## What This Prototype Demonstrates

- Structured, repeatable AI evaluation rather than ad hoc judgment.
- A human review step that is visible, accountable, and structurally separate from the AI's output — never a rubber stamp.
- Decisions that determine what does and does not become reusable knowledge.
- Controlled publication: only reviewed, approved outcomes become knowledge base entries.
- A feedback and versioning loop showing that published knowledge is maintained, not published once and forgotten.

## Tech Stack

- [Next.js](https://nextjs.org)
- TypeScript
- [Vercel](https://vercel.com) (deployment)

## Scope & Disclosure

This is an **independent portfolio project**, not a claim of deployed governance tooling or affiliation with any organization. All data is synthetic, all AI outputs are simulated fixtures (no live AI API calls), and no real client, matter, or firm data is used anywhere. Nothing in this app constitutes legal advice.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.
