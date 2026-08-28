"use client";
import { useEffect, useRef, useState } from "react";

/* ─── Types ─── */
type Project = {
  id: number;
  category: string;
  title: string;
  description: string;
  tags: string[];
  icon: string;
  color: string;
  status: "Privado" | "En preparación" | "Público";
  year: string;
  demoUrl?: string;
  githubUrl?: string;
  architecture: string[];
};

/* ─── Data ─── */
const allProjects: Project[] = [
  {
    id: 1,
    category: "IA Aplicada",
    title: "Asistente Tributario con IA",
    description: "Solución orientada a consultas tributarias utilizando RAG, PostgreSQL/PGVector, procesamiento de documentos, embeddings, automatización con n8n e integración con Telegram.",
    tags: ["Python", "RAG", "PGVector", "n8n", "Telegram", "FastAPI"],
    icon: "🧠",
    color: "#6366f1",
    status: "Privado",
    year: "2025",
    architecture: ["Ingesta de documentos", "Embeddings + PGVector", "RAG Query Engine", "n8n Orquestador", "Telegram Bot"],
  },
  {
    id: 2,
    category: "Automatización",
    title: "Arquitectura RAG & Workflows",
    description: "Flujos automatizados para ingestión, procesamiento, fragmentación, generación de embeddings y almacenamiento vectorial de documentos empresariales.",
    tags: ["n8n", "Embeddings", "Python", "PostgreSQL", "Webhooks"],
    icon: "⚙️",
    color: "#8b5cf6",
    status: "Privado",
    year: "2025",
    architecture: ["Fuentes de datos", "Fragmentación", "Embeddings", "Vector Store", "API"],
  },
  {
    id: 3,
    category: "Ingeniería de Datos",
    title: "Pipeline ETL Empresarial",
    description: "Procesos en Python para limpieza, transformación e importación de grandes conjuntos de datos hacia PostgreSQL con validación y monitoreo.",
    tags: ["Python", "ETL", "Pandas", "PostgreSQL", "SQLite"],
    icon: "📊",
    color: "#0ea5e9",
    status: "En preparación",
    year: "2024",
    architecture: ["Extracción", "Transformación", "Validación", "Carga", "Monitoreo"],
  },
  {
    id: 4,
    category: "Desarrollo de Software",
    title: "Sistemas de Información .NET",
    description: "Diseño y desarrollo de aplicaciones empresariales utilizando C#, .NET, ASP.NET Core, MVC, Blazor y bases de datos relacionales.",
    tags: ["C#", ".NET", "ASP.NET Core", "Blazor", "SQL Server"],
    icon: "🔧",
    color: "#10b981",
    status: "Privado",
    year: "2024",
    architecture: ["UI Blazor", "API REST", "Business Logic", "SQL Server", "Docker"],
  },
  {
    id: 5,
    category: "Automatización",
    title: "Workflows con n8n",
    description: "Diseño de workflows para integración de servicios, procesamiento de información, APIs, bases de datos, documentos y servicios de IA.",
    tags: ["n8n", "APIs", "Webhooks", "IA", "Docker"],
    icon: "🤖",
    color: "#f59e0b",
    status: "En preparación",
    year: "2025",
    architecture: ["Triggers", "Procesamiento", "Integraciones API", "Base de datos", "Notificaciones"],
  },
  {
    id: 6,
    category: "IA Aplicada",
    title: "MCP Server & AI Agents",
    description: "Servidor MCP personalizado con FastMCP para integrar LLMs locales (Ollama) con flujos de n8n, bases de datos y herramientas de automatización.",
    tags: ["Python", "MCP", "Ollama", "FastMCP", "n8n"],
    icon: "🚀",
    color: "#ec4899",
    status: "En preparación",
    year: "2025",
    architecture: ["FastMCP Server", "Ollama LLM", "Tool Registry", "n8n Bridge", "PostgreSQL"],
  },
];

const categories = ["Todos", "IA Aplicada", "Automatización", "Ingeniería de Datos", "Desarrollo de Software"];

/* ─── Particle canvas ─── */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    const ps: P[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
      r: Math.random() * 1.8 + .4, a: Math.random() * .4 + .1,
    }));
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ps.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129,140,248,${p.a})`; ctx.fill();
      });
      for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
        const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${.1 * (1 - d / 110)})`; ctx.lineWidth = .8; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", opacity:.6 }} />;
}

