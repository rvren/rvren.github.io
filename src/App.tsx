import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Nav } from "./components/Nav";
import Home from "./pages/Home";
import Sightglass from "./pages/Sightglass";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sightglass" element={<Sightglass />} />
        {/* The product page shipped as /cadence and was shared at that URL, so
            the old path has to keep resolving after the rename. */}
        <Route path="/cadence" element={<Navigate to="/sightglass" replace />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}
