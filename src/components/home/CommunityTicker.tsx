import { Ticker } from "@/components/ui/editorial";
import styles from "./fusion.module.css";

const ITEMS = ["Pessoas", "Startups", "Universidades", "Comunidades", "Empresas", "Setor público", "Ideias", "Todo o Cariri"];

export default function CommunityTicker() {
  return (
    <div className={styles.communityTicker} tabIndex={0} aria-label="Faixa da comunidade">
      <div className={styles.tickerContent}><Ticker items={ITEMS} /></div>
    </div>
  );
}
