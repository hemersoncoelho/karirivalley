"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { Ticker } from "@/components/ui/editorial";
import styles from "./fusion.module.css";

const ITEMS = ["Pessoas", "Startups", "Universidades", "Comunidades", "Empresas", "Setor público", "Ideias", "Todo o Cariri"];

export default function CommunityTicker() {
  const [paused, setPaused] = useState(false);

  return (
    <div className={styles.communityTicker} data-motion-paused={paused}>
      <div className={styles.tickerContent}><Ticker items={ITEMS} /></div>
      <button
        type="button"
        className={styles.motionToggle}
        aria-label={paused ? "Retomar faixa da comunidade" : "Pausar faixa da comunidade"}
        aria-pressed={paused}
        onClick={() => setPaused(current => !current)}
      >
        {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
      </button>
    </div>
  );
}
