"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function FloatingThemeSelector() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem("theme");
    if (stored === "light") {
      document.documentElement.classList.add("light");
      setTheme("light");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);

    if (next === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }

    window.localStorage.setItem("theme", next);
  };

  if (!mounted) return null;

  return (
    <div className="relative flex">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-[--color-card] border border-[--color-border] shadow-2xl hover:bg-[--color-border] transition-colors"
        title="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun size={20} className="text-[--color-title]" />
        ) : (
          <Moon size={20} className="text-[--color-title]" />
        )}
      </button>
    </div>
  );
}
