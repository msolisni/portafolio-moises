"use client";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";

const links = {
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/in/moi-solis-nicola-64b87a401/",
  github: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/msolisni",
  email: process.env.NEXT_PUBLIC_EMAIL || "moises.solis125@gmail.com",
};

/* ── Orb background ── */
function OrbBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div style={{ position:"absolute", top:"-10%", right:"-5%", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)", animation:"float-slow 12s ease-in-out infinite", filter:"blur(1px)" }} />
      <div style={{ position:"absolute", bottom:"-5%", left:"-8%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)", animation:"float-fast 9s ease-in-out infinite" }} />
      <div style={{ position:"absolute", top:"40%", left:"50%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)", animation:"float-slow 15s ease-in-out infinite reverse" }} />
    </div>
  );
}

/* ── 3D tilt card ── */
function Card3D({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  function onMove(e: React.MouseEvent) {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -14;
    el.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) scale(1.025)`;
  }
  function onLeave() { if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) scale(1)"; }
  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ transition:"transform 0.4s cubic-bezier(.22,1,.36,1)", transformStyle:"preserve-3d" }}>
      {children}
    </div>
  );
}

/* ── Scroll reveal ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, v };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, v } = useReveal();
  return (
    <div ref={ref} className={className}
      style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0) rotateX(0)" : "translateY(32px) rotateX(6deg)", transition: `opacity .7s ease ${delay}ms, transform .7s cubic-bezier(.22,1,.36,1) ${delay}ms`, transformStyle:"preserve-3d" }}>
      {children}
    </div>
  );
}

/* ── Animated counter ── */
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, v } = useReveal();
  useEffect(() => {
    if (!v) return;
    let start = 0;
    const step = end / 60;
    const id = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(id); } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [v, end]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const skills = [
  { label: "Desarrollo", icon: "⚡", items: "C#, .NET, ASP.NET Core, Python, PHP" },
  { label: "Bases de datos", icon: "🗄️", items: "PostgreSQL, SQL Server, SQLite, PGVector" },
  { label: "Automatización", icon: "🤖", items: "n8n, Docker, APIs REST, Webhooks" },
  { label: "Inteligencia Artificial", icon: "🧠", items: "RAG, Embeddings, MCP, Ollama, LLMs" },
];

const stats = [
  { label: "Proyectos", value: 10, suffix: "+" },
  { label: "Tecnologías", value: 18, suffix: "+" },
  { label: "Disponibilidad", value: 100, suffix: "%" },
];

export default function Home() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-theme");
    const isDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("portfolio-theme", next ? "dark" : "light");
  }

  const navItems: [string, string][] = [
    ["Inicio", "#inicio"], ["Sobre mí", "#sobre-mi"], ["Proyectos", "#proyectos"],
    ["Portafolio", "/portfolio"], ["Habilidades", "#habilidades"], ["Contacto", "#contacto"],
  ];

  return (
    <main>
      {/* Cursor glow */}
      <div className="pointer-events-none fixed z-50 rounded-full"
        style={{ width:380, height:380, left:cursorPos.x-190, top:cursorPos.y-190, background:"radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)", transition:"left .1s, top .1s", pointerEvents:"none" }} />

      <OrbBackground />

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color:var(--background)]/80 backdrop-blur-2xl">
        <div className="shell flex h-16 items-center justify-between">
          <a href="#inicio" style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:900, fontSize:"1.15rem", letterSpacing:"-.04em" }}>
            MAS<span className="gradient-text">.</span>
          </a>
          <nav className="desktop-nav flex items-center gap-6">
            {navItems.map(([label, href]) =>
              href.startsWith("/") ? (
                <a key={href} href={href} className="nav-link">{label}</a>
              ) : (
                <a key={href} href={href} className="nav-link">{label}</a>
              )
            )}
          </nav>
          <div className="flex items-center gap-2">
            <button className="button button-secondary !px-3 !py-2" onClick={toggleTheme}>{dark ? "☀" : "◐"}</button>
            <button className="button button-secondary !px-3 !py-2 md:hidden" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          </div>
        </div>
        {menuOpen && (
          <nav className="shell flex flex-col gap-3 border-t border-[var(--line)] py-4 md:hidden">
            {navItems.map(([label, href]) => (
              <a onClick={() => setMenuOpen(false)} key={href} href={href} className="nav-link">{label}</a>
            ))}
          </nav>
        )}
      </header>

      {/* ── HERO ── */}
      <section id="inicio" className="relative z-10 overflow-hidden">
        <div className="shell relative grid min-h-[calc(100vh-4rem)] items-center gap-12 py-24 lg:grid-cols-[1.3fr_.7fr]">
          <div>
            <Reveal>
              <p className="eyebrow">Ingeniero en Sistemas de Información · Ecuador</p>
              <h1 style={{ marginTop:"1.2rem", fontSize:"clamp(2.8rem,6.5vw,5.2rem)", fontWeight:900, letterSpacing:"-.06em", lineHeight:.93, fontFamily:"'Space Grotesk',sans-serif" }}>
                Construyo software<br/>
                <span className="gradient-text">y soluciones de datos</span><br/>
                que resuelven problemas reales.
              </h1>
              <p style={{ marginTop:"1.5rem", maxWidth:"38rem", color:"var(--muted)", fontSize:"1.08rem", lineHeight:1.8 }}>
                Moisés Asbel Solis combina desarrollo de software, bases de datos, automatización e inteligencia artificial para crear soluciones claras, mantenibles y orientadas a resultados.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="/portfolio" className="button button-primary">Ver portafolio <span>→</span></a>
                <a href="#proyectos" className="button button-secondary">Proyectos <span>↓</span></a>
                <a href="/cv" className="button button-secondary" target="_blank" rel="noreferrer">Ver CV <span>↗</span></a>
              </div>
              <div className="mt-8 flex flex-wrap gap-5 text-sm font-semibold" style={{ color:"var(--muted)" }}>
                <a className="hover:text-[var(--accent)] transition-colors" href={links.linkedin} target="_blank">LinkedIn ↗</a>
                <a className="hover:text-[var(--accent)] transition-colors" href={links.github} target="_blank">GitHub ↗</a>
              </div>
            </Reveal>
          </div>

          {/* Hero card 3D */}
          <Reveal delay={150}>
            <Card3D>
              <div className="card border-glow relative overflow-hidden p-7"
                style={{ background:"var(--surface)", boxShadow:"var(--shadow-lg)" }}>
                {/* Gradient top bar */}
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"var(--gradient)" }} />
                {/* Glow orb in corner */}
                <div style={{ position:"absolute", top:"-30px", right:"-30px", width:140, height:140, borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)" }} />

                <p className="eyebrow relative">Enfoque profesional</p>
                <div className="relative mt-6 space-y-4">
                  {[
                    { label: "Aplicaciones web robustas", icon: "🔧" },
                    { label: "Datos conectados y confiables", icon: "📊" },
                    { label: "Automatización de procesos", icon: "⚙️" },
                    { label: "IA aplicada con criterio", icon: "🧠" },
                  ].map((item, i) => (
                    <div key={item.label} className="flex items-center gap-4"
                      style={{ padding:".75rem 1rem", borderRadius:".75rem", background:"var(--glow2)", border:"1px solid var(--line)", animation:`bounce-in .5s ease ${i * 100 + 200}ms both` }}>
                      <span style={{ fontSize:"1.1rem" }}>{item.icon}</span>
                      <span style={{ fontWeight:700, fontSize:".9rem" }}>{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="relative mt-6 grid grid-cols-3 gap-3 border-t pt-5" style={{ borderColor:"var(--line)" }}>
                  {stats.map(s => (
                    <div key={s.label} className="text-center">
                      <div style={{ fontSize:"1.5rem", fontWeight:900, fontFamily:"'Space Grotesk',sans-serif" }} className="gradient-text">
                        <Counter end={s.value} suffix={s.suffix} />
                      </div>
                      <div style={{ fontSize:".72rem", color:"var(--muted)", fontWeight:600, marginTop:".2rem" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card3D>
          </Reveal>
        </div>
      </section>

      {/* ── SOBRE MÍ ── */}
      <section id="sobre-mi" className="section relative z-10" style={{ background:"var(--gradient-subtle)", borderTop:"1px solid var(--line)", borderBottom:"1px solid var(--line)" }}>
        <div className="shell grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">Sobre mí</p>
            <h2 className="section-title">Tecnología con propósito.</h2>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              <p className="section-copy !mt-0">
                Soy Moisés Asbel Solis, Ingeniero en Sistemas de Información graduado de la <strong>Universidad Técnica de Babahoyo</strong>. Me interesa diseñar soluciones que conecten una buena experiencia de uso con una arquitectura responsable.
              </p>
              <p className="section-copy">
                Desde aplicaciones .NET hasta arquitecturas RAG con embeddings vectoriales y flujos automatizados en n8n — trabajo con criterio técnico y visión de producto.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Ecuador 🇪🇨", "Disponible · Presencial & Remoto", "Graduado UTB"].map(t => (
                  <span key={t} className="tag" style={{ background:"var(--surface)", border:"1px solid var(--accent)", color:"var(--accent)" }}>{t}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PROYECTOS ── */}
      <section id="proyectos" className="section relative z-10">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">Proyectos seleccionados</p>
            <h2 className="section-title">Trabajo que explica el porqué,<br/>no solo el resultado.</h2>
            <p className="section-copy">Cada proyecto muestra arquitectura, decisiones y tecnología — sin exponer código propietario.</p>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {projects.map((project, index) => (
              <Reveal key={project.title} delay={index * 100}>
                <Card3D className="h-full">
                  <article className="card border-glow h-full overflow-hidden">
                    {/* Visual banner */}
                    <div className="project-visual relative p-5" style={{ minHeight:"11rem" }}>
                      <div style={{ position:"absolute", inset:0, background:"var(--gradient-subtle)" }} />
                      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:80, height:80, borderRadius:"50%", background:"var(--gradient)", opacity:.15, filter:"blur(20px)" }} />
                      <span style={{ position:"relative", zIndex:1, display:"inline-block", borderRadius:999, border:"1px solid rgba(99,102,241,0.4)", background:"rgba(99,102,241,0.1)", padding:".25rem .75rem", fontSize:".72rem", fontWeight:800, color:"var(--accent)" }}>
                        0{index + 1}
                      </span>
                      <div style={{ position:"absolute", bottom:"1.2rem", left:"1.2rem", zIndex:1, fontSize:".82rem", fontWeight:600, color:"var(--muted)" }}>{project.imageLabel}</div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p style={{ fontSize:".68rem", fontWeight:800, textTransform:"uppercase", letterSpacing:".12em", color:"var(--accent)" }}>{project.category}</p>
                          <h3 style={{ marginTop:".4rem", fontSize:"1.15rem", fontWeight:800, letterSpacing:"-.03em" }}>{project.title}</h3>
                        </div>
                        <span style={{ flexShrink:0, border:"1px solid var(--line)", borderRadius:999, padding:".2rem .55rem", fontSize:".62rem", fontWeight:700, color:"var(--muted)" }}>{project.visibility}</span>
                      </div>
                      <p style={{ marginTop:".9rem", fontSize:".9rem", lineHeight:1.7, color:"var(--muted)" }}>{project.description}</p>

                      <div className="mt-5">
                        <p style={{ fontSize:".68rem", fontWeight:800, textTransform:"uppercase", letterSpacing:".1em", color:"var(--muted)", marginBottom:".5rem" }}>Arquitectura</p>
                        <div className="flex flex-wrap gap-2">
                          {project.architecture.map(item => <span className="architecture-step" key={item}>{item}</span>)}
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.technologies.map(tech => <span key={tech} className="tag">{tech}</span>)}
                      </div>
                      {(project.demoUrl || project.githubUrl) && (
                        <div className="mt-5 flex gap-4 text-sm font-bold" style={{ color:"var(--accent)" }}>
                          {project.demoUrl && <a href={project.demoUrl} className="hover:underline">Demo ↗</a>}
                          {project.githubUrl && <a href={project.githubUrl} className="hover:underline">GitHub ↗</a>}
                        </div>
                      )}
                    </div>
                  </article>
                </Card3D>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-10 text-center">
              <a href="/portfolio" className="button button-primary" style={{ fontSize:"1rem", padding:"1rem 2rem" }}>
                Ver portafolio completo <span>→</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── HABILIDADES ── */}
      <section id="habilidades" className="section relative z-10" style={{ background:"var(--gradient-subtle)", borderTop:"1px solid var(--line)", borderBottom:"1px solid var(--line)" }}>
        <div className="shell">
          <Reveal>
            <p className="eyebrow">Stack técnico</p>
            <h2 className="section-title">Un perfil que conecta producto,<br/>datos e infraestructura.</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {skills.map((skill, i) => (
              <Reveal key={skill.label} delay={i * 80}>
                <Card3D>
                  <div className="card border-glow p-6 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <span style={{ fontSize:"1.5rem" }}>{skill.icon}</span>
                      <h3 style={{ fontWeight:800, fontSize:"1.05rem", letterSpacing:"-.02em" }}>{skill.label}</h3>
                    </div>
                    <p style={{ color:"var(--muted)", lineHeight:1.7, fontSize:".92rem" }}>{skill.items}</p>
                  </div>
                </Card3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CV CTA ── */}
      <section id="cv" className="section relative z-10">
        <div className="shell">
          <Reveal>
            <Card3D>
              <div className="card border-glow relative overflow-hidden p-10 md:p-14"
                style={{ background:"linear-gradient(135deg, #0f1729 0%, #1a1060 50%, #0f1729 100%)", border:"1px solid rgba(99,102,241,0.3)" }}>
                <div style={{ position:"absolute", top:"-60px", right:"-60px", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)", filter:"blur(20px)" }} />
                <div style={{ position:"absolute", bottom:"-40px", left:"-40px", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)", filter:"blur(20px)" }} />
                <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p style={{ fontSize:".72rem", fontWeight:800, letterSpacing:".15em", textTransform:"uppercase", color:"#a5b4fc" }}>Currículum Vitae</p>
                    <h2 style={{ marginTop:".75rem", fontSize:"clamp(1.6rem,3.5vw,2.6rem)", fontWeight:900, letterSpacing:"-.04em", color:"#fff", fontFamily:"'Space Grotesk',sans-serif" }}>
                      ¿Quieres conocer mi experiencia en detalle?
                    </h2>
                    <p style={{ marginTop:".75rem", color:"rgba(165,180,252,.8)", lineHeight:1.7 }}>Una página interactiva 3D con todo mi perfil profesional, habilidades y proyectos.</p>
                  </div>
                  <a href="/cv" target="_blank" rel="noreferrer"
                    className="button"
                    style={{ background:"linear-gradient(135deg,#818cf8,#a78bfa)", color:"#fff", fontSize:"1rem", padding:"1rem 1.8rem", boxShadow:"0 8px 32px rgba(99,102,241,0.4)", whiteSpace:"nowrap" }}>
                    Ver CV 3D →
                  </a>
                </div>
              </div>
            </Card3D>
          </Reveal>
        </div>
      </section>

      {/* ── CONTACTO ── */}
      <section id="contacto" className="section relative z-10" style={{ borderTop:"1px solid var(--line)" }}>
        <div className="shell text-center">
          <Reveal>
            <p className="eyebrow" style={{ justifyContent:"center" }}>Contacto</p>
            <h2 className="section-title mx-auto max-w-3xl">Conversemos sobre el próximo reto.</h2>
            <p className="section-copy mx-auto">Para oportunidades profesionales, colaboraciones o una conversación técnica.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={`mailto:${links.email}`} className="button button-primary">✉ Escribirme →</a>
              <a href={links.linkedin} className="button button-secondary" target="_blank">LinkedIn ↗</a>
              <a href={links.github} className="button button-secondary" target="_blank">GitHub ↗</a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] py-7 relative z-10">
        <div className="shell flex flex-col justify-between gap-2 text-sm sm:flex-row" style={{ color:"var(--muted)" }}>
          <span>© {new Date().getFullYear()} Moisés Asbel Solis.</span>
          <span>Diseñado para comunicar trabajo, sin exponer información sensible.</span>
        </div>
      </footer>

      <style>{`
        @keyframes float-slow { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-24px) scale(1.04)} }
        @keyframes float-fast { 0%,100%{transform:translateY(0)} 50%{transform:translateY(18px)} }
        @keyframes bounce-in { 0%{transform:scale(0.85) translateY(12px);opacity:0} 60%{transform:scale(1.02)} 100%{transform:scale(1);opacity:1} }
        @keyframes gradient-shift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        .gradient-text { background: linear-gradient(135deg,#4f46e5,#7c3aed,#a855f7); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        :root.dark .gradient-text { background: linear-gradient(135deg,#818cf8,#a78bfa,#c4b5fd); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .border-glow { position:relative; }
        .border-glow::before { content:''; position:absolute; inset:-1px; border-radius:inherit; padding:1px; background:linear-gradient(135deg,#4f46e5,#7c3aed,#a855f7); -webkit-mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite:xor; mask-composite:exclude; opacity:0; transition:opacity .3s; }
        .border-glow:hover::before { opacity:1; }
        .gradient-subtle { background: linear-gradient(135deg, rgba(79,70,229,0.06), rgba(168,85,247,0.04)); }
      `}</style>
    </main>
  );
}
