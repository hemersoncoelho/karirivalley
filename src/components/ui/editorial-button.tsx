/**
 * Botões editoriais do site público ("Imprensa do Vale").
 * Primário: sólido verde-mata · Ghost: hairline · TextLink: mono com seta.
 * Sempre caixa-alta em Space Grotesk, raio 2px. Ver docs/design-system.md.
 */

import type { CSSProperties, MouseEvent, ReactNode } from "react";

const BASE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  borderRadius: 2,
  fontFamily: "var(--font-geo)",
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  textDecoration: "none",
  cursor: "pointer",
  whiteSpace: "nowrap",
  transition: "transform .15s ease, box-shadow .15s ease, background .15s ease, color .15s ease",
};

const SIZES: Record<"sm" | "md" | "lg", CSSProperties> = {
  sm: { height: 34, padding: "0 14px" },
  md: { height: 42, padding: "0 20px" },
  lg: { height: 50, padding: "0 26px", fontSize: 14 },
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
            background: "transparent",
            color: "var(--nb-btn-ghost-fg)",
            border: "1px solid var(--nb-line)",
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
        className={className}
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
      className={className}
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
      <span aria-hidden="true" style={{ fontSize: 9 }}>▸</span>
    </a>
  );
}
