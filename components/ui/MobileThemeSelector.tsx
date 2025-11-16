"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function MobileThemeSelector() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);

    const stored = window.localStorage.getItem("theme");
    const initial: "light" | "dark" = stored === "dark" ? "dark" : "light";

    setTheme(initial);

    if (initial === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next: "light" | "dark" = theme === "light" ? "dark" : "light";
    setTheme(next);

    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    window.localStorage.setItem("theme", next);
  };

  if (!mounted) {
    return (
      <div className="flex flex-col items-center gap-1 text-[--color-label] p-2 w-16" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex flex-col items-center justify-center text-[--color-label] hover:text-[--color-title] border-none w-16 h-full"
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}