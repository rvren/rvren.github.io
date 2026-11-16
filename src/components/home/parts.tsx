import type { CSSProperties, ReactNode } from "react";
import { ArrowUpRight, Download, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { Product, ProductLink } from "@/data/projects";
import {
  awards,
  earlier,
  education,
  experience,
  languages,
  profile,
  skills,
} from "@/data/resume";

export const contact = [
  { label: "Email", href: `mailto:${profile.email}` },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "GitHub", href: profile.github },
];

export const pillPrimary =
  "inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-85";
export function brandStyle(p: Product) {
  return { "--brand": p.brand } as CSSProperties;
}

export function ResumeDownload({
  testId,
  className = pillPrimary,
  children = "Download résumé",
}: {
  testId: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <a
      href={profile.resumeUrl}
      download={profile.resumeFileName}
      data-testid={testId}
      className={className}
    >
      <Download className="h-4 w-4" />
      {children}
    </a>
  );
}

export function ContactLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-5 gap-y-2 text-sm", className)}>
      {contact.map((c) => (
        <li key={c.label}>
          <a
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
          >
            {c.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Tags({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((t) => (
        <li
          key={t}
          className="rounded-full bg-secondary px-2.5 py-0.5 text-[0.7rem] text-secondary-foreground/80"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

export function ProductActions({ product }: { product: Product }) {
  return (
    <div className="flex flex-wrap gap-2">
      {product.links.map((l) => (
        <ProductAction key={l.label} link={l} product={product.name} />
      ))}
    </div>
  );
}

function ProductAction({
  link,
  product,
}: {
  link: ProductLink;
  product: string;
}) {
  const cls =
    "relative z-10 inline-flex items-center gap-1 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background";
  const testId = `product-${product.toLowerCase()}-${link.label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`;
  const body = (
    <>
      {link.label}
      <ArrowUpRight className="h-3.5 w-3.5" />
    </>
  );
  if (link.internal) {
    return (
      <Link to={link.href} className={cls} data-testid={testId}>
        {body}
      </Link>
    );
  }
  const external = link.href.startsWith("http");
  return (
    <a
      href={link.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cls}
      data-testid={testId}
    >
      {body}
    </a>
  );
}

export function Kicker({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[0.68rem] lowercase tracking-[0.08em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHead({
  index,
  label,
  note,
  className,
}: {
  index: string;
  label: string;
  note?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-7 flex items-baseline gap-3", className)}>
      <span className="font-mono text-xs text-muted-foreground/70">
        {index}
      </span>
      <h2 className="font-display text-[1.35rem] font-medium tracking-tight">
        {label}
      </h2>
      <span className="h-px flex-1 translate-y-[-4px] bg-border" />
      {note && (
        <span className="font-mono text-[0.68rem] text-muted-foreground">
          {note}
        </span>
      )}
    </div>
  );
}

export function ExperienceList() {
  return (
    <ol className="relative space-y-10 border-l border-border pl-6">
      {experience.map((role) => (
        <li key={`${role.company}-${role.period}`} className="relative">
          <span className="absolute -left-[1.72rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-muted-foreground" />
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <h3 className="font-display text-base font-medium">
              {role.title}
              <span className="text-muted-foreground"> · {role.company}</span>
            </h3>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {role.period}
            </span>
          </div>
          <ul className="mt-3 space-y-1.5">
            {role.bullets.map((b) => (
              <li
                key={b}
                className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
              >
                <span className="select-none text-border">—</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
      <li className="relative">
        <span className="absolute -left-[1.72rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-border" />
        <p className="font-display text-base font-medium">Earlier</p>
        <ul className="mt-3 space-y-2">
          {earlier.map((e) => (
            <li
              key={e.company}
              className="grid gap-0.5 text-sm sm:grid-cols-[1fr_auto] sm:gap-4"
            >
              <span className="text-muted-foreground">
                <span className="text-foreground/90">
                  {e.title}, {e.company}
                </span>{" "}
                — {e.note}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {e.period}
              </span>
            </li>
          ))}
        </ul>
      </li>
    </ol>
  );
}

export function StackList() {
  return (
    <dl className="text-sm">
      {skills.map((s) => (
        <div
          key={s.group}
          className={cn(
            "grid grid-cols-1 gap-2 border-t border-border py-3.5",
            "sm:grid-cols-[9.5rem_1fr] sm:gap-4",
          )}
        >
          <dt className="pt-0.5 text-muted-foreground">{s.group}</dt>
          <dd className="flex flex-wrap gap-1.5">
            {s.items.map((it) => (
              <span
                key={it}
                className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground/85"
              >
                {it}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function DetailsGrid() {
  return (
    <div className="grid gap-6 text-sm sm:grid-cols-3">
      <div>
        <p className="mb-1.5 text-muted-foreground">Education</p>
        <p className="text-foreground/90">{education.degree}</p>
        <p className="text-muted-foreground">
          {education.school} · {education.period}
        </p>
      </div>
      <div>
        <p className="mb-1.5 text-muted-foreground">Recognition</p>
        <ul className="space-y-1 text-foreground/90">
          {awards.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="mb-1.5 text-muted-foreground">Languages</p>
        <p className="text-foreground/90">{languages.join(" · ")}</p>
      </div>
    </div>
  );
}

export function ResumeCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 rounded-[22px] border border-border bg-card/90 p-6 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-7",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground">
          <FileText className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-lg font-medium tracking-tight">
            The full résumé
          </p>
          <p className="text-sm text-muted-foreground">PDF · 2 pages</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <ResumeDownload
          testId="resume-card-download"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85"
        >
          Download
        </ResumeDownload>
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noreferrer"
          data-testid="resume-card-view"
          className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          View
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "mt-16 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <span>© 2026 {profile.name}</span>
      <span className="flex gap-4">
        {contact.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            {c.label}
          </a>
        ))}
      </span>
    </footer>
  );
}
