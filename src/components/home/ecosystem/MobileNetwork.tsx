"use client";

import { useId, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useVisible } from "@/hooks/useVisible";
import { ECOSYSTEM_GROUPS, ellipsePoint, groupAngle } from "./data";
import GroupDetailCard from "./GroupDetailCard";

const VB_W = 400;
const VB_H = 220;
const HUB = { cx: 200, cy: 110, r: 24 };
const RING_RX = 148;
const RING_RY = 80;

interface MobileNetworkProps {
  inView: boolean;
  activeId: string | null;
  onActiveChange: (id: string | null) => void;
}

export default function MobileNetwork({ inView, activeId, onActiveChange }: MobileNetworkProps) {
  const reduceMotion = useReducedMotion();
  const { ref, visible } = useVisible<HTMLDivElement>();
  const [defaultIndex] = useState(0);
  const gradId = useId();
  const playState = visible ? "running" : "paused";

  // At rest (no explicit tap yet) the first category is shown so the graphic and
  // detail card are never empty — matches the desktop "always one active" rule.
  const displayedId = activeId ?? ECOSYSTEM_GROUPS[defaultIndex].id;
  const positions = ECOSYSTEM_GROUPS.map((g, i) => ellipsePoint(HUB, RING_RX, RING_RY, groupAngle(i, ECOSYSTEM_GROUPS.length)));
  const activeIndex = ECOSYSTEM_GROUPS.findIndex(g => g.id === displayedId);
  const activeGroup = ECOSYSTEM_GROUPS[activeIndex];

  return (
    <div ref={ref} style={{ width: "100%" }}>
      {/* Compact hub graphic — decorative and label-free; the readable controls are the grid below */}
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} aria-hidden="true" style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E9B23C" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#E9B23C" stopOpacity="0" />
          </radialGradient>
        </defs>

        {ECOSYSTEM_GROUPS.map((g, i) => {
          const pos = positions[i];
          const isActive = displayedId === g.id;
          const d = `M${HUB.cx},${HUB.cy} L${pos.cx},${pos.cy}`;
          return (
            <path
              key={`spoke-${g.id}`}
              d={d}
              fill="none"
              stroke={g.color}
              strokeWidth={isActive ? 2 : 1}
              strokeLinecap="round"
              strokeDasharray="2 10"
              opacity={isActive ? 0.95 : 0.22}
              className="kv-map-flow"
              style={{ animationDelay: `${i * -0.6}s`, animationPlayState: reduceMotion ? "paused" : playState, transition: "stroke-width .25s ease, opacity .25s ease" }}
            />
          );
        })}

        <circle cx={HUB.cx} cy={HUB.cy} r={HUB.r + 14} fill={`url(#${gradId})`} className="kv-hub-breathe" style={{ transformBox: "fill-box", transformOrigin: "center", animationPlayState: reduceMotion ? "paused" : playState }} />
        <circle cx={HUB.cx} cy={HUB.cy} r={HUB.r} fill="rgba(6,13,8,.8)" stroke="#E9B23C" strokeWidth="1.5" />
        <polygon points={`${HUB.cx},${HUB.cy - 9} ${HUB.cx + 9},${HUB.cy} ${HUB.cx},${HUB.cy + 9} ${HUB.cx - 9},${HUB.cy}`} fill="#E9B23C" />

        {ECOSYSTEM_GROUPS.map((g, i) => {
          const pos = positions[i];
          const isActive = displayedId === g.id;
          return (
            <circle
              key={`node-${g.id}`}
              cx={pos.cx} cy={pos.cy} r={isActive ? 11 : 7}
              fill={g.color} opacity={isActive ? 0.95 : 0.4}
              style={{
                transition: "r .25s ease, opacity .25s ease",
                transform: inView ? "scale(1)" : "scale(.5)",
                transformBox: "fill-box", transformOrigin: "center",
                transitionProperty: "r, opacity, transform",
                transitionDelay: inView ? `${i * 0.06}s` : "0s",
              }}
            />
          );
        })}
      </svg>

      {/* Category grid — the actual accessible controls, full labels, no truncation */}
      <div className="grid grid-cols-2 gap-2.5 mt-5">
        {ECOSYSTEM_GROUPS.map(g => {
          const isActive = displayedId === g.id;
          return (
            <button
              key={g.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onActiveChange(activeId === g.id ? null : g.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                minHeight: 52, width: "100%", textAlign: "left",
                background: isActive ? `${g.color}22` : "rgba(255,255,255,.05)",
                border: `1px solid ${g.color}${isActive ? "aa" : "3a"}`,
                borderRadius: 14, padding: "10px 14px",
                transition: "background .2s ease, border-color .2s ease",
              }}
            >
              <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: g.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, color: isActive ? g.color : "rgba(244,237,223,.75)" }}>{g.label}</span>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 16 }} aria-live="polite">
        <GroupDetailCard group={activeGroup} size="sm" />
      </div>
    </div>
  );
}
