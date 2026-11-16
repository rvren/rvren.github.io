import { Download } from "lucide-react";
import { useLocation } from "react-router-dom";
import { profile } from "@/data/resume";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { label: "Products", href: "#products" },
  { label: "Experience", href: "#experience" },
  { label: "GitHub", href: profile.github, external: true },
];

export function Nav() {
  const { pathname } = useLocation();
  const onHome = pathname === "/";

  // The product page is standalone: no name, no links back — just the theme toggle.
  if (!onHome) {
    return (
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="container flex items-center justify-end py-6">
          <ThemeToggle />
        </div>
      </header>
    );
  }

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <a
          href="#top"
          className="font-display text-[0.95rem] font-semibold tracking-tight text-foreground"
        >
          rrv<span className="text-muted-foreground">.</span>
        </a>
        <nav className="flex items-center gap-1.5 text-[0.8rem] font-medium">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noreferrer" : undefined}
              className="hidden rounded-full bg-secondary px-3.5 py-2 text-secondary-foreground/80 transition-colors hover:bg-foreground hover:text-background sm:inline-block"
            >
              {l.label}
            </a>
          ))}
          <a
            href={profile.resumeUrl}
            download={profile.resumeFileName}
            data-testid="nav-resume-download"
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-2 text-background transition-opacity hover:opacity-85"
          >
            <Download className="h-3.5 w-3.5" />
            Résumé
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
