/**
 * Global footer disclosure (PROJECT_SPEC.md §15): every page must make
 * clear this is synthetic data / a portfolio prototype, not a deployed
 * governance tool.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border-subtle bg-surface">
      <div className="workspace-container py-6 text-xs text-muted">
        <p>
          Synthetic data, portfolio prototype. No real client, matter, or
          firm data. Not legal advice. See{" "}
          <a href="/case-study" className="underline underline-offset-2">
            /case-study
          </a>{" "}
          for what is real vs. simulated.
        </p>
      </div>
    </footer>
  );
}
