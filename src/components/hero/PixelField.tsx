"use client";

import { useEffect, useRef } from "react";
import { useNbTheme } from "@/hooks/useNbTheme";

const CELL = 13;
const ERASE_RADIUS = 78;
const REGEN_CHANCE = 0.004;

/**
 * Campo de pixels interativo — a trama halftone do sistema como capa viva.
 * Células da paleta da marca formam uma faixa irregular; o cursor "apaga"
 * o impresso revelando o papel, e as células regeneram devagar.
 * reduced-motion: campo estático, sem interação.
 */
export default function PixelField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useNbTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dark = theme === "dark";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let target = new Float32Array(0);
    let values = new Float32Array(0);
    let erased = new Uint8Array(0);
    let colors: string[] = [];

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    const noise = (x: number) =>
      clamp01(0.5 + 0.32 * Math.sin(x * 7.3 + 2.1) + 0.22 * Math.sin(x * 17.7 + 0.8));

    const baseColor = () =>
      dark
        ? Math.random() < 0.72
          ? "rgba(244,237,223,.9)"
          : "#239D8C"
        : Math.random() < 0.72
          ? "#16140F"
          : "#1E4D3A";

    const pickColor = (nx: number, ny: number) => {
      const warm = Math.hypot(nx - 0.42, ny - 0.26);
      const cool = Math.hypot(nx - 0.78, ny - 0.52);
      const r = Math.random();
      if (warm < 0.24) {
        if (r < 0.55) return "#E9B23C";
        if (r < 0.7) return dark ? "#C25A2E" : "#C25A2E";
        return baseColor();
      }
      if (cool < 0.22) {
        if (r < 0.6) return "#239D8C";
        return baseColor();
      }
      if (r < 0.04) return "#C25A2E";
      if (r < 0.08) return "#E9B23C";
      return baseColor();
    };

    const build = () => {
      const section = canvas.parentElement;
      if (!section) return;
      w = section.offsetWidth;
      h = section.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      const n = cols * rows;
      target = new Float32Array(n);
      values = new Float32Array(n);
      erased = new Uint8Array(n);
      colors = new Array(n);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const nx = c / cols;
          const ny = r / rows;
          const edge = rows * (0.1 + 0.34 * noise(nx));
          let t = 0;
          if (r < edge) t = 1;
          else if (r < edge + 2 && Math.random() < 0.3) t = 1;
          else if (Math.random() < 0.012) t = 1;
          target[i] = t;
          values[i] = t * (0.35 + Math.random() * 0.65);
          colors[i] = pickColor(nx, ny);
        }
      }
    };

    const eraseAt = (x: number, y: number) => {
      const cx = Math.floor(x / CELL);
      const cy = Math.floor(y / CELL);
      const rad = Math.ceil(ERASE_RADIUS / CELL);
      for (let r = Math.max(0, cy - rad); r <= Math.min(rows - 1, cy + rad); r++) {
        for (let c = Math.max(0, cx - rad); c <= Math.min(cols - 1, cx + rad); c++) {
          const dx = (c - cx) * CELL;
          const dy = (r - cy) * CELL;
          if (dx * dx + dy * dy <= ERASE_RADIUS * ERASE_RADIUS) {
            const i = r * cols + c;
            if (target[i] === 1) {
              erased[i] = 1;
              target[i] = 0;
              values[i] = 0;
            }
          }
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const v = values[i];
          if (v < 0.05) continue;
          const size = CELL * v * 0.92;
          const off = (CELL - size) / 2;
          ctx.fillStyle = colors[i];
          ctx.fillRect(c * CELL + off, r * CELL + off, size, size);
        }
      }
    };

    const step = () => {
      for (let i = 0; i < values.length; i++) {
        if (erased[i] && Math.random() < REGEN_CHANCE) {
          erased[i] = 0;
          target[i] = 1;
        }
        values[i] += (target[i] - values[i]) * 0.09;
      }
    };

    const loop = () => {
      step();
      draw();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      eraseAt(e.clientX - rect.left, e.clientY - rect.top);
    };

    build();

    if (reduced) {
      values.set(target);
      draw();
      return;
    }

    const parent = canvas.parentElement;
    parent?.addEventListener("pointermove", onMove, { passive: true });
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 150);
    };
    window.addEventListener("resize", onResize, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      parent?.removeEventListener("pointermove", onMove);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
