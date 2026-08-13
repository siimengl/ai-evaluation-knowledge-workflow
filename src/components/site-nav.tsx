"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Global primary navigation (PROJECT_SPEC.md §3).
 *
 * `/feedback` is added here for the first time in Phase 6 (§10) — it did
 * not exist in nav or routing in Phases 1–5. `/evidence/[id]` is never a
 * standalone nav item (§3) since it has no independent index.
 */
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/workflow", label: "Workflow" },
  { href: "/evaluations", label: "Evaluations" },
  { href: "/knowledge", label: "Knowledge" },
  { href: "/feedback", label: "Feedback" },
  { href: "/case-study", label: "Case Study" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border-subtle bg-background">
      <div className="workspace-container flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          AI Evaluation &amp; Knowledge Workflow
        </Link>
        <nav aria-label="Primary">
          <ul className="flex flex-wrap gap-x-1 gap-y-2 text-sm">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      active
                        ? "rounded-md px-3 py-1.5 font-medium text-foreground bg-surface"
                        : "rounded-md px-3 py-1.5 text-foreground/70 transition-colors hover:text-foreground hover:bg-surface"
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
