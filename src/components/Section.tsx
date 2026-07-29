import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function Section({
  id,
  index,
  title,
  children,
  className,
}: {
  id?: string;
  index?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-16 sm:py-24", className)}>
      {title && (
        <Reveal>
          <div className="mb-10 flex items-baseline gap-3">
            {index && (
              <span className="font-mono text-xs text-accent">{index}</span>
            )}
            <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {title}
            </h2>
            <span className="h-px flex-1 translate-y-[-2px] bg-border" />
          </div>
        </Reveal>
      )}
      {children}
    </section>
  );
}
