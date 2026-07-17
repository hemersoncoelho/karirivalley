"use client";

import { useEffect, useId, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useVisible } from "@/hooks/useVisible";
import { ECOSYSTEM_GROUPS, ellipsePoint, groupAngle, type NodePosition } from "./data";
import GroupDetailCard from "./GroupDetailCard";

const VB_W = 640;
const VB_H = 560;
const HUB = { cx: 320, cy: 280, r: 34 };
const RING_RX = 200;
const RING_RY = 190;

const AUTO_CYCLE_MS = 4500;
const LABEL_HEIGHT = 34;

function estimateLabelWidth(label: string): number {
  return Math.max(120, Math.round(label.length * 9.6 + 54));
}

function labelBox(pos: NodePosition, width: number, height: number, bias: number, edgeNudge = 6) {
  const biasedDirX = pos.dirX * bias;
  const biasedDirY = pos.dirY * bias;
  const anchorX = pos.cx + pos.dirX * edgeNudge;
  const anchorY = pos.cy + pos.dirY * edgeNudge;
  return {
    x: anchorX - (width * (1 - biasedDirX)) / 2,
    y: anchorY - (height * (1 - biasedDirY)) / 2,
    originX: pos.dirX >= 0 ? "0%" : "100%",
    originY: pos.dirY >= 0 ? "0%" : "100%",
  };
}

interface DesktopNetworkProps {
  inView: boolean;
  activeId: string | null;
  onActiveChange: (id: string | null) => void;
}

