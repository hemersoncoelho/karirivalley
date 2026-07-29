"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { useNbTheme } from "@/hooks/useNbTheme";
import { BrandDividerStrip } from "@/components/ui/patterns";

// ─── Static data ──────────────────────────────────────────────────────────────

const DECO = [
  { s: 140, x: '5%',  y: '7%',  c: '#E9B23C', op: .10, dur: '20s', del: '-3s',  rot: '24deg',  fy: '38px' },
  { s:  80, x: '87%', y: '8%',  c: '#239D8C', op: .14, dur: '16s', del: '-8s',  rot: '-20deg', fy: '26px' },
  { s: 220, x: '1%',  y: '52%', c: '#1E4D3A', op: .12, dur: '24s', del: '-12s', rot: '40deg',  fy: '55px' },
  { s:  65, x: '79%', y: '65%', c: '#C25A2E', op: .16, dur: '18s', del: '-5s',  rot: '-38deg', fy: '30px' },
  { s:  44, x: '42%', y: '3%',  c: '#E9B23C', op: .12, dur: '14s', del: '-10s', rot: '14deg',  fy: '18px' },
  { s: 170, x: '71%', y: '38%', c: '#239D8C', op: .08, dur: '22s', del: '-15s', rot: '-52deg', fy: '46px' },
  { s:  55, x: '17%', y: '78%', c: '#C25A2E', op: .14, dur: '17s', del: '-7s',  rot: '58deg',  fy: '24px' },
] as const;

const PALETTE = ['#E9B23C','#239D8C','#1E4D3A','#C25A2E'] as const;

const TAG_COLORS_LIGHT: Record<string, { bg: string; fg: string }> = {
  v: { bg: 'rgba(30,77,58,.12)',   fg: '#1E4D3A' },  // desenvolvimento
  t: { bg: 'rgba(194,90,46,.14)',  fg: '#C25A2E' },  // startups
  g: { bg: 'rgba(232,178,60,.22)', fg: '#8A5C13' },  // investimento
  c: { bg: 'rgba(35,157,140,.14)', fg: '#166E62' },  // educação
  n: { bg: 'rgba(22,20,15,.06)',   fg: 'rgba(22,20,15,.55)' }, // cidade
};

const TAG_COLORS_DARK: Record<string, { bg: string; fg: string }> = {
  v: { bg: 'rgba(30,77,58,.35)',   fg: '#6DC99A' },  // desenvolvimento
  t: { bg: 'rgba(194,90,46,.3)',   fg: '#F09070' },  // startups
  g: { bg: 'rgba(232,184,75,.18)', fg: '#E9B23C' },  // investimento
  c: { bg: 'rgba(35,157,140,.3)',  fg: '#5FD0C2' },  // educação
  n: { bg: 'rgba(15,34,64,.4)',    fg: '#7FA4D8' },  // cidade
};

