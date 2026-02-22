"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

// ── Brand: Coral #FF6B6B → Purple #A855F7 · Navy bg #0D0B1E ──────────────────
const cn = (...c: (string | undefined | null | false)[]) => c.filter(Boolean).join(" ");

// ── Neural Network SVG Logo (matches actual brand mark) ───────────────────────
function NeuralLogo({ size = 48, animated = false }: { size?: number, animated?: boolean }) {
  // Mimics the zigzag neural network from the logo
  const nodes = [
    { x: 14, y: 6 }, { x: 34, y: 10 },
    { x: 8, y: 22 }, { x: 28, y: 18 }, { x: 44, y: 26 },
    { x: 14, y: 34 }, { x: 34, y: 38 },
    { x: 20, y: 50 },
  ];
  const edges = [[0, 3], [1, 3], [2, 3], [3, 4], [3, 5], [3, 6], [5, 7], [6, 7], [4, 6], [2, 5]];
  return (
    <svg width={size} height={size} viewBox="0 0 52 56" fill="none" overflow="visible">
      <defs>
        <linearGradient id="ng" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {edges.map(([a, b], i) => (
        <motion.line key={i}
          x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="url(#ng)" strokeWidth="1.3" strokeOpacity="0.55"
          initial={animated ? { opacity: 0 } : {}}
          animate={animated ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: animated ? i * 0.1 : 0 }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle key={i} cx={n.x} cy={n.y} r="3.2"
          fill="url(#ng)" filter="url(#glow)"
          initial={animated ? { scale: 0, opacity: 0 } : {}}
          animate={animated ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: animated ? 0.8 + i * 0.07 : 0 }}
        />
      ))}
    </svg>
  );
}

// ── Gradient text ─────────────────────────────────────────────────────────────
function G({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("bg-clip-text text-transparent inline", className)}
      style={{ backgroundImage: "linear-gradient(135deg,#FF6B6B 0%,#FF4757 25%,#C026D3 65%,#A855F7 100%)" }}>
      {children}
    </span>
  );
}

// ── Typewriter ────────────────────────────────────────────────────────────────
function Typewriter({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0);
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[idx];
    const t = setTimeout(() => {
      if (!del) { if (txt.length < w.length) setTxt(w.slice(0, txt.length + 1)); else setTimeout(() => setDel(true), 2200); }
      else { if (txt.length > 0) setTxt(txt.slice(0, -1)); else { setDel(false); setIdx((idx + 1) % words.length); } }
    }, del ? 38 : 80);
    return () => clearTimeout(t);
  }, [txt, del, idx, words]);
  return <G>{txt}<motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.7, repeat: Infinity }}>|</motion.span></G>;
}

