"use client";

import { Sun, Moon } from "lucide-react";
import { useNbTheme } from "@/hooks/useNbTheme";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useNbTheme();
  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      title={isDark ? "Modo claro" : "Modo escuro"}
      className={className}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 38, height: 38, flexShrink: 0,
        background: "transparent", border: "2px solid var(--nb-navbar-border)", borderRadius: 8,
        color: "var(--nb-heading)", cursor: "pointer", transition: "background .2s",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "var(--nb-card-divider)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      {isDark ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />}
    </button>
  );
}