export default function DesktopNetwork({ inView, activeId, onActiveChange }: DesktopNetworkProps) {
  const reduceMotion = useReducedMotion();
  const { ref, visible } = useVisible<HTMLDivElement>();
  const [autoIndex, setAutoIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const gradId = useId();
  const glowId = useId();

  const explicitId = pinnedId ?? hoveredId ?? activeId;

  // Only genuine user interaction (hover/focus/click) is pushed back up to the
  // parent — the ambient auto-cycle stays a purely local, decorative behavior.
  useEffect(() => {
    onActiveChange(explicitId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [explicitId]);

  useEffect(() => {
    if (reduceMotion || !visible || explicitId !== null) return;
    const timer = setInterval(() => {
      setAutoIndex(i => (i + 1) % ECOSYSTEM_GROUPS.length);
    }, AUTO_CYCLE_MS);
    return () => clearInterval(timer);
  }, [reduceMotion, visible, explicitId]);

  const displayedId = explicitId ?? ECOSYSTEM_GROUPS[autoIndex].id;
  const playState = visible ? "running" : "paused";

  const positions = ECOSYSTEM_GROUPS.map((g, i) => ellipsePoint(HUB, RING_RX, RING_RY, groupAngle(i, ECOSYSTEM_GROUPS.length)));
  const activeIndex = ECOSYSTEM_GROUPS.findIndex(g => g.id === displayedId);
  const activeGroup = ECOSYSTEM_GROUPS[activeIndex];

  return (
    <div ref={ref} style={{ width: "100%", maxWidth: 600 }}>
      <p className="sr-only">
        A Kariri Valley conecta seis grandes grupos do ecossistema de inovação do Cariri: {" "}
        {ECOSYSTEM_GROUPS.map(g => `${g.title} (${g.items.join(", ")})`).join("; ")}.
        Navegue pelas categorias com Tab para revelar os agentes de cada uma.
      </p>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} style={{ width: "100%", height: "auto", overflow: "visible", display: "block" }}>
        <defs>
          <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E9B23C" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#E9B23C" stopOpacity="0" />
          </radialGradient>
          <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Decorative backdrop: slow-rotating hex ring */}
        <g aria-hidden="true" className="kv-slow-spin" style={{ transformBox: "fill-box", transformOrigin: "center", animationDuration: "110s", animationPlayState: playState }}>
          <polygon points="320,80 486,185 486,375 320,480 154,375 154,185" fill="none" stroke="rgba(232,184,75,.05)" strokeWidth="1" />
        </g>

        {/* Hub spokes — one per category; only the displayed category's is fully lit */}
        <g aria-hidden="true">
          {ECOSYSTEM_GROUPS.map((g, i) => {
            const pos = positions[i];
            const isActive = displayedId === g.id;
            const d = `M${HUB.cx},${HUB.cy} L${pos.cx},${pos.cy}`;
            return (
              <g key={`spoke-${g.id}`}>
                <path
                  pathLength={1}
                  d={d}
                  fill="none"
                  stroke={g.color}
                  strokeWidth="1.5"
                  strokeDasharray="1"
                  opacity=".5"
                  style={{ strokeDashoffset: inView ? 0 : 1, transition: `stroke-dashoffset 1s cubic-bezier(.16,1,.3,1) ${0.5 + i * 0.12}s` }}
                />
                <path
                  d={d}
                  fill="none"
                  stroke={g.color}
                  strokeWidth={isActive ? 2.5 : 1.25}
                  strokeLinecap="round"
                  strokeDasharray="2 14"
                  opacity={isActive ? 1 : 0.2}
                  className="kv-map-flow"
                  style={{ animationDelay: `${i * -0.7}s`, animationPlayState: playState, transition: "stroke-width .25s ease, opacity .25s ease" }}
                />
                {!reduceMotion && visible && isActive && (
                  <circle r="3" fill={g.color} opacity=".95">
                    <animateMotion dur="3.2s" repeatCount="indefinite" path={d} />
                  </circle>
                )}
              </g>
            );
          })}
        </g>

        {/* Hub — Kariri Valley */}
        <g aria-hidden="true">
          <circle cx={HUB.cx} cy={HUB.cy} r={HUB.r + 20} fill={`url(#${gradId})`} className="kv-hub-breathe" style={{ transformBox: "fill-box", transformOrigin: "center", animationPlayState: playState }} />
          <g filter={`url(#${glowId})`}>
            <circle cx={HUB.cx} cy={HUB.cy} r={HUB.r} fill="rgba(6,13,8,.8)" stroke="#E9B23C" strokeWidth="1.5" />
          </g>
          <polygon points={`${HUB.cx},${HUB.cy - 13} ${HUB.cx + 13},${HUB.cy} ${HUB.cx},${HUB.cy + 13} ${HUB.cx - 13},${HUB.cy}`} fill="#E9B23C" />
        </g>

        {/* Category nodes — always visible and legible; the inactive ones just dim */}
        {ECOSYSTEM_GROUPS.map((g, i) => {
          const pos = positions[i];
          const isActive = displayedId === g.id;
          const width = estimateLabelWidth(g.label);
          const box = labelBox(pos, width, LABEL_HEIGHT, 0.6);
          return (
            <g key={g.id}>
              <circle
                cx={pos.cx} cy={pos.cy} r={isActive ? 20 : 13}
                fill={g.color} opacity={isActive ? 0.55 : 0.22}
                className={reduceMotion ? undefined : "kv-map-pulse"}
                style={{ transformBox: "fill-box", transformOrigin: "center", transition: "opacity .2s ease, r .2s ease", animationPlayState: playState }}
                aria-hidden="true"
              />
              <foreignObject
                x={box.x} y={box.y} width={width} height={LABEL_HEIGHT}
                style={{
                  overflow: "visible",
                  opacity: inView ? (isActive ? 1 : 0.45) : 0,
                  transform: inView ? "scale(1)" : "scale(.6)",
                  transformOrigin: `${box.originX} ${box.originY}`,
                  transition: `opacity .3s ease, transform .45s cubic-bezier(.34,1.4,.64,1) ${0.6 + i * 0.1}s`,
                }}
              >
                <button
                  type="button"
                  aria-expanded={isActive}
                  aria-label={`${g.title}: ${g.items.join(", ")}`}
                  onMouseEnter={() => setHoveredId(g.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(g.id)}
                  onBlur={() => setHoveredId(null)}
                  onClick={() => setPinnedId(prev => (prev === g.id ? null : g.id))}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, height: "100%", width: "100%",
                    cursor: "pointer", background: isActive ? `${g.color}26` : "rgba(6,13,8,.8)",
                    border: `1.5px solid ${g.color}${isActive ? "cc" : "55"}`, borderRadius: 999,
                    padding: "0 14px", whiteSpace: "nowrap", font: "inherit",
                    transition: "background .2s ease, border-color .2s ease",
                  }}
                >
                  <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: g.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: g.color, letterSpacing: ".2px" }}>{g.label}</span>
                </button>
              </foreignObject>
            </g>
          );
        })}
      </svg>

      <div style={{ marginTop: 22 }}>
        <GroupDetailCard group={activeGroup} size="lg" />
      </div>
    </div>
  );
}
