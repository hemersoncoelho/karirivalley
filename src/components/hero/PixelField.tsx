"use client";

import { useEffect, useRef } from "react";
import { useNbTheme } from "@/hooks/useNbTheme";

const CELL = 15;
const ERASE_RADIUS = 85;
const REGEN_CHANCE = 0.012;

/**
 * Campo de pixels vivo preenchendo a hero inteira. O manifesto vive numa
 * "ilha de papel" central (exclusão radial com dithering na borda) — é ela
 * que garante o contraste: trama densa e vibrante ao redor, respiro no meio.
 * Ondas de brilho mantêm a trama em transformação; o cursor revela o papel
 * e as células se recompõem. reduced-motion: estático.
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

    const pal = dark
      ? { base: "rgba(244,237,223,.92)", forest: "rgba(244,237,223,.55)", gold: "#E9B23C", terra: "#E0715A", teal: "#3FD4BF" }
      : { base: "#16140F", forest: "#1E4D3A", gold: "#E9B23C", terra: "#C25A2E", teal: "#239D8C" };

    let raf = 0;
    let time = 0;
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let target = new Float32Array(0);
    let values = new Float32Array(0);
    let erased = new Uint8Array(0);
    let phase = new Float32Array(0);
    let kind: Uint8Array = new Uint8Array(0); // 0 base · 1 gold · 2 terra · 3 teal · 4 forest

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    const edgeNoise = (x: number) =>
      clamp01(0.5 + 0.3 * Math.sin(x * 7.3 + 2.1) + 0.22 * Math.sin(x * 17.7 + 0.8));

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
      phase = new Float32Array(n);
      kind = new Uint8Array(n);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const nx = c / cols;
          const ny = r / rows;

          // ── Ilha de papel central (contraste do manifesto) ──
          // elipse centrada no texto; borda com dithering orgânico
          const dx = (nx - 0.5) / 0.36;
          const dy = (ny - 0.46) / 0.32;
          const d = Math.hypot(dx, dy);

          let t = 1;
          if (d < 0.94) {
            t = 0; // dentro da ilha: papel puro
          } else if (d < 1.3) {
            // anel de transição: densidade cai com o ruído da borda
            const keep = clamp01(1.3 - d) * (0.45 + 0.55 * edgeNoise(nx * 2 + ny));
            t = Math.random() < keep ? 1 : 0;
          } else if (Math.random() < 0.06) {
            t = 0; // respiros esparsos na trama densa
          }

          target[i] = t;
          values[i] = t ? 0.4 + Math.random() * 0.6 : 0;
          phase[i] = Math.random() * Math.PI * 2;

          if (t === 0) continue;
          // cor: bandas quentes à esq., teal à dir., base tinta/verde
          const warmN = Math.hypot(nx - 0.2, ny - 0.3);
          const coolN = Math.hypot(nx - 0.85, ny - 0.55);
          const goldN = Math.hypot(nx - 0.55, ny - 0.85);
          if (coolN < 0.3) kind[i] = Math.random() < 0.7 ? 3 : 0;
          else if (warmN < 0.28) kind[i] = Math.random() < 0.6 ? 1 : 2;
          else if (goldN < 0.24) kind[i] = Math.random() < 0.5 ? 1 : 3;
          else if (Math.random() < 0.16) kind[i] = Math.random() < 0.5 ? 1 : 3;
          else kind[i] = Math.random() < 0.78 ? 0 : 4;
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
            }
          }
        }
      }
    };

    const colorFor = (i: number): string => {
      switch (kind[i]) {
        case 1: return pal.gold;
        case 2: return pal.terra;
        case 3: return pal.teal;
        case 4: return pal.forest;
        default: return pal.base;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const base = values[i];
          if (base < 0.04) continue;

          // onda de brilho: pulso senoidal lento com fase própria por célula
          const wave = 0.72 + 0.28 * Math.sin(time * 1.6 + phase[i]);
          const v = base * wave;
          const size = CELL * v * 0.94;
          const off = (CELL - size) / 2;
          ctx.fillStyle = colorFor(i);
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
        values[i] += (target[i] - values[i]) * 0.085;
      }
    };

    const loop = () => {
      time += 1 / 60;
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