// ── Animated counter ──────────────────────────────────────────────────────────
function Count({ to, suf = "", pre = "" }: { to: number, suf?: string, pre?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let c = 0; const s = to / 80;
    const t = setInterval(() => { c = Math.min(c + s, to); setV(Math.floor(c)); if (c >= to) clearInterval(t); }, 20);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{pre}{v}{suf}</span>;
}

// ── Scroll-reveal ─────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 45, className }: { children: React.ReactNode, delay?: number, y?: number, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inV = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y }} animate={inV ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// ── Floating math symbol ──────────────────────────────────────────────────────
function Float({ x, y, delay, txt }: { x: string | number, y: string | number, delay: number, txt: string }) {
  return (
    <motion.div className="absolute font-mono text-xs pointer-events-none select-none"
      style={{ left: x, top: y, color: "rgba(168,85,247,0.22)" }}
      animate={{ y: [0, -28, 0], opacity: [0.18, 0.45, 0.18] }}
      transition={{ duration: 5 + delay, repeat: Infinity, delay, ease: "easeInOut" }}>
      {txt}
    </motion.div>
  );
}

// ── Pill badge ────────────────────────────────────────────────────────────────
function Pill({ children, color = "#A855F7" }: { children: React.ReactNode, color?: string }) {
  return (
    <span className="text-xs font-mono tracking-widest uppercase px-3 py-1.5 rounded-full border inline-flex items-center gap-2 mb-6"
      style={{ borderColor: `${color}40`, color, background: `${color}0f` }}>
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 180]);
  const op = useTransform(scrollY, [0, 500], [1, 0]);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 25 }), sy = useSpring(my, { stiffness: 60, damping: 25 });
  useEffect(() => {
    const fn = (e: MouseEvent) => { mx.set((e.clientX / window.innerWidth - 0.5) * 40); my.set((e.clientY / window.innerHeight - 0.5) * 40); };
    window.addEventListener("mousemove", fn); return () => window.removeEventListener("mousemove", fn);
  }, [mx, my]);

  const particles = [
    { x: "7%", y: "22%", delay: 0, txt: "∇loss" }, { x: "87%", y: "14%", delay: 1, txt: "σ(z)" },
    { x: "4%", y: "63%", delay: 2, txt: "W·X+b" }, { x: "91%", y: "58%", delay: 0.6, txt: "∂J/∂θ" },
    { x: "21%", y: "82%", delay: 1.4, txt: "argmax" }, { x: "77%", y: "74%", delay: 0.9, txt: "P(y|x)" },
    { x: "48%", y: "8%", delay: 1.1, txt: "Σxᵢwᵢ" }, { x: "62%", y: "88%", delay: 0.4, txt: "softmax" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse 90% 70% at 50% 45%,#1d0c3f 0%,#0D0B1E 55%,#060410 100%)" }}>

      {/* Parallax orbs */}
      <motion.div style={{
        x: sx, y: sy,
        background: "radial-gradient(circle,#FF6B6B,transparent 70%)"
      }}
        animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 9, repeat: Infinity }}
        className="absolute left-1/4 top-1/4 w-[650px] h-[650px] rounded-full blur-[150px] opacity-[0.18] pointer-events-none" />
      <motion.div style={{ background: "radial-gradient(circle,#A855F7,transparent 70%)" }}
        animate={{ scale: [1.15, 1, 1.15] }} transition={{ duration: 11, repeat: Infinity }}
        className="absolute right-1/4 bottom-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.18] pointer-events-none" />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: "radial-gradient(rgba(168,85,247,1) 1px,transparent 1px)", backgroundSize: "36px 36px" }} />

      {/* Floating math */}
      {particles.map((p, i) => <Float key={i} {...p} />)}

      <motion.div style={{ y, opacity: op }} className="relative z-10 text-center px-6 max-w-6xl mx-auto pt-24">
        {/* IDRP badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border text-xs font-mono tracking-widest"
          style={{ borderColor: "rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.08)", color: "rgba(168,85,247,0.85)" }}>
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-[#A855F7]" />
          IIIT DHARWAD RESEARCH PARK
        </motion.div>

        {/* Animated logo */}
        <motion.div initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="flex justify-center mb-10">
          <NeuralLogo size={110} animated />
        </motion.div>

        {/* Wordmark */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-6xl sm:text-8xl font-black tracking-tight mb-3"
          style={{ letterSpacing: "-0.04em" }}>
          <span style={{ color: "#FF6B6B" }}>ML</span><span style={{ color: "#A855F7" }}>era</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight text-white mb-6"
          style={{ fontFamily: "'Georgia',serif" }}>
          Machine Learning,{" "}
          <Typewriter words={["Made Intuitive.", "Made Structured.", "Made for You.", "Finally Clear."]} />
        </motion.h1>

        {/* Subtext */}
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          MLera replaces passive video marathons with structured paths, concept-first teaching,
          and a built-in lexicon — so you <em className="text-white/60 not-italic">actually understand</em> ML, not just watch it.
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a href="#cta" whileHover={{ scale: 1.04, boxShadow: "0 0 50px rgba(255,107,107,0.45)" }}
            whileTap={{ scale: 0.97 }}
            className="px-9 py-4 rounded-2xl text-base font-bold text-white cursor-pointer relative overflow-hidden group"
            style={{ background: "linear-gradient(135deg,#FF6B6B,#FF4757 35%,#C026D3,#A855F7)" }}>
            <span className="relative z-10">Start Learning Free →</span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg,#FF4757,#9333EA)" }} />
          </motion.a>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="px-9 py-4 rounded-2xl text-base font-semibold text-white/60 hover:text-white border border-white/10 hover:border-white/25 transition-all">
            Watch Demo ▶
          </motion.button>
        </motion.div>

        {/* Tags */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="mt-12 flex items-center justify-center gap-6 flex-wrap">
          {["Concept-First", "No Passive Videos", "Built-in Lexicon", "Research-Backed"].map((t, i) => (
            <span key={i} className="text-[11px] font-mono text-white/22 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full" style={{ background: `linear-gradient(135deg,#FF6B6B,#A855F7)` }} />
              {t}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to top,#0D0B1E,transparent)" }} />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { to: 40, suf: "+", label: "Structured Modules" },
    { to: 200, suf: "+", label: "Concept Cards" },
    { to: 500, suf: "+", label: "Lexicon Terms" },
    { to: 0, suf: " Passive Videos", label: "100% Active Learning" },
  ];
  return (
    <section className="py-14 border-y"
      style={{ background: "linear-gradient(135deg,rgba(255,107,107,0.07),rgba(168,85,247,0.07))", borderColor: "rgba(255,255,255,0.05)" }}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-black mb-1 bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg,#FF6B6B,#A855F7)" }}>
                <Count to={s.to} suf={s.suf} />
              </div>
              <div className="text-white/30 text-xs font-mono uppercase tracking-widest">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────────────────────────────────────
function About() {
  const items = [
    { bad: true, txt: "Hours of passive video — zero retention" },
    { bad: true, txt: "Disconnected tutorials with no structure" },
    { bad: true, txt: "Jargon dropped with zero explanation" },
    { bad: false, txt: "Sequenced paths built for concept clarity" },
    { bad: false, txt: "Lexicon-integrated — every term in context" },
    { bad: false, txt: "Interactive checkpoints — not passive scrolling" },
  ];
  return (
    <section id="about" className="py-28 px-6" style={{ background: "#0D0B1E" }}>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <Reveal><Pill color="#FF6B6B">The Problem</Pill></Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter mb-8"
              style={{ fontFamily: "'Georgia',serif" }}>
              Learners aren't failing ML.<br /><G>ML platforms</G> are failing learners.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/42 text-lg leading-relaxed mb-5">
              People don't quit Machine Learning because it's too hard. They quit because no one structured it for them.
              YouTube rabbit holes, disconnected MOOCs, and jargon walls destroy motivation before understanding can begin.
            </p>
            <p className="text-white/42 text-lg leading-relaxed">
              MLera is the antidote — structured paths, concepts before code, and a lexicon woven into every lesson.
            </p>
          </Reveal>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}
                className="flex items-center gap-4 px-5 py-4 rounded-xl border transition-all"
                style={{
                  borderColor: item.bad ? "rgba(239,68,68,0.15)" : "rgba(168,85,247,0.22)",
                  background: item.bad ? "rgba(239,68,68,0.04)" : "rgba(168,85,247,0.06)",
                }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={item.bad
                    ? { background: "rgba(239,68,68,0.15)", color: "#f87171" }
                    : { background: "linear-gradient(135deg,#FF6B6B,#A855F7)", color: "white" }}>
                  {item.bad ? "✕" : "✓"}
                </div>
                <span className={cn("text-sm", item.bad ? "text-white/28 line-through" : "text-white/72")}>{item.txt}</span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURES
// ─────────────────────────────────────────────────────────────────────────────
function Features() {
  const feats = [
    { icon: "⬡", title: "Structured Paths", desc: "Every concept sequenced from fundamentals to advanced theory. No random jumping between disconnected resources.", col: "#FF6B6B" },
    { icon: "◎", title: "Built-in Lexicon", desc: "500+ ML terms defined in context. Click any term mid-lesson for instant clarity — without losing your learning flow.", col: "#A855F7" },
    { icon: "▦", title: "Concept Cards", desc: "Bite-sized visual cards replace hour-long lectures. Each card isolates one idea and connects it to the bigger picture.", col: "#FF6B6B" },
    { icon: "→", title: "Interactive Guidance", desc: "Checkpoints, quizzes, and real feedback at every stage — not just a passive progress bar filling up.", col: "#A855F7" },
    { icon: "∇", title: "Intuition First", desc: "Why before what. Intuition before math. Math before code. Always sequenced for genuine, lasting retention.", col: "#FF6B6B" },
    { icon: "↑", title: "Beginner → Expert", desc: "Zero assumptions to rigorous theory. MLera scales with you — no sudden complexity spikes, no frustrating cliff edges.", col: "#A855F7" },
  ];
  return (
    <section id="features" className="py-28 px-6 border-t" style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(168,85,247,0.08) 0%,#0D0B1E 55%)", borderColor: "rgba(255,255,255,0.04)" }}>
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <Pill color="#A855F7">Core Features</Pill>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter mb-20 max-w-3xl"
            style={{ fontFamily: "'Georgia',serif" }}>
            Everything a <G>serious ML learner</G> actually needs.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {feats.map((f, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <motion.div whileHover={{ y: -7, boxShadow: `0 24px 60px ${f.col}18` }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group p-8 rounded-2xl border border-white/5 relative overflow-hidden cursor-default"
                style={{ background: "rgba(255,255,255,0.018)" }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: `radial-gradient(circle at 25% 25%,${f.col}12,transparent 70%)` }} />
                <motion.div whileHover={{ rotate: 12, scale: 1.1 }} transition={{ type: "spring", stiffness: 400 }}
                  className="text-4xl mb-6 inline-block"
                  style={{ color: f.col, filter: `drop-shadow(0 0 10px ${f.col}55)` }}>
                  {f.icon}
                </motion.div>
                <div className="absolute top-6 right-6 w-2 h-2 rounded-full opacity-25 group-hover:opacity-60 transition-opacity"
                  style={{ background: f.col }} />
                <h3 className="text-white font-bold text-lg mb-3 relative z-10 group-hover:text-white transition-colors">{f.title}</h3>
                <p className="text-white/38 text-sm leading-relaxed relative z-10">{f.desc}</p>
                <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg,transparent,${f.col},transparent)` }} />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────────────────────────────────────
function HowItWorks() {
  const [active, setActive] = useState(0);
  const steps = [
    {
      num: "01", title: "Choose Your Path", short: "Curated ML journeys tailored to your goal.",
      desc: "Select from structured paths — ML Foundations, Deep Learning, NLP, Computer Vision. No overwhelming course catalogs. Just clear journeys built around where you want to go.", emoji: "🗺️"
    },
    {
      num: "02", title: "Learn Concept-by-Concept", short: "Sequenced cards. Intuition before math.",
      desc: "Work through bite-sized concept cards in a logical sequence. Each one builds on the last. Stuck on a term? The lexicon opens in-context — no browser tab switching.", emoji: "🧠"
    },
    {
      num: "03", title: "Verify Understanding", short: "Checkpoints before you move forward.",
      desc: "MLera won't let you skip past confusion. Guided questions, mini-challenges, and concept checks verify your grasp before unlocking the next step.", emoji: "✅"
    },
    {
      num: "04", title: "Apply & Build", short: "Guided notebooks. Real datasets.",
      desc: "Move from understanding to implementation with guided notebooks and practical exercises. Track your mastery and earn verifiable module completion.", emoji: "⚡"
    },
  ];
  return (
    <section id="how-it-works" className="py-28 px-6 border-t" style={{ background: "#080614", borderColor: "rgba(255,255,255,0.04)" }}>
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <Pill color="#FF6B6B">How It Works</Pill>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter mb-20 max-w-3xl"
            style={{ fontFamily: "'Georgia',serif" }}>
            From <G>confusion to clarity</G> in four steps.
          </h2>
        </Reveal>
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Steps */}
          <div className="space-y-3">
            {steps.map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <motion.button onClick={() => setActive(i)} whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="w-full text-left p-5 rounded-2xl border transition-all duration-300"
                  style={active === i
                    ? { background: "linear-gradient(135deg,rgba(255,107,107,0.12),rgba(168,85,247,0.12))", borderColor: "rgba(168,85,247,0.35)" }
                    : { background: "rgba(255,255,255,0.01)", borderColor: "rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 transition-all"
                      style={active === i
                        ? { background: "linear-gradient(135deg,#FF6B6B,#A855F7)", color: "white" }
                        : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.25)" }}>
                      {s.num}
                    </div>
                    <div>
                      <div className={cn("font-bold text-sm mb-0.5 transition-colors", active === i ? "text-white" : "text-white/45")}>
                        {s.title}
                      </div>
                      <div className="text-white/25 text-xs">{s.short}</div>
                    </div>
                  </div>
                </motion.button>
              </Reveal>
            ))}
          </div>

          {/* Detail panel */}
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, x: 24, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -24, scale: 0.97 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl p-10 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg,rgba(255,107,107,0.09),rgba(168,85,247,0.09))", border: "1px solid rgba(168,85,247,0.2)" }}>
              <div className="absolute top-0 right-0 w-48 h-48 blur-3xl opacity-25 pointer-events-none"
                style={{ background: "radial-gradient(circle,#A855F7,transparent)" }} />
              <div className="text-6xl mb-6">{steps[active].emoji}</div>
              <div className="text-xs font-mono text-white/25 mb-1">{steps[active].num}</div>
              <h3 className="text-2xl font-black text-white mb-4" style={{ fontFamily: "'Georgia',serif" }}>{steps[active].title}</h3>
              <p className="text-white/50 leading-relaxed mb-8">{steps[active].desc}</p>
              {/* Progress */}
              <div className="flex gap-2">
                {steps.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)}
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{ background: i === active ? "linear-gradient(90deg,#FF6B6B,#A855F7)" : "rgba(255,255,255,0.08)" }} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LEXICON PREVIEW
// ─────────────────────────────────────────────────────────────────────────────
function Lexicon() {
  const [active, setActive] = useState(0);
  const terms = [
    {
      term: "Gradient Descent", cat: "Optimization",
      def: "An iterative algorithm that minimizes a loss function by repeatedly nudging parameters in the direction of steepest descent — the negative gradient.",
      formula: "θ ← θ − α · ∇J(θ)",
      related: ["Learning Rate", "Loss Function", "Backpropagation"]
    },
    {
      term: "Overfitting", cat: "Model Behavior",
      def: "When a model memorizes training data noise instead of learning general patterns — performing brilliantly on training data but poorly on anything new.",
      formula: "train_acc↑↑ · val_acc↓↓",
      related: ["Regularization", "Dropout", "Cross-Validation"]
    },
    {
      term: "Attention Mechanism", cat: "Deep Learning",
      def: "A mechanism that lets models dynamically weight the importance of different input positions when producing each output — the innovation powering Transformers.",
      formula: "Attn(Q,K,V) = softmax(QKᵀ/√dₖ)V",
      related: ["Transformer", "Self-Attention", "BERT"]
    },
    {
      term: "Backpropagation", cat: "Training",
      def: "The algorithm for computing gradients of the loss w.r.t. every parameter by applying the chain rule backward through the computation graph.",
      formula: "∂L/∂W = (∂L/∂a)(∂a/∂W)",
      related: ["Chain Rule", "Gradient Descent", "Forward Pass"]
    },
  ];
  const t = terms[active];
  return (
    <section id="lexicon" className="py-28 px-6 border-t"
      style={{ background: "radial-gradient(ellipse at 50% 100%,rgba(255,107,107,0.07) 0%,#0D0B1E 55%)", borderColor: "rgba(255,255,255,0.04)" }}>
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <Pill color="#A855F7">Built-in Lexicon</Pill>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter mb-4"
            style={{ fontFamily: "'Georgia',serif" }}>
            Every term. <G>Defined in context.</G>
          </h2>
          <p className="text-white/38 mb-16 max-w-xl text-lg">
            500+ terms defined right where you need them. No mid-lesson Googling. No flow interruption.
          </p>
        </Reveal>

        {/* Term tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {terms.map((tm, i) => (
            <motion.button key={i} onClick={() => setActive(i)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
              style={active === i
                ? { background: "linear-gradient(135deg,rgba(255,107,107,0.18),rgba(168,85,247,0.18))", borderColor: "rgba(168,85,247,0.45)", color: "white" }
                : { borderColor: "rgba(255,255,255,0.07)", background: "transparent", color: "rgba(255,255,255,0.32)" }}>
              {tm.term}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.32 }}
            className="rounded-2xl p-8 border relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.018)", borderColor: "rgba(168,85,247,0.15)" }}>
            <div className="absolute top-0 right-0 w-72 h-72 blur-3xl opacity-18 pointer-events-none"
              style={{ background: "radial-gradient(circle,#A855F7,transparent)" }} />
            <div className="grid md:grid-cols-2 gap-10 relative z-10">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest px-2 py-1 rounded mb-4 inline-block"
                  style={{ background: "rgba(168,85,247,0.15)", color: "#A855F7" }}>{t.cat}</span>
                <h3 className="text-white font-black text-3xl mt-3 mb-4" style={{ fontFamily: "'Georgia',serif" }}>{t.term}</h3>
                <p className="text-white/52 leading-relaxed">{t.def}</p>
              </div>
              <div className="space-y-5">
                <div className="rounded-xl p-5 font-mono text-sm"
                  style={{ background: "rgba(255,107,107,0.08)", borderLeft: "3px solid #FF6B6B", color: "#FF9999" }}>
                  {t.formula}
                </div>
                <div>
                  <div className="text-white/22 text-xs font-mono uppercase tracking-widest mb-3">Related Terms</div>
                  <div className="flex flex-wrap gap-2">
                    {t.related.map(r => (
                      <motion.span key={r} whileHover={{ scale: 1.05, color: "white" }}
                        className="text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition-colors"
                        style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.38)" }}>
                        {r}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPARISON
// ─────────────────────────────────────────────────────────────────────────────
function Comparison() {
  const rows = [
    { f: "Structured learning paths", o: false, m: true },
    { f: "Concept-first pedagogy", o: false, m: true },
    { f: "Built-in 500+ term lexicon", o: false, m: true },
    { f: "Zero passive video consumption", o: false, m: true },
    { f: "Interactive guided checkpoints", o: "~", m: true },
    { f: "Beginner → expert progression", o: "~", m: true },
    { f: "IDRP research-backed curriculum", o: false, m: true },
  ];
  return (
    <section className="py-28 px-6 border-t" style={{ background: "#080614", borderColor: "rgba(255,255,255,0.04)" }}>
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <Pill color="#FF6B6B">MLera vs The Rest</Pill>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter mb-16"
            style={{ fontFamily: "'Georgia',serif" }}>
            Not another <G>course platform.</G>
          </h2>
        </Reveal>
        <div className="w-full overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="rounded-2xl overflow-hidden border min-w-[600px]" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <div className="grid grid-cols-3" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="p-4 text-white/22 text-xs font-mono uppercase tracking-widest">Feature</div>
              <div className="p-4 border-l text-center text-white/22 text-xs font-mono uppercase tracking-widest"
                style={{ borderColor: "rgba(255,255,255,0.05)" }}>Others</div>
              <div className="p-4 border-l text-center text-xs font-mono uppercase tracking-widest"
                style={{ borderColor: "rgba(168,85,247,0.2)", background: "rgba(168,85,247,0.07)", color: "#A855F7" }}>
                MLera
              </div>
            </div>
            {rows.map((r, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="grid grid-cols-3 border-t group hover:bg-white/[0.01] transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.03)" }}>
                  <div className="p-4 text-white/45 text-sm group-hover:text-white/65 transition-colors">{r.f}</div>
                  <div className="p-4 border-l flex items-center justify-center" style={{ borderColor: "rgba(255,255,255,0.03)" }}>
                    {r.o === true ? <span className="text-white/30">✓</span>
                      : r.o === "~" ? <span className="text-yellow-500/40 text-lg">◐</span>
                        : <span className="text-red-400/35 text-sm">✕</span>}
                  </div>
                  <div className="p-4 border-l flex items-center justify-center"
                    style={{ borderColor: "rgba(168,85,247,0.1)", background: "rgba(168,85,247,0.03)" }}>
                    <span className="font-bold text-transparent bg-clip-text"
                      style={{ backgroundImage: "linear-gradient(135deg,#FF6B6B,#A855F7)" }}>✓</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CTA
// ─────────────────────────────────────────────────────────────────────────────
function CTA() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section id="cta" className="py-32 px-6 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse 85% 85% at 50% 50%,#1d0838 0%,#0D0B1E 65%)" }}>
      <motion.div animate={{ scale: [1, 1.25, 1], rotate: [0, 12, 0] }} transition={{ duration: 13, repeat: Infinity }}
        className="absolute -left-48 top-0 w-[500px] h-[500px] rounded-full blur-[110px] opacity-18 pointer-events-none"
        style={{ background: "#FF6B6B" }} />
      <motion.div animate={{ scale: [1.2, 1, 1.2], rotate: [0, -12, 0] }} transition={{ duration: 11, repeat: Infinity }}
        className="absolute -right-48 bottom-0 w-[450px] h-[450px] rounded-full blur-[100px] opacity-18 pointer-events-none"
        style={{ background: "#A855F7" }} />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <Reveal>
          <div className="flex justify-center mb-8">
            <NeuralLogo size={72} animated />
          </div>
          <div className="text-5xl font-black tracking-tight mb-2">
            <span style={{ color: "#FF6B6B" }}>ML</span><span style={{ color: "#A855F7" }}>era</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter mb-6"
            style={{ fontFamily: "'Georgia',serif" }}>
            Learn ML the <G>right way.</G>
          </h2>
          <p className="text-white/40 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the waitlist for structured, concept-first Machine Learning education — built at IIIT Dharwad Research Park.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          {!done ? (
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input value={email} onChange={e => setEmail(e.target.value)}
                type="email" placeholder="your@email.com"
                className="flex-1 h-14 px-5 rounded-xl border text-white placeholder-white/22 outline-none text-sm font-mono"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.08)" }} />
              <motion.button onClick={() => email && setDone(true)}
                whileHover={{ scale: 1.04, boxShadow: "0 0 35px rgba(168,85,247,0.45)" }}
                whileTap={{ scale: 0.97 }}
                className="h-14 px-8 rounded-xl font-bold text-white whitespace-nowrap"
                style={{ background: "linear-gradient(135deg,#FF6B6B,#A855F7)" }}>
                Join Waitlist →
              </motion.button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white"
              style={{ background: "linear-gradient(135deg,rgba(255,107,107,0.15),rgba(168,85,247,0.15))", border: "1px solid rgba(168,85,247,0.3)" }}>
              <span className="text-2xl">🎉</span> You're on the list — we'll be in touch soon!
            </motion.div>
          )}
          <p className="mt-4 text-white/18 text-xs font-mono">Free · No credit card · IDRP-backed</p>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t py-16 px-6" style={{ background: "#060410", borderColor: "rgba(255,255,255,0.04)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <NeuralLogo size={34} />
              <span className="text-lg font-black" style={{ color: "white" }}>
                <span style={{ color: "#FF6B6B" }}>ML</span><span style={{ color: "#A855F7" }}>era</span>
              </span>
            </div>
            <p className="text-white/22 text-sm max-w-xs leading-relaxed">
              Structured ML education built under IIIT Dharwad Research Park.
              Concept-first. Lexicon-powered. Built for real learners.
            </p>
          </div>
          {[
            { title: "Platform", links: ["Learning Paths", "Lexicon", "Concept Cards", "Progress Tracking"] },
            { title: "Company", links: ["About IDRP", "Research", "Blog", "Contact"] },
          ].map(col => (
            <div key={col.title}>
              <div className="text-white/18 text-xs font-mono uppercase tracking-widest mb-5">{col.title}</div>
              {col.links.map(l => (
                <a key={l} href="#" className="block text-white/30 hover:text-white text-sm py-1.5 transition-colors">{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between gap-4 items-center"
          style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <p className="text-white/15 text-xs font-mono">© 2026 MLera · IIIT Dharwad Research Park</p>
          <div className="flex gap-2">
            {["#FF6B6B", "#C026D3", "#A855F7"].map((c, i) => (
              <div key={i} className="w-2 h-2 rounded-full" style={{ background: c, opacity: 0.35 }} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: "#0D0B1E", color: "white" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');
        html{scroll-behavior:smooth;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:#060410;}
        ::-webkit-scrollbar-thumb{background:linear-gradient(#FF6B6B,#A855F7);border-radius:2px;}
        ::selection{background:rgba(168,85,247,0.3);color:white;}
      `}</style>
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Features />
      <HowItWorks />
      <Lexicon />
      <Comparison />
      <CTA />
      <Footer />
    </div>
  );
}
