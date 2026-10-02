/**
 * Botões editoriais do site público ("Imprensa do Vale").
 * Primário: sólido verde-mata · Ghost: hairline · TextLink: mono com seta.
 * Texto em Space Grotesk e cantos de 2px. Ver docs/design-system.md.
 */

import type { CSSProperties, MouseEvent, ReactNode } from "react";

const BASE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  borderRadius: 2,
  fontFamily: "var(--font-geo)",
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: "0",
  textTransform: "none",
  textDecoration: "none",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const SIZES: Record<"sm" | "md" | "lg", CSSProperties> = {
  sm: { height: 36, padding: "0 16px", fontSize: 13 },
  md: { height: 44, padding: "0 22px" },
  lg: { height: 52, padding: "0 28px", fontSize: 15 },
};

type EditorialButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  variant?: "primary" | "ghost" | "invert";
  size?: keyof typeof SIZES;
  style?: CSSProperties;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  target?: string;
  rel?: string;
};

export function EditorialButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  style,
  className,
  type = "button",
  disabled,
  target,
  rel,
}: EditorialButtonProps) {
  const variantStyle: CSSProperties =
    variant === "primary"
      ? {
          background: "var(--nb-btn-primary-bg)",
          color: "var(--nb-btn-primary-fg)",
          border: "none",
        }
      : variant === "invert"
        ? {
            background: "var(--nb-heading)",
            color: "var(--nb-page-bg)",
            border: "none",
          }
        : {
            background: "var(--nb-card-bg)",
            color: "var(--nb-btn-ghost-fg)",
            border: "1px solid rgba(22,20,15,.12)",
          };

  const merged: CSSProperties = {
    ...BASE,
    ...SIZES[size],
    ...variantStyle,
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? "none" : undefined,
    ...style,
  };

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        style={merged}
        className={`kv-editorial-button ${className ?? ""}`}
        data-variant={variant}
        target={target}
        rel={rel}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      style={merged}
      className={`kv-editorial-button ${className ?? ""}`}
      data-variant={variant}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

/** Link textual mono com seta ▸ — para navegação discreta em listas e índices. */
export function TextLink({
  children,
  href,
  color = "var(--nb-ink)",
  style,
  target,
  rel,
  onClick,
}: {
  children: ReactNode;
  href: string;
  color?: string;
  style?: CSSProperties;
  target?: string;
  rel?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      className="kv-kicker"
      style={{
        color,
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        ...style,
      }}
    >
      <span style={{ borderBottom: "1px solid currentColor", paddingBottom: 1 }}>{children}</span>
      <span className="kv-link-arrow" aria-hidden="true" style={{ fontSize: 9 }}>▸</span>
    </a>
  );
}
