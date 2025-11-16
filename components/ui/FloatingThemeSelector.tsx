"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function FloatingThemeSelector() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem("theme");

    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);

    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
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
        {theme === "light" ? (
          <Moon size={20} className="text-[--color-title]" />
        ) : (
          <Sun size={20} className="text-[--color-title]" />
        )}
      </button>
    </div>
  );
}
