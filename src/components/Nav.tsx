import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  const { pathname, key } = useLocation();
  const onHome = pathname === "/";
  // Only offer a way "back" when the visitor reached this page via in-app
  // navigation. A fresh/direct/standalone load has key === "default".
  const cameFromSite = key !== "default";

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-6">
        {onHome ? (
          <span className="text-sm font-medium tracking-tight text-muted-foreground">
            RRV
          </span>
        ) : cameFromSite ? (
          <Link
            to="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Renjith
          </Link>
        ) : (
          <span aria-hidden />
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
