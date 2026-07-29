"use client";

import { useNbTheme } from "@/hooks/useNbTheme";
import type { EcosystemGroup } from "./data";

interface GroupDetailCardProps {
  group: EcosystemGroup;
  size?: "lg" | "sm";
}

// Agent names live here as normal HTML text instead of inside the SVG — the main
// legibility fix: no more sub-10px foreignObject chips fighting for space on a
// rotated radial layout.
export default function GroupDetailCard({ group, size = "lg" }: GroupDetailCardProps) {
  const { theme } = useNbTheme();
  const isDark = theme === "dark";
  const isLg = size === "lg";
  return (
    <div
      key={group.id}
      style={{
        background: group.bg,
        border: isDark ? `1px solid ${group.border}` : "3px solid var(--nb-ink)",
        borderRadius: isLg ? (isDark ? 20 : 16) : (isDark ? 16 : 14),
        padding: isLg ? "26px 28px" : "18px 18px",
        boxShadow: isDark ? "none" : "var(--shadow-nb-sm)",
        animation: "kv-fade-in-up .4s ease both",
      }}
    >
      <div className="flex items-center gap-2" style={{ marginBottom: isLg ? 10 : 6 }}>
        <span aria-hidden="true" style={{ width: isLg ? 10 : 8, height: isLg ? 10 : 8, borderRadius: "50%", background: group.color, border: isDark ? "none" : "1.5px solid var(--nb-ink)", flexShrink: 0 }} />
        <h3 style={{ fontSize: isLg ? 20 : 14, fontWeight: 700, color: "var(--nb-heading)", lineHeight: 1.25, fontFamily: "var(--font-fraunces), Georgia, serif" }}>{group.title}</h3>
      </div>
      <p style={{ fontSize: isLg ? 14.5 : 12.5, lineHeight: 1.6, color: "var(--nb-body)", marginBottom: isLg ? 16 : 12 }}>
        {group.desc}
      </p>
      <div className="flex flex-wrap" style={{ gap: isLg ? 8 : 6 }}>
        {group.items.map(item => (
          <span
            key={item}
            style={{
              fontSize: isLg ? 13 : 11.5,
              fontWeight: isDark ? 600 : 700,
              color: isDark ? group.color : group.textColor,
              background: isDark ? "rgba(6,13,8,.5)" : "var(--nb-cream)",
              border: isDark ? `1px solid ${group.color}55` : "1.5px solid var(--nb-ink)",
              borderRadius: 999,
              padding: isLg ? "6px 14px" : "5px 11px",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
