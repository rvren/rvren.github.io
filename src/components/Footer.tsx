import { ArrowUpRight, Mail } from "lucide-react";
import { profile } from "@/data/resume";

export function Footer() {
  const year = 2026;
  const links = [
    { label: "Email", href: `mailto:${profile.email}`, icon: true },
    { label: "LinkedIn", href: profile.linkedin, icon: false },
    { label: "GitHub", href: profile.github, icon: false },
    { label: "Résumé (PDF)", href: profile.resumeUrl, icon: false },
  ];
  return (
    <footer id="contact" className="border-t border-border">
      <div className="container py-16 sm:py-20">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Get in touch
            </p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Let’s build something considered.
            </h2>
            <a
              href={`mailto:${profile.email}`}
              className="mt-6 inline-flex items-center gap-2 text-lg text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              {profile.email}
            </a>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {profile.name}
          </span>
          <span className="font-mono">{profile.location} · Built with React + Vite</span>
        </div>
      </div>
    </footer>
  );
}