const MEMBERS = [
  { init: 'JS', name: 'João Silva',   role: 'CTO · Tech Corp',    tags:[{l:'Desenvolvimento',c:'v'},{l:'Juazeiro',c:'n'}], bg:'#1E4D3A', online:true },
  { init: 'ML', name: 'Maria Lima',   role: 'Fundadora · Startup', tags:[{l:'Startups',c:'t'},{l:'Crato',c:'n'}],           bg:'#239D8C', online:false },
  { init: 'PC', name: 'Pedro Costa',  role: 'Investidor Anjo',     tags:[{l:'Investimento',c:'g'},{l:'Fortaleza',c:'n'}],   bg:'#C25A2E', online:false },
  { init: 'AF', name: 'Ana Ferreira', role: 'Pesquisadora · UFCA', tags:[{l:'Educação',c:'c'},{l:'Barbalha',c:'n'}],        bg:'#0F3B36', online:false },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeroSection() {
  const { theme } = useNbTheme();
  const TAG_COLORS = theme === "dark" ? TAG_COLORS_DARK : TAG_COLORS_LIGHT;
  const heroRef   = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef   = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  // Canvas particle network
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero   = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;

    const resize = () => { canvas.width = hero.offsetWidth; canvas.height = hero.offsetHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Dot {
      x=0;y=0;r=0;vx=0;vy=0;col='';maxO=0;op=0;age=0;life=0;dia=false;rot=0;rs=0;
      constructor() { this.spawn(); }
      spawn() {
        this.x=Math.random()*canvas!.width; this.y=Math.random()*canvas!.height;
        this.r=Math.random()*2+.5; this.vx=(Math.random()-.5)*.2; this.vy=(Math.random()-.5)*.2;
        this.col=PALETTE[Math.floor(Math.random()*PALETTE.length)];
        this.maxO=Math.random()*.42+.1; this.op=0; this.age=0;
        this.life=Math.random()*280+160; this.dia=Math.random()<.14;
        this.rot=Math.random()*Math.PI*2; this.rs=(Math.random()-.5)*.008;
      }
      tick() {
        this.x+=this.vx; this.y+=this.vy; this.age++; this.rot+=this.rs;
        const t=this.age/this.life;
        this.op=t<.12?(t/.12)*this.maxO:t>.80?((1-t)/.2)*this.maxO:this.maxO;
        if(this.age>=this.life) this.spawn();
      }
      draw() {
        ctx.save(); ctx.globalAlpha=this.op; ctx.fillStyle=this.col;
        if(this.dia){
          ctx.translate(this.x,this.y); ctx.rotate(this.rot);
          const s=this.r*2.4;
          ctx.beginPath(); ctx.moveTo(0,-s); ctx.lineTo(s,0); ctx.lineTo(0,s); ctx.lineTo(-s,0);
          ctx.closePath(); ctx.fill();
        } else {
          ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fill();
        }
        ctx.restore();
      }
    }

    const count = window.innerWidth < 600 ? 24 : 60;
    const pts: Dot[] = Array.from({ length: count }, () => {
      const d = new Dot(); d.age = Math.floor(Math.random() * d.life); return d;
    });

    const drawLines = () => {
      if (window.innerWidth < 768) return;
      for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++) {
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, dist=Math.hypot(dx,dy);
        if(dist<110){ ctx.save(); ctx.globalAlpha=(1-dist/110)*.16; ctx.strokeStyle='#16140F'; ctx.lineWidth=.6;
          ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke(); ctx.restore(); }
      }
    };

    const frame = () => {
      ctx.clearRect(0,0,canvas!.width,canvas!.height);
      drawLines(); pts.forEach(p=>{ p.tick(); p.draw(); });
      raf = requestAnimationFrame(frame);
    };
    frame();

    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);

  // Mouse parallax
  useEffect(() => {
    const hero=heroRef.current, text=textRef.current, visual=visualRef.current;
    if(!hero||!text||!visual) return;
    let mx=0,my=0,cx=0,cy=0,rafId=0;
    const onMove=(e:MouseEvent)=>{ const r=hero.getBoundingClientRect();
      mx=(e.clientX-r.left-r.width/2)/(r.width/2); my=(e.clientY-r.top-r.height/2)/(r.height/2); };
    const onLeave=()=>{ mx=0; my=0; };
    const loop=()=>{ cx+=(mx-cx)*.06; cy+=(my-cy)*.06;
      text.style.transform=`translate(${cx*7}px,${cy*4}px)`;
      visual.style.transform=`translate(${cx*-5}px,${cy*-3}px)`;
      rafId=requestAnimationFrame(loop); };
    hero.addEventListener('mousemove',onMove); hero.addEventListener('mouseleave',onLeave); loop();
    return ()=>{ hero.removeEventListener('mousemove',onMove); hero.removeEventListener('mouseleave',onLeave); cancelAnimationFrame(rafId); };
  }, []);

  return (
    <section ref={heroRef} id="hero" className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: 'var(--nb-page-bg)', transition: 'background .2s ease' }}>

      {/* Aurora blobs — territorial color depth, tons suaves da paleta */}
      <div className="kv-aurora pointer-events-none" style={{ width:'55vw', height:'55vw', maxWidth:820, maxHeight:820,
        top:'-18%', left:'-12%', background:'radial-gradient(circle, rgba(30,77,58,.22) 0%, rgba(30,77,58,.06) 55%, transparent 72%)',
        animationDuration:'22s', animationDelay:'-4s' }} />
      <div className="kv-aurora pointer-events-none" style={{ width:'45vw', height:'45vw', maxWidth:680, maxHeight:680,
        top:'-8%', right:'-8%', background:'radial-gradient(circle, rgba(232,184,75,.28) 0%, rgba(232,184,75,.08) 55%, transparent 72%)',
        animationDuration:'26s', animationDelay:'-9s', animationDirection:'reverse' }} />
      <div className="kv-aurora pointer-events-none" style={{ width:'40vw', height:'40vw', maxWidth:580, maxHeight:580,
        bottom:'10%', left:'15%', background:'radial-gradient(circle, rgba(35,157,140,.18) 0%, rgba(35,157,140,.05) 55%, transparent 72%)',
        animationDuration:'19s', animationDelay:'-14s' }} />
      <div className="kv-aurora pointer-events-none" style={{ width:'30vw', height:'30vw', maxWidth:420, maxHeight:420,
        bottom:'20%', right:'10%', background:'radial-gradient(circle, rgba(194,90,46,.22) 0%, rgba(194,90,46,.06) 55%, transparent 72%)',
        animationDuration:'31s', animationDelay:'-20s', animationDirection:'reverse' }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 kv-hero-grid pointer-events-none" />
      <div className="kv-grain" />

      {/* Topographic lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 960"
        preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M0 700 Q240 660 480 680 Q720 700 960 660 Q1200 620 1440 650" fill="none" stroke="rgba(22,20,15,.055)" strokeWidth="1.5"/>
        <path d="M0 740 Q300 700 600 720 Q900 740 1200 700 Q1320 688 1440 705" fill="none" stroke="rgba(22,20,15,.04)" strokeWidth="1"/>
        <path d="M0 780 Q240 755 480 768 Q720 781 960 752 Q1200 723 1440 748" fill="none" stroke="rgba(22,20,15,.03)" strokeWidth="1"/>
        <path d="M0 650 Q180 620 360 638 Q540 656 720 622 Q900 588 1080 610 Q1260 632 1440 608" fill="none" stroke="rgba(22,20,15,.045)" strokeWidth="1"/>
      </svg>

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }} aria-hidden="true" />

      {/* Deco floating diamonds */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} aria-hidden="true">
        {DECO.map((d, i) => (
          <div key={i} className="absolute kv-deco-float"
            style={{ left:d.x, top:d.y, width:d.s, height:d.s,
              ['--dur' as string]:d.dur, ['--del' as string]:d.del,
              ['--rot' as string]:d.rot, ['--op' as string]:String(d.op), ['--fy' as string]:d.fy
            } as React.CSSProperties}>
            <svg width={d.s} height={d.s} viewBox="-1 -1 2 2">
              <polygon points="0,-.85 .85,0 0,.85 -.85,0" fill="none" stroke={d.c} strokeWidth=".055"/>
            </svg>
          </div>
        ))}
      </div>

      {/* ── 2-column layout ── */}
      <div className="relative flex-1 grid lg:grid-cols-2 items-center gap-14 max-w-[1300px] w-full mx-auto px-6 lg:px-16 pt-36 pb-12"
        style={{ zIndex: 10 }}>

        {/* LEFT: Text */}
        <div ref={textRef} className="flex flex-col items-start" style={{ willChange: 'transform' }}>

          {/* Badge */}
          <div className="kv-fade-in-up mb-7" style={{ animationDelay: '.5s' }}>
            <span className="inline-flex items-center gap-2 px-[18px] py-[7px] text-[11px] font-bold tracking-[2px] uppercase"
              style={{ background:'var(--nb-mustard)', border:'2px solid var(--nb-ink)', color:'var(--nb-ink)', borderRadius:999,
                fontFamily:'var(--font-geo)', boxShadow:'var(--shadow-nb-sm)' }}>
              <span className="kv-pulse-dot" style={{ background:'var(--nb-ink)' }} />
              Cariri · Ceará · Brasil
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-6" style={{ fontFamily:'var(--font-fraunces), Georgia, serif',
            fontSize:'clamp(40px, 4.6vw, 68px)', fontWeight:700, lineHeight:1.1,
            letterSpacing:'-1.5px', color:'var(--nb-heading)' }}>
            <span className="block overflow-hidden">
              <span className="kv-line-up" style={{ animationDelay: '.7s' }}>Uma comunidade</span>
            </span>
            <span className="block overflow-hidden">
              <span className="kv-line-up" style={{ animationDelay: '.88s' }}>
                que{' '}
                <span className="kv-em-word" style={{ fontStyle:'italic', color:'var(--nb-turquoise)', fontWeight:400,
                  position:'relative', display:'inline-block' }}>conecta</span>{' '}quem
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="kv-line-up" style={{ animationDelay: '1.06s' }}>
                faz inovação no <span style={{ color:'var(--nb-terracotta)' }}>Cariri</span>
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="kv-fade-in-up mb-10 max-w-[460px]"
            style={{ animationDelay:'1.3s', fontSize:'clamp(15px, 1.6vw, 18px)', lineHeight:1.68, color:'var(--nb-body)' }}>
            Pessoas, startups, universidades e investidores se encontram aqui — o mapa vivo de quem está transformando o interior do Ceará.
          </p>

          {/* CTAs */}
          <div className="kv-fade-in-up flex gap-3 flex-wrap mb-9" style={{ animationDelay: '1.5s' }}>
            <Link href="/como-participar"
              className="kv-press inline-flex items-center gap-2 px-9 py-4 text-base font-bold"
              style={{ background:'var(--nb-btn-primary-bg)', color:'var(--nb-btn-primary-fg)', border:'var(--nb-btn-primary-border)',
                borderRadius:10, boxShadow:'var(--shadow-nb)', textDecoration:'none', fontFamily:'var(--font-geo)' }}>
              Entrar para a comunidade
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/sobre"
              className="kv-press inline-flex items-center gap-2 px-8 py-4 text-base font-bold"
              style={{ color:'var(--nb-btn-ghost-fg)', background:'var(--nb-btn-ghost-bg)', border:'var(--nb-btn-ghost-border)',
                borderRadius:10, textDecoration:'none', fontFamily:'var(--font-geo)' }}>
              Conhecer a Kariri Valley
            </Link>
          </div>

          {/* Social proof */}
          <div className="kv-fade-in-up flex items-center gap-4" style={{ animationDelay: '1.7s' }}>
            <div className="flex">
              {(['#1E4D3A','#239D8C','#C25A2E','#0F3B36','#E9B23C'] as const).map((bg, i) => (
                <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background:bg, color:bg==='#E9B23C'?'var(--nb-ink)':'var(--nb-sand)', border:'2px solid var(--nb-navbar-border)', marginLeft:i===0?0:-8 }}>
                  {['JS','ML','PC','AF','RB'][i]}
                </div>
              ))}
            </div>
            <p className="text-[13px]" style={{ color:'var(--nb-body)' }}>
              <strong style={{ color:'var(--nb-heading)' }}>500+</strong> membros de diversos perfis
            </p>
          </div>
        </div>

        {/* RIGHT: Visual */}
        <div ref={visualRef} className="relative hidden lg:flex items-center justify-center"
          style={{ willChange: 'transform' }}>

          {/* Rotating geometric rings */}
          <div className="absolute inset-[-60px] flex items-center justify-center pointer-events-none kv-slow-spin" style={{ animationDuration:'70s' }} aria-hidden="true">
            <svg viewBox="-220 -220 440 440" className="w-full h-full">
              <polygon points="0,-200 200,0 0,200 -200,0" fill="none" stroke="rgba(30,77,58,.13)" strokeWidth="1.5"/>
              <polygon points="0,-160 160,0 0,160 -160,0" fill="none" stroke="rgba(35,157,140,.11)" strokeWidth="1"/>
              <polygon points="0,-120 120,0 0,120 -120,0" fill="none" stroke="rgba(194,90,46,.13)" strokeWidth="1"/>
            </svg>
          </div>

          {/* Member card */}
          <div className="relative kv-float-card" style={{ zIndex:2, background:'var(--nb-card-bg)',
            backdropFilter:'var(--nb-card-blur)', WebkitBackdropFilter:'var(--nb-card-blur)',
            border:'var(--nb-card-border)', borderRadius:'var(--nb-card-radius)', width:340,
            boxShadow:'var(--nb-card-shadow)', overflow:'hidden' }}>

            <div className="flex items-center justify-between px-5 py-[18px]"
              style={{ borderBottom:'var(--nb-card-header-border)', background:'var(--nb-card-header-bg)' }}>
              <div className="flex items-center gap-2">
                <span className="w-[7px] h-[7px] rounded-full kv-ping" style={{ background:'var(--nb-forest)' }} />
                <span className="text-[12px] font-semibold" style={{ color:'var(--nb-heading)' }}>Kariri Valley · Membros</span>
              </div>
              <span className="text-[12px] font-bold px-[10px] py-[3px]"
                style={{ color:'var(--nb-ink)', background:'var(--nb-mustard)', border:'2px solid var(--nb-ink)', borderRadius:999 }}>500+</span>
            </div>

            {MEMBERS.map((m, i) => (
              <div key={m.init}>
                {i>0 && <div style={{ height:1, background:'var(--nb-card-divider)', margin:'0 20px' }} />}
                <div className="flex items-center gap-3 px-5 py-3">
                  <div className="relative w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                    style={{ background:m.bg, color:'var(--nb-sand)', border:'2px solid var(--nb-navbar-border)' }}>
                    {m.init}
                    {m.online && <span className="absolute bottom-0 right-0 w-[10px] h-[10px] rounded-full border-2"
                      style={{ background:'#3ECF8E', borderColor:'var(--nb-page-bg)' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold mb-1" style={{ color:'var(--nb-heading)' }}>{m.name}</div>
                    <div className="flex gap-1 flex-wrap">
                      {m.tags.map(t => (
                        <span key={t.l} className="text-[10px] font-semibold px-[7px] py-[2px] rounded"
                          style={{ background:TAG_COLORS[t.c].bg, color:TAG_COLORS[t.c].fg }}>{t.l}</span>
                      ))}
                    </div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
                    style={{ color:'var(--nb-body)', flexShrink:0 }}>
                    <path d="M5.5 3.5L8.5 7l-3 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            ))}

            <Link href="/membros" className="flex items-center justify-center gap-2 px-5 py-[14px] text-[13px] font-semibold"
              style={{ color:'var(--nb-forest)', borderTop:'var(--nb-card-header-border)', textDecoration:'none' }}>
              Ver toda a comunidade
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* Floating notification */}
          <div className="absolute top-[-28px] right-[-28px] flex items-center gap-3 px-4 py-3"
            style={{ zIndex:3, background:'var(--nb-card-bg)', backdropFilter:'var(--nb-card-blur)', WebkitBackdropFilter:'var(--nb-card-blur)',
              border:'var(--nb-card-border)', borderRadius:14,
              boxShadow:'var(--nb-card-shadow)', whiteSpace:'nowrap',
              animation:'kv-fade-in .6s ease 2.2s both, kv-float-notif-loop 5s ease-in-out infinite 2.8s' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
              style={{ background:'#239D8C', color:'var(--nb-sand)', border:'2px solid var(--nb-navbar-border)' }}>AF</div>
            <div>
              <div className="text-[12px] font-semibold" style={{ color:'var(--nb-heading)' }}>Ana entrou agora</div>
              <div className="text-[11px]" style={{ color:'var(--nb-body)' }}>Pesquisadora · UFCA</div>
            </div>
          </div>

          {/* Floating chip */}
          <div className="absolute bottom-[-22px] left-[-24px] flex items-center gap-2 px-4 py-[10px]"
            style={{ zIndex:3, background:'var(--nb-forest)', border:'var(--nb-btn-primary-border)', borderRadius:12,
              boxShadow:'var(--shadow-nb)',
              animation:'kv-fade-in .6s ease 2.6s both, kv-float-chip-loop 7s ease-in-out infinite 3.2s' }}>
            <span className="text-base">🌱</span>
            <div>
              <div className="text-[14px] font-bold leading-none" style={{ color:'var(--nb-sand)' }}>5+ anos</div>
              <div className="text-[10px] tracking-wide" style={{ color:'rgba(244,238,225,.7)' }}>de comunidade</div>
            </div>
          </div>

          {/* Floating bubble */}
          <div style={{ position:'absolute', left:'-36px', top:'50%', transform:'translateY(-60%)', zIndex:3 }}>
            <div className="flex flex-col items-center px-[18px] py-[14px]"
              style={{ background:'var(--nb-mustard)', border:'var(--nb-btn-primary-border)', borderRadius:14,
                boxShadow:'var(--shadow-nb)',
                animation:'kv-fade-in .6s ease 3s both, kv-float-bubble-inner 8s ease-in-out infinite 3.6s' }}>
              <div style={{ fontFamily:'var(--font-fraunces), Georgia, serif', fontSize:26, fontWeight:700, color:'var(--nb-ink)', lineHeight:1 }}>30</div>
              <div className="text-[10px] tracking-[1px] uppercase mt-1" style={{ color:'rgba(22,20,15,.65)' }}>Cidades</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute left-6 lg:left-16 flex items-center gap-3 pointer-events-none"
        style={{ bottom:108, zIndex:10, animation:'kv-fade-in .8s ease 2.4s both' }} aria-hidden="true">
        <div style={{ width:34, height:2, background:'var(--nb-navbar-border)' }} />
        <span className="text-[10px] tracking-[2.5px] uppercase font-semibold" style={{ color:'var(--nb-body)' }}>Explorar</span>
      </div>

      {/* Brand divider strip */}
      <div className="relative" style={{ zIndex:10, animation:'kv-fade-in .8s ease 2s both' }}>
        <BrandDividerStrip className="py-3" />
      </div>

    </section>
  );
}
