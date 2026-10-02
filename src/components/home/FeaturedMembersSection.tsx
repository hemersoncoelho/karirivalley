import Link from "next/link";
import Image from "next/image";
import { SectionIndex } from "@/components/ui/editorial";
import { galleryPhotos } from "@/lib/gallery";
import styles from "./fusion.module.css";

const MOMENTS = [
  { id: "20230715-152511", title: "Compartilhar conhecimento", description: "Conversas que aproximam experiências e abrem novos caminhos.", photoPosition: "50% 42%" },
  { id: "20231108-161347", title: "Construir junto", description: "Cada pessoa que chega também deixa sua marca no movimento.", photoPosition: "50% 35%" },
  { id: "20231122-162417", title: "Colaborar com ideias", description: "Gente que se encontra para pensar, experimentar e fazer acontecer.", photoPosition: "50% 50%" },
  { id: "img-20221105-wa0002-fav", title: "Celebrar o caminho", description: "As conquistas do Cariri têm a força de uma construção coletiva.", photoPosition: "50% 50%" },
];

export default function FeaturedMembersSection() {
  return (
    <section className="relative overflow-hidden pb-16 md:pb-28" style={{ background: "var(--nb-page-bg)" }} aria-labelledby="people-heading">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-16">
        <SectionIndex index="06" label="Quem faz" title="a comunidade em movimento" />
        <div className={`mt-10 ${styles.peopleHeading}`}>
          <h2 id="people-heading" className="kv-display" style={{ fontSize: "clamp(32px, 3.6vw, 48px)", color: "var(--nb-heading)", margin: 0 }}>
            Rostos do <em style={{ fontWeight: 400, color: "var(--nb-community-accent)" }}>vale.</em>
          </h2>
          <Link href="/membros" className="inline-flex min-h-11 items-center gap-3 text-sm underline underline-offset-4" style={{ color: "var(--nb-heading)" }}>Conhecer a comunidade <span aria-hidden="true">↗</span></Link>
        </div>
        <p className="mb-0 mt-4 max-w-[640px] text-base leading-[1.8]" style={{ color: "var(--nb-body)" }}>Por trás de cada ideia, tem gente. Estes são os rostos, as trocas e os momentos que fazem o Kariri Valley acontecer.</p>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MOMENTS.map(moment => {
            const photo = galleryPhotos.find(item => item.id === moment.id)!;
            return (
              <Link key={moment.id} href="/galeria" className={`${styles.peopleCard} ${styles.framedCard}`}>
                <div className={styles.photoFrame}>
                  <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 280px" style={{ objectPosition: moment.photoPosition }} />
                </div>
                <div className={styles.peopleCardCopy}>
                  <h3>{moment.title}</h3>
                  <p>{moment.description}</p>
                  <span>Ver nossos encontros <span aria-hidden="true">↗</span></span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
