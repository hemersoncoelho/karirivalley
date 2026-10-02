/**
 * Primitivos editoriais do sistema "Imprensa do Vale".
 * Seção numerada, ticker, foto halftone com legenda e marca em diamante.
 * Regras de uso em docs/design-system.md.
 */

import type { CSSProperties, ReactNode } from "react";

/* ── Kicker: rótulo mono caixa-alta que abre toda seção ─────────────────── */

export function Kicker({
  children,
  color = "var(--nb-label-accent)",
  style,
}: {
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <p className="kv-kicker" style={{ color, ...style }}>
      {children}
    </p>
  );
}

/* ── SectionIndex: cabeçalho de seção numerada (01 · NOME — hairline) ───── */

export function SectionIndex({
  index,
  label,
  title,
  accentColor = "var(--nb-label-accent)",
  style,
}: {
  index: string;
  label: string;
  title?: ReactNode;
  accentColor?: string;
  style?: CSSProperties;
}) {
  return (
    <header style={{ borderTop: "1px solid var(--nb-line)", paddingTop: 14, ...style }}>
      <div className="kv-section-index-row" style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
        <span className="kv-index-num" style={{ fontSize: 13, color: accentColor }}>{index}</span>
        <span className="kv-kicker" style={{ color: accentColor }}>{label}</span>
        {title ? (
          <span
            className="kv-kicker"
            style={{ color: "var(--nb-heading)", marginLeft: "auto", textAlign: "right" }}
          >
            {title}
          </span>
        ) : null}
      </div>
    </header>
  );
}

/* ── Ticker: marquee editorial com máscara e pausa em reduced-motion ────── */

export function Ticker({
  items,
  separator = "◆",
  style,
  itemStyle,
}: {
  items: string[];
  separator?: string;
  style?: CSSProperties;
  itemStyle?: CSSProperties;
}) {
  const row = (
    <div style={{ display: "flex", alignItems: "center", gap: 40, paddingRight: 40, flexShrink: 0 }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <span className="kv-kicker" style={{ color: "var(--nb-heading)", ...itemStyle }}>
            {item}
          </span>
          <span aria-hidden="true" style={{ fontSize: 7, color: "var(--nb-mustard)" }}>
            {separator}
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="kv-ticker-mask" style={style}>
      <div className="kv-ticker">
        {row}
        {row}
      </div>
    </div>
  );
}

/* ── PhotoFrame: foto em meio-tom com legenda mono e colchetes ──────────── */

export function PhotoFrame({
  src,
  alt,
  caption,
  className = "",
  style,
  children,
}: {
  src: string;
  alt: string;
  caption?: ReactNode;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <figure className={className} style={{ margin: 0, ...style }}>
      <div className="kv-photo" style={{ position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} style={{ width: "100%", height: "auto", display: "block" }} />
        {children}
      </div>
      {caption ? (
        <figcaption
          className="kv-meta"
          style={{ marginTop: 10, display: "flex", gap: 8, color: "var(--nb-body)" }}
        >
          <span aria-hidden="true" style={{ color: "var(--nb-label-accent)" }}>[/]</span>
          <span>{caption}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}

/* ── MetaDot: ponto de cor com função (agendado, aberto, destaque) ──────── */

const DOT_ROLES = {
  event: "var(--nb-turquoise)",
  opportunity: "var(--nb-terracotta)",
  highlight: "var(--nb-mustard)",
  neutral: "var(--nb-ink)",
} as const;

export function MetaDot({
  role = "neutral",
  style,
}: {
  role?: keyof typeof DOT_ROLES;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: 999,
        background: DOT_ROLES[role],
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

/* ── DiamondMark: diamante da marca, sólido ou vazado ───────────────────── */

export function DiamondMark({
  size = 8,
  color = "var(--nb-mustard)",
  outline = false,
  style,
}: {
  size?: number;
  color?: string;
  outline?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: size,
        height: size,
        background: outline ? "transparent" : color,
        border: outline ? `1.5px solid ${color}` : "none",
        transform: "rotate(45deg)",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
