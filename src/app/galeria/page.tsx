import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import GalleryArchive from "@/components/gallery/GalleryArchive";
import { galleryPhotos } from "@/lib/gallery";
import styles from "./gallery.module.css";

export const metadata: Metadata = {
  title: "Galeria — Kariri Valley",
  description:
    "Pessoas, encontros e memórias da comunidade de inovação do Cariri. Explore os registros da trajetória do Kariri Valley.",
};

export default function GalleryPage() {
  return (
    <main className={styles.page} id="conteudo" tabIndex={-1}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={`kv-kicker ${styles.kicker}`}>Nossa memória coletiva</p>
          <div className={styles.introduction}>
            <h1 className={`kv-display ${styles.title}`}>
              Um movimento.<br />
              <em>Tantos encontros.</em>
            </h1>
            <div className={styles.introCopy}>
              <p>
                Por trás de cada ideia, tem gente. Estes são os rostos,
                as conversas e os momentos que fazem o Kariri Valley acontecer.
              </p>
              <Link className={styles.historyLink} href="/sobre">
                Conheça nossa história <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </header>

        <GalleryArchive photos={galleryPhotos} />

        <footer className={styles.archiveFooter}>
          <p className="kv-meta">Cariri, Ceará · Feito de gente</p>
          <Link className={styles.historyLink} href="/como-participar">
            Faça parte do próximo encontro <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </footer>
      </div>
    </main>
  );
}
