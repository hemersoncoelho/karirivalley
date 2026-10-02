import Link from "next/link";
import { DiamondMark } from "@/components/ui/editorial";
import styles from "./fusion.module.css";

export default function FinalCtaSection() {

  return (
    <section
      className={styles.closing}
    >
      {/* Chapada ao fundo do fechamento */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/deco-layer-13.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -40,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(1100px, 105vw)",
          opacity: 0.55,
          pointerEvents: "none",
        }}
      />
      {/* Bromélia emergindo na lateral */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/deco-layer-5.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -30,
          top: "50%",
          transform: "translateY(-50%) rotate(-10deg)",
          width: 210,
          opacity: 0.55,
          pointerEvents: "none",
        }}
      />

      <div className="relative mx-auto max-w-[900px] px-6 text-center">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <DiamondMark size={11} />
        </div>

        <p className="kv-kicker" style={{ color: "var(--nb-mustard)", marginBottom: 26 }}>
          O próximo encontro pode começar com você
        </p>

        <h2
          className="kv-display"
          style={{ fontSize: "clamp(38px, 5.4vw, 72px)", color: "var(--nb-sand)", marginBottom: 26 }}
        >
          Traga sua ideia. Traga sua curiosidade.{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-mustard)" }}>Venha somar.</em>
        </h2>

        <p
          style={{
            fontSize: "clamp(15px, 1.5vw, 17px)",
            lineHeight: 1.7,
            color: "rgba(244,238,225,.72)",
            maxWidth: 520,
            margin: "0 auto 44px",
          }}
        >
          Uma comunidade se constrói com a presença de cada pessoa. O Cariri tem muito para criar — e fica ainda melhor com você por perto.
        </p>

        <div className={styles.closingActions}>
          <Link
            href="/como-participar"
            className="kv-press kv-kicker inline-flex items-center"
            style={{
              height: 50,
              padding: "0 28px",
              borderRadius: 2,
              background: "var(--nb-mustard)",
              color: "var(--nb-ink)",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Entrar para a comunidade
          </Link>
          <Link
            href="/login"
            className="kv-kicker inline-flex items-center"
            style={{
              height: 50,
              padding: "0 26px",
              borderRadius: 2,
              border: "1px solid rgba(244,238,225,.5)",
              color: "var(--nb-sand)",
              textDecoration: "none",
            }}
          >
            Já sou membro
          </Link>
        </div>
      </div>
    </section>
  );
}
