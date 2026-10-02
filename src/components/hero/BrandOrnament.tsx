import styles from "./BrandOrnament.module.css";

type BrandOrnamentProps = {
  paused: boolean;
  className?: string;
};

const DIAMONDS = [44, 260, 476];
const CONNECTIONS = [152, 368];

export default function BrandOrnament({ paused, className }: BrandOrnamentProps) {
  return (
    <svg
      viewBox="-2 -2 524 104"
      width="182"
      height="36"
      aria-hidden="true"
      focusable="false"
      data-paused={paused}
      className={`${styles.ornament} ${className ?? ""}`}
    >
      <g fill="none" strokeLinejoin="miter" strokeWidth="12">
        {DIAMONDS.map((x, index) => (
          <g key={x} transform={`translate(${x} 50)`}>
            <path className={styles.gold} d="M 0 -38 L 38 0 L 0 38 L -38 0 Z" />
            <path
              className={`${styles.center} ${styles[`step${index * 2}`]}`}
              fill="currentColor"
              stroke="none"
              d="M 0 -14 L 14 0 L 0 14 L -14 0 Z"
            />
          </g>
        ))}
        <path className={styles.coral} d="M 70 12 L 108 50 L 70 88 M 234 12 L 196 50 L 234 88 M 286 12 L 324 50 L 286 88 M 450 12 L 412 50 L 450 88" />
        {CONNECTIONS.map((x, index) => (
          <g key={x} transform={`translate(${x} 50)`}>
            <path className={styles.gold} d="M -50 -38 L -12 0 L 12 0 L 50 -38 M -50 38 L -12 0 L 12 0 L 50 38" />
            <g className={`${styles.rays} ${styles[`step${index * 2 + 1}`]}`} strokeWidth="6">
              <path d="M -14 -44 V -20 M 0 -48 V -12 M 14 -44 V -20 M -14 20 V 44 M 0 12 V 48 M 14 20 V 44" />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}