/* ─── 3D Card ─── */
function Card3D({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  function onMove(e: React.MouseEvent) {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - .5) * 16;
    const y = ((e.clientY - r.top) / r.height - .5) * -16;
    el.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) scale(1.03)`;
  }
  function onLeave() { if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) scale(1)"; }
  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ transition:"transform .4s cubic-bezier(.22,1,.36,1)", transformStyle:"preserve-3d" }}>
      {children}
    </div>
  );
}

/* ─── Reveal ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: .1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, v };
}
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, v } = useReveal();
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(28px)", transition: `opacity .65s ease ${delay}ms, transform .65s cubic-bezier(.22,1,.36,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── Project card ─── */
function ProjectCard({ p, index }: { p: Project; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const statusColor: Record<string, string> = {
    Público: "#10b981", "En preparación": "#f59e0b", Privado: "#6b7280",
  };
  return (
    <Reveal delay={index * 70}>
      <Card3D className="h-full">
        <div
          onClick={() => setExpanded(!expanded)}
          style={{
            height:"100%", border:"1px solid rgba(99,102,241,0.2)", borderRadius:"1.25rem",
            background:"rgba(14,20,38,0.85)", backdropFilter:"blur(20px)",
            display:"flex", flexDirection:"column", overflow:"hidden",
            cursor:"pointer", transition:"border-color .3s, box-shadow .3s",
            boxShadow: expanded ? `0 0 40px ${p.color}33, 0 20px 60px rgba(0,0,0,0.4)` : "0 4px 20px rgba(0,0,0,0.3)",
            borderColor: expanded ? `${p.color}55` : "rgba(99,102,241,0.2)",
          }}>
          {/* Top gradient bar */}
          <div style={{ height:3, background:`linear-gradient(90deg, ${p.color}, ${p.color}88, transparent)` }} />

          {/* Header */}
          <div style={{ padding:"1.5rem 1.5rem 1rem", display:"flex", alignItems:"flex-start", gap:"1rem" }}>
            <div style={{ width:52, height:52, borderRadius:"1rem", background:`${p.color}22`, border:`1px solid ${p.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem", flexShrink:0 }}>
              {p.icon}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:".5rem", marginBottom:".3rem", flexWrap:"wrap" }}>
                <span style={{ fontSize:".65rem", fontWeight:800, textTransform:"uppercase", letterSpacing:".12em", color:p.color }}>{p.category}</span>
                <span style={{ fontSize:".65rem", color:"#475569" }}>·</span>
                <span style={{ fontSize:".65rem", color:"#475569", fontWeight:600 }}>{p.year}</span>
              </div>
              <h3 style={{ fontSize:"1.05rem", fontWeight:800, color:"#f0f4ff", letterSpacing:"-.02em", lineHeight:1.2 }}>{p.title}</h3>
            </div>
            <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:".4rem" }}>
              <span style={{ border:`1px solid ${statusColor[p.status]}44`, borderRadius:999, padding:".15rem .55rem", fontSize:".62rem", fontWeight:700, color:statusColor[p.status], background:`${statusColor[p.status]}11` }}>
                {p.status}
              </span>
              <span style={{ color:"#475569", fontSize:"1.1rem", transition:"transform .3s", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
            </div>
          </div>

          {/* Description */}
          <div style={{ padding:"0 1.5rem", flex:1 }}>
            <p style={{ fontSize:".88rem", lineHeight:1.7, color:"#8b9ac4" }}>{p.description}</p>
          </div>

          {/* Tags */}
          <div style={{ padding:"1rem 1.5rem", display:"flex", flexWrap:"wrap", gap:".4rem" }}>
            {p.tags.map(t => (
              <span key={t} style={{ border:`1px solid ${p.color}33`, borderRadius:999, padding:".22rem .6rem", fontSize:".7rem", fontWeight:600, color:p.color, background:`${p.color}11` }}>{t}</span>
            ))}
          </div>

          {/* Expanded: Architecture */}
          {expanded && (
            <div style={{ padding:"0 1.5rem 1.5rem", borderTop:"1px solid rgba(99,102,241,0.15)", marginTop:".5rem", paddingTop:"1rem" }}>
              <p style={{ fontSize:".68rem", fontWeight:800, textTransform:"uppercase", letterSpacing:".12em", color:"#475569", marginBottom:".75rem" }}>Arquitectura</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:".5rem", alignItems:"center" }}>
                {p.architecture.map((a, i) => (
                  <span key={a} style={{ display:"flex", alignItems:"center", gap:".4rem" }}>
                    <span style={{ background:`${p.color}22`, border:`1px solid ${p.color}44`, borderRadius:".5rem", padding:".3rem .7rem", fontSize:".78rem", fontWeight:600, color:p.color }}>{a}</span>
                    {i < p.architecture.length - 1 && <span style={{ color:"#334155", fontSize:".9rem" }}>→</span>}
                  </span>
                ))}
              </div>
              {(p.demoUrl || p.githubUrl) && (
                <div style={{ marginTop:"1rem", display:"flex", gap:".75rem" }}>
                  {p.demoUrl && <a href={p.demoUrl} onClick={e => e.stopPropagation()} style={{ fontSize:".82rem", fontWeight:700, color:p.color, border:`1px solid ${p.color}44`, borderRadius:".6rem", padding:".4rem .9rem", background:`${p.color}11` }}>Demo ↗</a>}
                  {p.githubUrl && <a href={p.githubUrl} onClick={e => e.stopPropagation()} style={{ fontSize:".82rem", fontWeight:700, color:p.color, border:`1px solid ${p.color}44`, borderRadius:".6rem", padding:".4rem .9rem", background:`${p.color}11` }}>GitHub ↗</a>}
                </div>
              )}
            </div>
          )}
        </div>
      </Card3D>
    </Reveal>
  );
}

/* ─── Main ─── */
export default function PortfolioPage() {
  const [selected, setSelected] = useState("Todos");
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const m = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", m);
    return () => window.removeEventListener("mousemove", m);
  }, []);

  const filtered = selected === "Todos" ? allProjects : allProjects.filter(p => p.category === selected);

  return (
    <div style={{ minHeight:"100vh", background:"#06080f", color:"#f0f4ff", fontFamily:"'Inter',Arial,sans-serif", overflowX:"hidden" }}>
      <ParticleCanvas />

      {/* Cursor glow */}
      <div style={{ position:"fixed", zIndex:5, pointerEvents:"none", borderRadius:"50%", width:420, height:420, left:cursor.x-210, top:cursor.y-210, background:"radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)", transition:"left .1s, top .1s" }} />

      {/* Orb decorations */}
      <div style={{ position:"fixed", top:"-10%", right:"-5%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)", filter:"blur(40px)", pointerEvents:"none", animation:"floatA 12s ease-in-out infinite" }} />
      <div style={{ position:"fixed", bottom:"-5%", left:"-8%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(168,85,247,0.09), transparent 70%)", filter:"blur(40px)", pointerEvents:"none", animation:"floatB 9s ease-in-out infinite" }} />

      {/* ── NAV ── */}
      <header style={{ position:"sticky", top:0, zIndex:30, borderBottom:"1px solid rgba(99,102,241,0.15)", background:"rgba(6,8,15,0.85)", backdropFilter:"blur(24px)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <a href="/" style={{ fontWeight:900, fontSize:"1.1rem", letterSpacing:"-.04em", fontFamily:"'Space Grotesk',sans-serif", background:"linear-gradient(135deg,#818cf8,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>MAS.</a>
          <nav style={{ display:"flex", gap:"1.5rem" }}>
            {[["Inicio", "/"], ["CV", "/cv"], ["Contacto", "/#contacto"]].map(([l, h]) => (
              <a key={h} href={h} style={{ color:"#64748b", fontSize:".875rem", fontWeight:500, transition:"color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#818cf8")}
                onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>{l}</a>
            ))}
          </nav>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ position:"relative", zIndex:10, padding:"6rem 1.5rem 4rem", textAlign:"center" }}>
        <Reveal>
          <p style={{ color:"#818cf8", fontSize:".72rem", fontWeight:800, letterSpacing:".18em", textTransform:"uppercase", marginBottom:"1rem" }}>Portafolio · {new Date().getFullYear()}</p>
          <h1 style={{ fontSize:"clamp(2.8rem,7vw,5rem)", fontWeight:900, letterSpacing:"-.06em", lineHeight:.92, fontFamily:"'Space Grotesk',sans-serif", background:"linear-gradient(135deg, #fff 30%, #a5b4fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Proyectos &<br/>Soluciones
          </h1>
          <p style={{ marginTop:"1.5rem", color:"#8b9ac4", fontSize:"1.05rem", lineHeight:1.8, maxWidth:560, margin:"1.5rem auto 0" }}>
            Colección de proyectos que combinan desarrollo de software, datos, automatización e inteligencia artificial. Haz clic en cada card para ver la arquitectura.
          </p>
        </Reveal>

        {/* Stats bar */}
        <Reveal delay={150}>
          <div style={{ marginTop:"2.5rem", display:"inline-flex", gap:"2rem", padding:"1rem 2rem", border:"1px solid rgba(99,102,241,0.2)", borderRadius:"1rem", background:"rgba(14,20,38,0.8)", backdropFilter:"blur(20px)", flexWrap:"wrap", justifyContent:"center" }}>
            {[
              { label: "Proyectos", value: allProjects.length },
              { label: "Tecnologías", value: 18 },
              { label: "Categorías", value: categories.length - 1 },
            ].map(s => (
              <div key={s.label} style={{ textAlign:"center" }}>
                <div style={{ fontSize:"1.8rem", fontWeight:900, fontFamily:"'Space Grotesk',sans-serif", background:"linear-gradient(135deg,#818cf8,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{s.value}+</div>
                <div style={{ fontSize:".72rem", color:"#475569", fontWeight:600, marginTop:".1rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── FILTERS ── */}
      <section style={{ position:"relative", zIndex:10, padding:"0 1.5rem 3rem" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <Reveal>
            <div style={{ display:"flex", flexWrap:"wrap", gap:".6rem", justifyContent:"center" }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelected(cat)}
                  style={{
                    border: selected === cat ? "1px solid #818cf8" : "1px solid rgba(99,102,241,0.2)",
                    borderRadius:999, padding:".5rem 1.1rem", fontSize:".84rem", fontWeight:700,
                    cursor:"pointer", transition:"all .25s",
                    background: selected === cat ? "rgba(129,140,248,0.2)" : "rgba(14,20,38,0.8)",
                    color: selected === cat ? "#a5b4fc" : "#64748b",
                    backdropFilter:"blur(12px)",
                    boxShadow: selected === cat ? "0 0 20px rgba(99,102,241,0.2)" : "none",
                  }}>
                  {cat}
                  {selected === cat && <span style={{ marginLeft:".4rem", fontSize:".72rem" }}>({filtered.length})</span>}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── GRID ── */}
      <section style={{ position:"relative", zIndex:10, padding:"0 1.5rem 6rem" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap:"1.4rem" }}>
            {filtered.map((p, i) => <ProjectCard key={p.id} p={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position:"relative", zIndex:10, padding:"4rem 1.5rem 6rem", textAlign:"center", borderTop:"1px solid rgba(99,102,241,0.15)" }}>
        <Reveal>
          <p style={{ color:"#818cf8", fontSize:".72rem", fontWeight:800, letterSpacing:".15em", textTransform:"uppercase" }}>¿Colaboramos?</p>
          <h2 style={{ marginTop:".8rem", fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:900, letterSpacing:"-.04em", fontFamily:"'Space Grotesk',sans-serif" }}>Listo para el próximo reto.</h2>
          <div style={{ marginTop:"1.8rem", display:"flex", flexWrap:"wrap", gap:".8rem", justifyContent:"center" }}>
            <a href="mailto:moises.solis125@gmail.com"
              style={{ display:"inline-flex", alignItems:"center", gap:".5rem", borderRadius:".8rem", padding:".85rem 1.6rem", fontWeight:700, fontSize:".95rem", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", boxShadow:"0 8px 28px rgba(99,102,241,0.35)", transition:"transform .2s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
              ✉ Escribirme →
            </a>
            <a href="/cv" target="_blank"
              style={{ display:"inline-flex", alignItems:"center", gap:".5rem", borderRadius:".8rem", padding:".85rem 1.6rem", fontWeight:700, fontSize:".95rem", border:"1px solid rgba(99,102,241,0.3)", color:"#818cf8", background:"rgba(99,102,241,0.08)", transition:"transform .2s, background .2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = "rgba(99,102,241,0.18)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(99,102,241,0.08)"; }}>
              Ver CV 3D ↗
            </a>
          </div>
          <div style={{ marginTop:"2.5rem", borderTop:"1px solid rgba(99,102,241,0.12)", paddingTop:"1.5rem" }}>
            <a href="/" style={{ color:"#6366f1", fontWeight:700, fontSize:".88rem", transition:"color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#a5b4fc")}
              onMouseLeave={e => (e.currentTarget.style.color = "#6366f1")}>
              ← Volver al inicio
            </a>
          </div>
        </Reveal>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;700;900&display=swap');
        @keyframes floatA { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-22px) scale(1.04)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(18px) scale(.97)} }
      `}</style>
    </div>
  );
}
