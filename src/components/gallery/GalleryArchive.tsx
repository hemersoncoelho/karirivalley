"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { GalleryPhoto } from "@/lib/gallery";
import styles from "@/app/galeria/gallery.module.css";

type Filter = "all" | "favorites" | number;

function dateLabel(photo: GalleryPhoto) {
  if (!photo.date) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${photo.date}T12:00:00Z`));
}

export default function GalleryArchive({ photos }: { photos: GalleryPhoto[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const isOpen = activeId !== null;
  const years = [...new Set(photos.map((photo) => photo.year).filter((year): year is number => year !== null))].sort((a, b) => b - a);
  const visiblePhotos = photos.filter((photo) => filter === "all" || (filter === "favorites" ? photo.favorite : photo.year === filter));
  const activeIndex = visiblePhotos.findIndex((photo) => photo.id === activeId);
  const activePhoto = visiblePhotos[activeIndex];
  const favoriteCount = photos.filter((photo) => photo.favorite).length;

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  function closePhoto() {
    setActiveId(null);
    setImageFailed(false);
  }

  function movePhoto(direction: number) {
    const nextIndex = (activeIndex + direction + visiblePhotos.length) % visiblePhotos.length;
    setActiveId(visiblePhotos[nextIndex].id);
    setImageFailed(false);
  }

  function selectFilter(nextFilter: Filter) {
    setFilter(nextFilter);
    closePhoto();
  }

  return (
    <section aria-label="Arquivo de fotografias">
      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Filtrar fotografias">
          <button type="button" aria-pressed={filter === "all"} onClick={() => selectFilter("all")}>
            Todas <span>{photos.length}</span>
          </button>
          <button type="button" aria-pressed={filter === "favorites"} onClick={() => selectFilter("favorites")}>
            Destaques <span>{favoriteCount}</span>
          </button>
          {years.map((year) => (
            <button key={year} type="button" aria-pressed={filter === year} onClick={() => selectFilter(year)}>
              {year}
            </button>
          ))}
        </div>
        <p className={`kv-meta ${styles.resultCount}`} role="status">
          {visiblePhotos.length} {visiblePhotos.length === 1 ? "fotografia" : "fotografias"}
        </p>
      </div>

      <div className={styles.photoWall}>
        {visiblePhotos.map((photo, index) => (
          <figure className={styles.photo} key={photo.id}>
            <button
              type="button"
              className={styles.photoButton}
              aria-label={`Ampliar fotografia: ${photo.alt}. ${dateLabel(photo)}.`}
              aria-haspopup="dialog"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setActiveId(photo.id);
                setImageFailed(false);
              }}
            >
              <Image
                src={photo.thumbnail}
                alt={photo.alt}
                width={photo.thumbnailWidth}
                height={photo.thumbnailHeight}
                sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc((100vw - 68px) / 2), 33vw"
                loading={index < 3 ? "eager" : "lazy"}
                unoptimized
              />
              {photo.favorite && <span className={styles.favoriteBadge}>Destaque</span>}
              <span className={styles.expandIcon} aria-hidden="true"><Expand size={17} /></span>
            </button>
            <figcaption className={styles.caption}>
              <span>{dateLabel(photo)}</span>
              <span aria-hidden="true">↗</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {visiblePhotos.length === 0 && (
        <div className={styles.empty}>
          <p>Nenhuma fotografia neste período.</p>
          <button type="button" onClick={() => selectFilter("all")}>Ver todas as fotografias</button>
        </div>
      )}

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="gallery-photo-title"
        aria-describedby="gallery-photo-description"
        onClose={closePhoto}
        onCancel={(event) => { event.preventDefault(); closePhoto(); }}
        onClick={(event) => {
          // Native dialogs use the dialog element itself as the backdrop target.
          if (event.target === event.currentTarget) closePhoto();
        }}
        onKeyDown={(event) => {
          if (event.key === "Tab") {
            const controls = [...event.currentTarget.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]")];
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }
          if (event.key === "ArrowLeft") { event.preventDefault(); movePhoto(-1); }
          if (event.key === "ArrowRight") { event.preventDefault(); movePhoto(1); }
        }}
      >
        <div className={styles.dialogInner}>
          <header className={styles.dialogHeader}>
            <div>
              <p className="kv-kicker">Memórias do Kariri Valley</p>
              <h2 id="gallery-photo-title">{activePhoto ? dateLabel(activePhoto) : "Fotografia da comunidade"}</h2>
            </div>
            <button type="button" className={styles.dialogIconButton} onClick={closePhoto} aria-label="Fechar fotografia" autoFocus>
              <X size={23} aria-hidden="true" />
            </button>
          </header>

          {activePhoto && (
            <>
              <div className={styles.dialogImage}>
                {imageFailed ? (
                  <div className={styles.imageError} role="status">
                    <p>Não foi possível carregar esta fotografia.</p>
                    <button type="button" onClick={() => setImageFailed(false)}>Tentar novamente</button>
                    <a href={activePhoto.src} target="_blank" rel="noreferrer">Abrir a imagem em outra aba <Expand size={16} aria-hidden="true" /></a>
                  </div>
                ) : (
                  <Image
                    key={activePhoto.id}
                    src={activePhoto.src}
                    alt={activePhoto.alt}
                    width={activePhoto.width}
                    height={activePhoto.height}
                    loading="eager"
                    unoptimized
                    onError={() => setImageFailed(true)}
                  />
                )}
              </div>
              <footer className={styles.dialogFooter}>
                <div className={styles.dialogCaption}>
                  <p id="gallery-photo-description">{activePhoto.alt}</p>
                  <p className="kv-meta" aria-live="polite" aria-atomic="true">Fotografia {activeIndex + 1} de {visiblePhotos.length}</p>
                </div>
                <div className={styles.photoNavigation}>
                  <button type="button" className={styles.dialogIconButton} onClick={() => movePhoto(-1)} aria-label="Fotografia anterior">
                    <ArrowLeft size={22} aria-hidden="true" />
                  </button>
                  <button type="button" className={styles.dialogIconButton} onClick={() => movePhoto(1)} aria-label="Próxima fotografia">
                    <ArrowRight size={22} aria-hidden="true" />
                  </button>
                </div>
              </footer>
            </>
          )}
        </div>
      </dialog>
    </section>
  );
}
