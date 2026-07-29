import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const sections = [
  { href: "#work", label: "Work" },
  { href: "#apps", label: "Apps" },
  { href: "#about", label: "About" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-lg"
          : "border-b border-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link
          to="/"
          className="group flex items-center gap-2 font-medium tracking-tight"
        >
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-[13px] font-semibold text-primary-foreground">
            R
          </span>
          <span className="hidden sm:inline">Renjith Rajendran</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {onHome &&
            sections.map((s) => (
              <a
                key={s.href}
                href={s.href}
                className="hidden rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
              >
                {s.label}
              </a>
            ))}
          {!onHome && (
            <Link
              to="/"
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Home
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
