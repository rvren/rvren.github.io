import { useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  const { pathname } = useLocation();

  // Home carries its own identity + controls inside the living rail, so the
  // shared top bar only renders on the product page.
  if (pathname === "/") return null;

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="container flex items-center justify-end py-6">
        <ThemeToggle />
      </div>
    </header>
  );
}
