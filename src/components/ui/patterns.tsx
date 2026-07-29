/**
 * Grafismos geométricos reutilizáveis do sistema visual neobrutalista.
 * Formas abstratas inspiradas no território (losangos, tramas, raios) —
 * sem atribuição de significado cultural específico não validado.
 */

interface PatternProps {
  className?: string;
  color?: string;
}

/** Fileira horizontal de losangos, ecoando o motivo da marca. Divisor de seção. */
export function DiamondDivider({ className = "", color = "var(--nb-ink)" }: PatternProps) {
  const items = Array.from({ length: 9 });
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      {items.map((_, i) => (
        <span
          key={i}
          style={{
            width: i % 3 === 1 ? 10 : 6,
            height: i % 3 === 1 ? 10 : 6,
            background: i % 3 === 1 ? color : "transparent",
            border: `2px solid ${color}`,
            transform: "rotate(45deg)",
            opacity: i % 3 === 1 ? 1 : 0.45,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

/** Trama diagonal (inspirada em cestaria/tecelagem), usada como textura de fundo em blocos de cor. */
export function WeavePattern({ className = "", color = "var(--nb-sand)" }: PatternProps) {
  const id = "kv-weave";
  return (
    <svg className={`absolute inset-0 h-full w-full ${className}`} aria-hidden="true" style={{ opacity: 0.1 }}>
      <defs>
        <pattern id={id} width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="28" stroke={color} strokeWidth="2" />
          <line x1="14" y1="0" x2="14" y2="28" stroke={color} strokeWidth="2" strokeDasharray="4 6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Raios geométricos de canto (evocando sol/energia), decoração de bloco de destaque. */
export function SunburstCorner({ className = "", color = "var(--nb-mustard)" }: PatternProps) {
  const rays = Array.from({ length: 12 });
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      {rays.map((_, i) => {
        const angle = (i * 360) / rays.length;
        return (
          <rect
            key={i}
            x="98"
            y="10"
            width="4"
            height={i % 2 === 0 ? 46 : 28}
            rx="2"
            fill={color}
            opacity={i % 2 === 0 ? 0.9 : 0.45}
            transform={`rotate(${angle} 100 100)`}
          />
        );
      })}
    </svg>
  );
}

/** Faixa full-width de losangos concêntricos (mostarda/terracota) com miolo turquesa, ecoando o motivo do logo. */
export function BrandDividerStrip({ className = "" }: { className?: string }) {
  const items = Array.from({ length: 14 });
  return (
    <div
      className={`w-full overflow-hidden flex items-center justify-center ${className}`}
      style={{ borderTop: "3px solid var(--nb-navbar-border)", borderBottom: "3px solid var(--nb-navbar-border)", background: "var(--nb-card-header-bg, var(--nb-card-bg))" }}
      aria-hidden="true"
    >
      {items.map((_, i) => (
        <svg key={i} width="70" height="40" viewBox="0 0 70 40" style={{ flexShrink: 0 }}>
          <polygon points="14,20 32,7 50,20 32,33" fill="none" stroke="var(--nb-mustard)" strokeWidth="2.5" />
          <polygon points="32,3 40,20 32,37 24,20" fill="none" stroke="var(--nb-terracotta)" strokeWidth="2" />
          <polygon points="32,16 36,20 32,24 28,20" fill="var(--nb-turquoise)" />
          <line x1="59" y1="13" x2="59" y2="27" stroke="var(--nb-mustard)" strokeWidth="2" strokeLinecap="round" />
          <line x1="63" y1="13" x2="63" y2="27" stroke="var(--nb-mustard)" strokeWidth="2" strokeLinecap="round" />
          <line x1="67" y1="13" x2="67" y2="27" stroke="var(--nb-mustard)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ))}
    </div>
  );
}

/** Marcas de canto em L, dando efeito de moldura a um bloco/imagem. */
export function CornerBrackets({ className = "", color = "var(--nb-ink)" }: PatternProps) {
  const size = 22;
  const stroke = 3;
  const corner = (rotate: number, style: React.CSSProperties) => (
    <svg width={size} height={size} viewBox="0 0 22 22" style={{ position: "absolute", ...style }} aria-hidden="true">
      <path d="M2 2 H14 M2 2 V14" stroke={color} strokeWidth={stroke} fill="none" transform={`rotate(${rotate} 11 11)`} />
    </svg>
  );
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {corner(0, { top: -stroke, left: -stroke })}
      {corner(90, { top: -stroke, right: -stroke })}
      {corner(-90, { bottom: -stroke, left: -stroke })}
      {corner(180, { bottom: -stroke, right: -stroke })}
    </div>
  );
}
