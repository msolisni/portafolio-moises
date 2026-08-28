"use client";

import { useEffect, useRef, useState } from "react";

/* --- Particle canvas background --- */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; alpha: number };
    const count = 80;
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165,180,252,${p.alpha})`; ctx.fill();
      });
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - dist / 120)})`; ctx.lineWidth = 0.8; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 0.7 }} />;
}

/* --- Scroll reveal hook --- */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0) rotateX(0deg)" : "translateY(40px) rotateX(8deg)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`, transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}

/* --- 3D card tilt --- */
function Card3D({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  function handleMove(e: React.MouseEvent) {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    el.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
  }
  function handleLeave() { const el = ref.current; if (el) el.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale(1)"; }
  return (
    <div ref={ref} className={className} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ transition: "transform 0.35s cubic-bezier(.22,1,.36,1)", transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}

/* --- Skill bar --- */
function SkillBar({ label, pct, delay }: { label: string; pct: number; delay: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="mb-3">
      <div className="flex justify-between mb-1 text-xs font-semibold" style={{ color: "#a5b4fc" }}>
        <span>{label}</span><span>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: "rgba(99,102,241,0.18)" }}>
        <div style={{ width: visible ? `${pct}%` : "0%", height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#6366f1,#a5b4fc)", transition: `width 1.2s cubic-bezier(.22,1,.36,1) ${delay}ms`, boxShadow: "0 0 8px #a5b4fc55" }} />
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="mb-10">
      <p style={{ color: "#a5b4fc", fontSize: ".72rem", fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase" }}>{eyebrow}</p>
      <h2 style={{ marginTop: ".5rem", fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 800, letterSpacing: "-.04em", color: "#ecf1ff" }}>{title}</h2>
    </Reveal>
  );
}

export default function CVPage() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const skills = [
    { label: "C# / .NET / ASP.NET Core", pct: 88 },
    { label: "Python", pct: 82 },
    { label: "PostgreSQL / SQL Server", pct: 85 },
    { label: "RAG · Embeddings · IA", pct: 80 },
    { label: "Docker / Linux", pct: 75 },
    { label: "n8n · APIs REST", pct: 83 },
    { label: "JavaScript / HTML / CSS", pct: 78 },
    { label: "ETL · Pandas", pct: 79 },
  ];

  const projects = [
    { num: "01", category: "IA aplicada", title: "Asistente Tributario con IA", desc: "Solución orientada a consultas tributarias utilizando RAG, PostgreSQL/PGVector, procesamiento de documentos, embeddings, automatización con n8n e integración con Telegram.", tags: ["Python", "RAG", "PGVector", "n8n", "Telegram"] },
    { num: "02", category: "Automatización", title: "Arquitectura RAG & Automatización", desc: "Flujos automatizados para ingestión, procesamiento, fragmentación, generación de embeddings y almacenamiento vectorial de documentos.", tags: ["n8n", "Embeddings", "Python", "PostgreSQL"] },
    { num: "03", category: "Ingeniería de datos", title: "Pipeline ETL", desc: "Procesos en Python para limpieza, transformación e importación de grandes conjuntos de datos hacia PostgreSQL.", tags: ["Python", "ETL", "Pandas", "PostgreSQL"] },
    { num: "04", category: "Desarrollo de software", title: "Sistemas de Información .NET", desc: "Diseño y desarrollo de aplicaciones utilizando C#, .NET, ASP.NET Core, MVC, Blazor, PHP y bases de datos relacionales.", tags: ["C#", ".NET", "Blazor", "SQL Server"] },
    { num: "05", category: "Automatización", title: "Workflows con n8n", desc: "Diseño de workflows para integración de servicios, procesamiento de información, APIs, bases de datos, documentos y servicios de IA.", tags: ["n8n", "APIs", "Webhooks", "IA"] },
  ];

  const TAG_STYLE = { border: "1px solid rgba(99,102,241,0.25)", borderRadius: 999, padding: ".25rem .6rem", fontSize: ".72rem", fontWeight: 600, color: "#a5b4fc", background: "rgba(99,102,241,0.08)" } as const;
  const BTN_SEC = { display: "inline-flex" as const, alignItems: "center" as const, gap: ".45rem", borderRadius: ".7rem", padding: ".78rem 1.4rem", fontWeight: 700, fontSize: ".92rem", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc", background: "rgba(99,102,241,0.08)", transition: "transform .2s, background .2s" };

  return (
    <div style={{ minHeight: "100vh", background: "#0b1020", color: "#ecf1ff", fontFamily: "Arial, Helvetica, sans-serif", overflowX: "hidden" }}>
      <ParticleCanvas />
      <div className="pointer-events-none fixed z-10 rounded-full" style={{ width: 360, height: 360, left: cursor.x - 180, top: cursor.y - 180, background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", transition: "left .08s, top .08s" }} />

      {/* HERO */}
      <section className="relative z-10 flex items-center justify-center" style={{ minHeight: "100vh", padding: "2rem" }}>
        <div className="absolute" style={{ top: "10%", right: "8%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)", filter: "blur(40px)", animation: "floatA 8s ease-in-out infinite" }} />
        <div className="absolute" style={{ bottom: "12%", left: "5%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(165,180,252,0.12) 0%, transparent 70%)", filter: "blur(40px)", animation: "floatB 10s ease-in-out infinite" }} />
        <div className="relative flex flex-col items-center text-center" style={{ maxWidth: 720, gap: "1.8rem" }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#a5b4fc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.2rem", fontWeight: 900, color: "#0b1020", boxShadow: "0 0 40px rgba(99,102,241,0.5), 0 0 80px rgba(99,102,241,0.2)", animation: "pulse3d 3s ease-in-out infinite" }}>MS</div>
          <div>
            <p style={{ color: "#a5b4fc", fontSize: ".72rem", fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: ".6rem" }}>Currículum Vitae · 2026</p>
            <h1 style={{ fontSize: "clamp(2.4rem,6vw,4.5rem)", fontWeight: 900, letterSpacing: "-.055em", lineHeight: .95, backgroundImage: "linear-gradient(135deg,#fff 30%,#a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Moisés Asbel<br />Solis Nicola</h1>
            <p style={{ marginTop: "1rem", fontSize: "1.15rem", color: "#a5b4fc", fontWeight: 700 }}>Ingeniero en Sistemas de Información</p>
            <p style={{ marginTop: ".5rem", fontSize: ".92rem", color: "#64748b" }}>Ventanas, Los Ríos, Ecuador · Presencial | Remoto</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem", justifyContent: "center" }}>
            {[
              { icon: "✉", label: "moises.solis125@gmail.com", href: "mailto:moises.solis125@gmail.com" },
              { icon: "📞", label: "0980854655", href: "tel:+593980854655" },
              { icon: "in", label: "LinkedIn", href: "https://www.linkedin.com/in/moi-solis-nicola-64b87a401/" },
              { icon: "⌥", label: "GitHub", href: "https://github.com/msolisni" },
            ].map((c) => (
              <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 999, padding: ".4rem .85rem", fontSize: ".8rem", fontWeight: 600, color: "#a5b4fc", background: "rgba(99,102,241,0.08)", transition: "background .2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.2)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(99,102,241,0.08)")}
              ><span>{c.icon}</span> {c.label}</a>
            ))}
          </div>
          <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: ".3rem", color: "#293653" }}>
            <span style={{ fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase" }}>scroll</span>
            <div style={{ width: 1.5, height: 32, background: "linear-gradient(180deg,#6366f1,transparent)", borderRadius: 999, animation: "scrollCue 2s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* PERFIL */}
      <section className="relative z-10" style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionHeader eyebrow="Sobre mí" title="Perfil profesional" />
          <Reveal delay={100}>
            <Card3D>
              <div style={{ border: "1px solid rgba(99,102,241,0.2)", borderRadius: "1.4rem", background: "rgba(19,28,49,0.78)", backdropFilter: "blur(16px)", padding: "2.5rem", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 180, height: 180, borderRadius: "0 1.4rem 0 100%", background: "rgba(99,102,241,0.07)" }} />
                <p style={{ lineHeight: 1.85, color: "#a5b1c9", fontSize: "1.02rem", position: "relative" }}>Ingeniero en Sistemas de Información graduado de la <strong style={{ color: "#ecf1ff" }}>Universidad Técnica de Babahoyo</strong>, con experiencia práctica en desarrollo de software, bases de datos, procesamiento de datos, automatización e integración de tecnologías de inteligencia artificial.</p>
                <p style={{ marginTop: "1.2rem", lineHeight: 1.85, color: "#a5b1c9", fontSize: "1.02rem", position: "relative" }}>Experiencia en desarrollo de aplicaciones utilizando <strong style={{ color: "#ecf1ff" }}>C#, .NET, ASP.NET, Blazor, Python, PostgreSQL y SQL Server</strong>. Conocimientos prácticos en ETL, APIs REST, Docker, automatización con n8n y arquitecturas RAG orientadas a soluciones de inteligencia artificial.</p>
                <p style={{ marginTop: "1.2rem", lineHeight: 1.85, color: "#a5b1c9", fontSize: "1.02rem", position: "relative" }}>Interesado en oportunidades presenciales y remotas, dentro y fuera de Ecuador, especialmente en <strong style={{ color: "#ecf1ff" }}>desarrollo de software, datos, automatización e integración de soluciones tecnológicas.</strong></p>
              </div>
            </Card3D>
          </Reveal>
        </div>
      </section>

      {/* HABILIDADES */}
      <section className="relative z-10" style={{ padding: "5rem 1.5rem", background: "rgba(15,22,42,0.6)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionHeader eyebrow="Stack técnico" title="Competencias técnicas" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "2rem" }}>
            <Reveal delay={50}>
              <Card3D>
                <div style={{ border: "1px solid rgba(99,102,241,0.2)", borderRadius: "1.2rem", background: "rgba(19,28,49,0.78)", backdropFilter: "blur(16px)", padding: "1.8rem" }}>
                  <p style={{ color: "#a5b4fc", fontSize: ".72rem", fontWeight: 800, letterSpacing: ".13em", textTransform: "uppercase", marginBottom: "1.4rem" }}>Nivel de dominio</p>
                  {skills.map((s, i) => <SkillBar key={s.label} label={s.label} pct={s.pct} delay={i * 80} />)}
                </div>
              </Card3D>
            </Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { area: "Lenguajes", items: "C#, Python, JavaScript, HTML, CSS, SQL" },
                { area: "Frameworks", items: ".NET, ASP.NET Core, MVC, Blazor, PHP" },
                { area: "Bases de datos", items: "PostgreSQL, SQL Server, SQLite, PGVector" },
                { area: "IA & Automatización", items: "RAG, Embeddings, n8n, MCP, Ollama" },
                { area: "Infraestructura", items: "Docker, Linux, OpenWrt, VMware" },
                { area: "Integración", items: "APIs REST, Webhooks, Telegram" },
              ].map((g, i) => (
                <Reveal key={g.area} delay={i * 60}>
                  <Card3D>
                    <div style={{ border: "1px solid rgba(99,102,241,0.15)", borderRadius: "1rem", background: "rgba(19,28,49,0.6)", backdropFilter: "blur(12px)", padding: "1rem 1.3rem", display: "flex", alignItems: "baseline", gap: ".8rem" }}>
                      <span style={{ color: "#6366f1", fontSize: ".7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".12em", whiteSpace: "nowrap", flexShrink: 0 }}>{g.area}</span>
                      <span style={{ color: "#a5b1c9", fontSize: ".87rem", lineHeight: 1.5 }}>{g.items}</span>
                    </div>
                  </Card3D>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROYECTOS */}
      <section className="relative z-10" style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionHeader eyebrow="Trabajo destacado" title="Proyectos" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.4rem" }}>
            {projects.map((p, i) => (
              <Reveal key={p.num} delay={i * 80}>
                <Card3D className="h-full">
                  <div style={{ height: "100%", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "1.2rem", background: "rgba(19,28,49,0.78)", backdropFilter: "blur(16px)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: ".9rem", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#6366f1,#a5b4fc,transparent)" }} />
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: ".5rem" }}>
                      <div>
                        <p style={{ color: "#6366f1", fontSize: ".68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".13em" }}>{p.category}</p>
                        <h3 style={{ marginTop: ".35rem", fontSize: "1.1rem", fontWeight: 800, color: "#ecf1ff" }}>{p.title}</h3>
                      </div>
                      <span style={{ fontSize: "1.6rem", fontWeight: 900, color: "rgba(99,102,241,0.18)", lineHeight: 1, flexShrink: 0 }}>{p.num}</span>
                    </div>
                    <p style={{ fontSize: ".88rem", lineHeight: 1.65, color: "#a5b1c9", flexGrow: 1 }}>{p.desc}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}>{p.tags.map((t) => <span key={t} style={TAG_STYLE}>{t}</span>)}</div>
                  </div>
                </Card3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FORMACIÓN */}
      <section className="relative z-10" style={{ padding: "5rem 1.5rem", background: "rgba(15,22,42,0.6)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionHeader eyebrow="Educación" title="Formación académica" />
          <Reveal delay={100}>
            <Card3D>
              <div style={{ border: "1px solid rgba(99,102,241,0.2)", borderRadius: "1.2rem", background: "rgba(19,28,49,0.78)", backdropFilter: "blur(16px)", padding: "2rem 2.4rem", display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#a5b4fc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", flexShrink: 0 }}>🎓</div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#ecf1ff" }}>Ingeniería en Sistemas de Información</h3>
                  <p style={{ marginTop: ".3rem", color: "#a5b4fc", fontWeight: 700 }}>Universidad Técnica de Babahoyo</p>
                  <p style={{ marginTop: ".2rem", color: "#64748b", fontSize: ".88rem" }}>Ecuador · Graduado</p>
                </div>
              </div>
            </Card3D>
          </Reveal>
          <div style={{ marginTop: "1.4rem", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1rem" }}>
            <Reveal delay={120}>
              <Card3D>
                <div style={{ border: "1px solid rgba(99,102,241,0.15)", borderRadius: "1rem", background: "rgba(19,28,49,0.6)", backdropFilter: "blur(12px)", padding: "1.4rem 1.6rem" }}>
                  <p style={{ color: "#a5b4fc", fontSize: ".68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".13em", marginBottom: ".8rem" }}>🌐 Idiomas</p>
                  <p style={{ color: "#a5b1c9", fontSize: ".9rem", lineHeight: 1.7 }}><strong style={{ color: "#ecf1ff" }}>Español:</strong> Nativo<br /><strong style={{ color: "#ecf1ff" }}>Inglés:</strong> Básico · en proceso de mejora</p>
                </div>
              </Card3D>
            </Reveal>
            <Reveal delay={160}>
              <Card3D>
                <div style={{ border: "1px solid rgba(99,102,241,0.15)", borderRadius: "1rem", background: "rgba(19,28,49,0.6)", backdropFilter: "blur(12px)", padding: "1.4rem 1.6rem" }}>
                  <p style={{ color: "#a5b4fc", fontSize: ".68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".13em", marginBottom: ".8rem" }}>📍 Disponibilidad</p>
                  <p style={{ color: "#a5b1c9", fontSize: ".9rem", lineHeight: 1.7 }}>✓ Trabajo presencial<br />✓ Trabajo remoto<br />✓ Oportunidades nacionales e internacionales</p>
                </div>
              </Card3D>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10" style={{ padding: "6rem 1.5rem", textAlign: "center" }}>
        <Reveal>
          <p style={{ color: "#a5b4fc", fontSize: ".72rem", fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase" }}>¿Conversamos?</p>
          <h2 style={{ marginTop: ".6rem", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 900, letterSpacing: "-.04em", color: "#ecf1ff" }}>Listo para el próximo reto.</h2>
          <p style={{ marginTop: ".8rem", color: "#64748b", fontSize: "1rem", maxWidth: 480, margin: ".8rem auto 0" }}>Para oportunidades profesionales, colaboraciones o una conversación técnica.</p>
          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: ".8rem" }}>
            <a href="mailto:moises.solis125@gmail.com"
              style={{ display: "inline-flex", alignItems: "center", gap: ".45rem", borderRadius: ".7rem", padding: ".78rem 1.4rem", fontWeight: 700, fontSize: ".92rem", background: "#6366f1", color: "#fff", boxShadow: "0 8px 24px rgba(99,102,241,0.35)", transition: "transform .2s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
            >✉ Escribirme →</a>
            <a href="https://www.linkedin.com/in/moi-solis-nicola-64b87a401/" target="_blank" rel="noreferrer" style={BTN_SEC}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = "rgba(99,102,241,0.18)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(99,102,241,0.08)"; }}
            >in LinkedIn ↗</a>
            <a href="https://github.com/msolisni" target="_blank" rel="noreferrer" style={BTN_SEC}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = "rgba(99,102,241,0.18)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(99,102,241,0.08)"; }}
            >⌥ GitHub ↗</a>
          </div>
          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(99,102,241,0.15)", color: "#293653", fontSize: ".82rem" }}>
            <a href="/" style={{ color: "#6366f1", fontWeight: 700, transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#a5b4fc")}
              onMouseLeave={e => (e.currentTarget.style.color = "#6366f1")}
            >← Volver al portafolio</a>
            <span style={{ margin: "0 1rem" }}>·</span>
            © {new Date().getFullYear()} Moisés Asbel Solis
          </div>
        </Reveal>
      </section>

      <style>{`
        @keyframes floatA { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.05)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(18px) scale(0.97)} }
        @keyframes pulse3d { 0%,100%{box-shadow:0 0 40px rgba(99,102,241,0.5),0 0 80px rgba(99,102,241,0.2)} 50%{box-shadow:0 0 60px rgba(99,102,241,0.7),0 0 120px rgba(99,102,241,0.3)} }
        @keyframes scrollCue { 0%,100%{opacity:1;transform:scaleY(1) translateY(0)} 50%{opacity:0.3;transform:scaleY(0.6) translateY(4px)} }
      `}</style>
    </div>
  );
}
