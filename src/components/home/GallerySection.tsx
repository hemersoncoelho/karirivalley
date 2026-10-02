import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { favoritePhotos, galleryPhotos } from "@/lib/gallery";
import styles from "./home.module.css";

export default function GallerySection() {
  const photos = favoritePhotos.filter(photo => !["20260801-195702-fav", "20231108-150500-fav", "20231205-172120-fav"].includes(photo.id)).slice(0, 4);
  return (
    <section className={`${styles.section} ${styles.gallery}`} aria-labelledby="gallery-title">
      <div className={styles.container}>
        <div className={styles.sectionLabel}><span className={styles.eyebrow}>Memória da comunidade</span><span className={styles.sectionNote}>{galleryPhotos.length} registros da nossa trajetória</span></div>
        <div className={styles.galleryHeading}>
          <h2 id="gallery-title" className={`kv-display ${styles.sectionTitle}`}>A gente faz história.<br />E guarda esses encontros.</h2>
          <div><p>Por trás de cada ideia, tem gente. Um pouco dos rostos, das trocas e dos momentos que fazem o Kariri Valley.</p><Link href="/galeria" className={styles.textLink}>Ver a galeria completa <ArrowUpRight className="kv-link-arrow" size={18} aria-hidden="true" /></Link></div>
        </div>
        <div className={styles.photoStrip}>
          {photos.map(photo => (
            <Link href="/galeria" key={photo.id} className={styles.galleryPhoto} style={{ aspectRatio: `${photo.width} / ${photo.height}` }} aria-label={`Ver na galeria: ${photo.caption}`}>
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 767px) 100vw, 50vw" className={styles.photo} />
              <span>{photo.year}<ArrowUpRight size={16} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
