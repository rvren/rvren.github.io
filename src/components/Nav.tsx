import { useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  const { pathname } = useLocation();
  const onHome = pathname === "/";

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      {/* Match each page's content width so the toggle aligns with the content's
          right edge: home is a narrow column, the product page uses the wider container. */}
      <div
        className={
          onHome
            ? "mx-auto flex max-w-2xl items-center justify-between px-6 py-6"
            : "container flex items-center justify-between py-6"
        }
      >
        {onHome ? (
          <span className="text-sm font-medium tracking-tight text-muted-foreground">
            RRV
          </span>
        ) : (
          <span aria-hidden />
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
