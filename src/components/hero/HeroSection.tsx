"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { EditorialButton } from "@/components/ui/editorial-button";
import PixelField from "./PixelField";
import BrandOrnament from "./BrandOrnament";
import styles from "@/components/home/fusion.module.css";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      if (paused || preference.matches) video?.pause();
      else void video?.play().catch(() => {});
    };
    syncMotion();
    preference.addEventListener("change", syncMotion);
    return () => preference.removeEventListener("change", syncMotion);
  }, [paused]);

  return (
    <section id="hero" className={styles.hero} aria-labelledby="hero-title" data-motion-paused={paused}>
      <div aria-hidden="true" className={styles.videoBackground}>
        <video ref={videoRef} src="/media/logo-anim.mp4" muted playsInline autoPlay loop tabIndex={-1} />
      </div>
      <PixelField paused={paused} />
      <div aria-hidden="true" className={styles.landscapeBlend} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/media/paisagem-montanha.png" alt="" aria-hidden="true" className={styles.chapada} />
      <div aria-hidden="true" className={styles.heroGround} />
      <div className={styles.heroCopy}>
        <BrandOrnament paused={paused} className={styles.brandElement} />
        <p className={`kv-kicker ${styles.heroLabel}`}>Comunidade de inovação do Cariri</p>
        <h1 id="hero-title" className={`kv-display ${styles.heroTitle}`}>
          O futuro do Cariri<br />tem a <em>nossa cara.</em>
        </h1>
        <p className={styles.heroDescription}>
          Gente que se encontra, compartilha ideias e faz acontecer.
          Somos o Kariri Valley: um movimento de pessoas que acreditam
          na força do nosso território.
        </p>
        <div className={styles.heroActions}>
          <EditorialButton href="/como-participar" size="lg">Fazer parte</EditorialButton>
          <EditorialButton href="/sobre" variant="ghost" size="lg">Conheça nossa história</EditorialButton>
        </div>
      </div>
      <button type="button" className={`${styles.motionToggle} ${styles.heroMotionToggle}`} aria-label={paused ? "Retomar animação" : "Pausar animação"} aria-pressed={paused} onClick={() => setPaused(current => !current)}>
        {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
      </button>
    </section>
  );
}
