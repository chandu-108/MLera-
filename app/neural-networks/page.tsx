"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const C = {
    coral: "#FF6B6B", purple: "#A855F7", navy: "#0D0B1E", dark: "#080614",
    teal: "#2DD4BF", amber: "#FBBF24", green: "#4ADE80",
    card: "rgba(255,255,255,0.028)", border: "rgba(255,255,255,0.07)",
};
const sigmoid = x => 1 / (1 + Math.exp(-x));
const relu = x => Math.max(0, x);
const tanh = x => Math.tanh(x);

function G({ children, from = C.coral, to = C.purple }) {
    return <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}>{children}</span>;
}
function Reveal({ children, delay = 0, y = 40, className }) {
    const ref = useRef(null);
    const inV = useInView(ref, { once: true, margin: "-50px" });
    return (
        <motion.div ref={ref} className={className} initial={{ opacity: 0, y }}
            animate={inV ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}>
            {children}
        </motion.div>
    );
}
function NeuralLogo({ size = 32 }) {
    const nodes = [{ x: 14, y: 6 }, { x: 34, y: 10 }, { x: 8, y: 22 }, { x: 28, y: 18 }, { x: 44, y: 26 }, { x: 14, y: 34 }, { x: 34, y: 38 }, { x: 20, y: 50 }];
    const edges = [[0, 3], [1, 3], [2, 3], [3, 4], [3, 5], [3, 6], [5, 7], [6, 7], [4, 6]];
    return (
        <svg width={size} height={size} viewBox="0 0 52 56" fill="none" overflow="visible">
            <defs>
                <linearGradient id="nlg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={C.coral} /><stop offset="100%" stopColor={C.purple} />
                </linearGradient>
                <filter id="nglow"><feGaussianBlur stdDeviation="1.5" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            {edges.map(([a, b], i) => <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="url(#nlg)" strokeWidth="1.2" strokeOpacity="0.5" />)}
            {nodes.map((n, i) => <circle key={i} cx={n.x} cy={n.y} r="3" fill="url(#nlg)" filter="url(#nglow)" />)}
        </svg>
    );
}
function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn);
    }, []);
    return (
        <motion.nav initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50"
            style={scrolled ? { background: "rgba(13,11,30,0.92)", borderBottom: `1px solid ${C.border}`, backdropFilter: "blur(16px)" } : {}}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative flex items-center justify-center -ml-2 sm:ml-0">
                        <Image src="/navbar-logo-2.png" alt="MLera Logo" width={120} height={40} className="object-contain w-[100px] sm:w-[120px]" priority />
                    </motion.div>
                </Link>
                <div className="flex items-center gap-3">
                    <span className="hidden sm:flex items-center gap-1.5 text-xs text-white/30 font-mono"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Module 3 of 5</span>
                    <Link href="/">
                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="text-xs px-4 py-2 rounded-lg font-semibold text-white"
                            style={{ background: `linear-gradient(135deg, ${C.coral}, ${C.purple})` }}>Dashboard</motion.button>
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}
function ProgressBar({ current = 3, total = 5 }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-white/35"><span>Module Progress</span><span>{current}/{total} complete</span></div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${C.coral}, ${C.purple})` }}
                    initial={{ width: 0 }} animate={{ width: `${(current / total) * 100}%` }} transition={{ duration: 1.2, delay: 0.4 }} />
            </div>
            <div className="flex gap-1.5">
                {Array.from({ length: total }).map((_, i) => (
                    <motion.div key={i} className="flex-1 h-1 rounded-full"
                        style={{ background: i < current ? `linear-gradient(90deg, ${C.coral}, ${C.purple})` : "rgba(255,255,255,0.08)" }}
                        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }} />
                ))}
            </div>
        </div>
    );
}
function Card({ children, delay = 0, className, glow = false }) {
    return (
        <Reveal delay={delay} className={className}>
            <motion.div whileHover={{ boxShadow: `0 8px 60px rgba(168,85,247,${glow ? "0.14" : "0.08"})` }}
                className="rounded-2xl border p-6 sm:p-8 relative overflow-hidden"
                style={{ background: C.card, borderColor: C.border }}>
                <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.03] pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${C.purple}, transparent)` }} />
                {children}
            </motion.div>
        </Reveal>
    );
}
function SectionHeader({ number, title, subtitle }) {
    return (
        <div className="flex items-start gap-4 mb-2">
            <motion.div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${C.coral}, ${C.purple})` }}
                whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                {number}
            </motion.div>
            <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
                {subtitle && <p className="text-xs text-white/35 font-mono mt-0.5">{subtitle}</p>}
            </div>
        </div>
    );
}

// ─── ★ NEURAL NETWORK SVG ─────────────────────────────────────────────────────
function NeuralNetworkViz({ layers = [3, 4, 4, 2], activating = false, activeLayer = -1, weights = null }) {
    const W = 560, H = 300, padX = 60, padY = 30;
    const layerCount = layers.length;
    const [signals, setSignals] = useState([]);
    const positions = layers.map((count, li) => {
        const x = padX + li * ((W - padX * 2) / (layerCount - 1));
        return Array.from({ length: count }, (_, ni) => ({
            x, y: padY + (ni + (Math.max(...layers) - count) / 2) * ((H - padY * 2) / (Math.max(...layers) - 1 || 1))
        }));
    });
    useEffect(() => {
        if (!activating) { setSignals([]); return; }
        const s = [];
        layers.slice(0, -1).forEach((_, li) => {
            positions[li].forEach((from, fi) => {
                positions[li + 1].forEach((to, ti) => {
                    s.push({ id: `${li}-${fi}-${ti}`, from, to, delay: li * 0.3 + (fi + ti) * 0.05 });
                });
            });
        });
        setSignals(s);
    }, [activating]);
    const layerNames = ["Input", "Hidden 1", "Hidden 2", "Output"];
    const layerColors = [C.teal, C.purple, C.coral, C.green];
    return (
        <div className="w-full overflow-hidden rounded-2xl" style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}` }}>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ minHeight: 180 }}>
                <defs>
                    {layerColors.map((col, i) => (<radialGradient key={i} id={`nc${i}`}><stop offset="0%" stopColor={col} stopOpacity="0.9" /><stop offset="100%" stopColor={col} stopOpacity="0.4" /></radialGradient>))}
                    <filter id="nodeGlow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                    <filter id="edgeGlow"><feGaussianBlur stdDeviation="1.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                {layers.slice(0, -1).map((_, li) =>
                    positions[li].map((from, fi) =>
                        positions[li + 1].map((to, ti) => {
                            const w = weights?.[li]?.[fi]?.[ti];
                            const isActive = activeLayer === li;
                            return (<motion.line key={`${li}-${fi}-${ti}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                                stroke={w !== undefined ? (w > 0 ? C.teal : C.coral) : isActive ? layerColors[li] : "rgba(255,255,255,0.06)"}
                                strokeWidth={isActive ? "1.8" : w !== undefined ? Math.abs(w) * 2 + 0.5 : "0.8"} strokeOpacity={w !== undefined ? Math.min(Math.abs(w), 1) : 1}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: li * 0.1 + fi * 0.03 }} />);
                        })
                    )
                )}
                <AnimatePresence>
                    {signals.map(sig => (
                        <motion.circle key={sig.id} r="3" fill={C.amber} filter="url(#edgeGlow)"
                            initial={{ cx: sig.from.x, cy: sig.from.y, opacity: 1, scale: 0 }}
                            animate={{ cx: sig.to.x, cy: sig.to.y, opacity: [1, 1, 0], scale: [0, 1.5, 0] }}
                            transition={{ duration: 0.6, delay: sig.delay, ease: "easeInOut" }} />
                    ))}
                </AnimatePresence>
                {positions.map((layer, li) =>
                    layer.map((pos, ni) => (
                        <g key={`${li}-${ni}`}>
                            <motion.circle cx={pos.x} cy={pos.y} r="14" fill={`url(#nc${li})`} filter="url(#nodeGlow)"
                                stroke={activeLayer === li ? layerColors[li] : "rgba(255,255,255,0.1)"}
                                strokeWidth={activeLayer === li ? "2" : "1"}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: activeLayer === li ? [1, 1.25, 1] : 1, opacity: 1 }}
                                transition={{ scale: activeLayer === li ? { duration: 0.8, repeat: Infinity } : { type: "spring", stiffness: 300 }, opacity: { duration: 0.5, delay: li * 0.15 + ni * 0.08 } }} />
                            <motion.circle cx={pos.x} cy={pos.y} r="4" fill="white" opacity="0.6"
                                animate={activeLayer === li ? { opacity: [0.6, 1, 0.6] } : {}} transition={{ duration: 1, repeat: Infinity }} />
                        </g>
                    ))
                )}
                {positions.map((layer, li) => (
                    <text key={li} x={layer[0].x} y={H - 6} textAnchor="middle" fill={layerColors[li]} fontSize="10" fontFamily="monospace" opacity="0.7">
                        {layerNames[li] || `Layer ${li}`}
                    </text>
                ))}
            </svg>
        </div>
    );
}

// ─── ★ LAYER EXPLORER ─────────────────────────────────────────────────────────
function LayerExplorer() {
    const [activeLayer, setActiveLayer] = useState(0);
    const [running, setRunning] = useState(false);
    const [showWeights, setShowWeights] = useState(false);

    const layerInfo = [
        { name: "Input Layer", color: C.teal, icon: "📥", desc: "Raw data enters — pixel values, numbers, text embeddings. Each neuron holds one feature value. No computation here.", neurons: 3, formula: "x = raw input" },
        { name: "Hidden Layer 1", color: C.purple, icon: "🔮", desc: "Detects basic patterns — edges, shapes, frequencies. Each neuron computes a weighted sum, then applies activation.", neurons: 4, formula: "h = σ(W·x + b)" },
        { name: "Hidden Layer 2", color: C.coral, icon: "🧠", desc: "Higher-level features emerge — eyes, ears, concepts. The network builds increasingly abstract representations.", neurons: 4, formula: "h₂ = σ(W₂·h₁ + b₂)" },
        { name: "Output Layer", color: C.green, icon: "📤", desc: "Final predictions! For classification, each neuron represents a class probability. Values sum to 1 via softmax.", neurons: 2, formula: "ŷ = softmax(W·h + b)" },
    ];

    const runForward = () => {
        setRunning(true); let l = 0;
        const step = () => {
            setActiveLayer(l); l++;
            if (l < layerInfo.length) setTimeout(step, 700);
            else setTimeout(() => { setRunning(false); setActiveLayer(-1); }, 700);
        };
        step();
    };

    const info = layerInfo[Math.max(0, activeLayer)];

    return (
        <div className="space-y-5">
            <NeuralNetworkViz layers={[3, 4, 4, 2]} activating={running} activeLayer={activeLayer} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {layerInfo.map((l, i) => (
                    <motion.button key={i} onClick={() => { setActiveLayer(i); setRunning(false); }}
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        className="py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all"
                        style={activeLayer === i ? { background: `${l.color}20`, borderColor: `${l.color}60`, color: l.color } : { borderColor: C.border, background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.35)" }}>
                        <span className="block text-base mb-0.5">{l.icon}</span>{l.name.split(" ")[0]}
                    </motion.button>
                ))}
            </div>
            <AnimatePresence mode="wait">
                <motion.div key={activeLayer} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.35 }}
                    className="rounded-xl p-5 border" style={{ background: `${info.color}0d`, borderColor: `${info.color}30` }}>
                    <div className="flex flex-wrap gap-4 justify-between items-start mb-3">
                        <div><div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: info.color }}>{info.neurons} neurons</div>
                            <h3 className="font-black text-white text-lg">{info.name}</h3></div>
                        <div className="font-mono text-xs px-3 py-2 rounded-lg" style={{ background: `${info.color}18`, color: info.color }}>{info.formula}</div>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed">{info.desc}</p>
                </motion.div>
            </AnimatePresence>
            <motion.button onClick={runForward} disabled={running}
                whileHover={!running ? { scale: 1.04, boxShadow: `0 0 30px ${C.coral}40` } : {}} whileTap={!running ? { scale: 0.97 } : {}}
                className="w-full py-3.5 rounded-xl font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${C.coral}, ${C.purple})`, opacity: running ? 0.7 : 1 }}>
                {running ? <span className="flex items-center justify-center gap-2"><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⟳</motion.span>Forward Pass Running...</span> : "▶ Run Forward Pass Animation"}
            </motion.button>
        </div>
    );
}


// ─── ★ ACTIVATION CHART WITH INTERACTIVE PROBE ────────────────────────────────
function ActivationChart() {
    const [selected, setSelected] = useState("sigmoid");
    const [probeX, setProbeX] = useState(0);
    const fns = {
        sigmoid: { fn: sigmoid, color: C.coral, label: "σ(x) = 1/(1+e⁻ˣ)", range: [-6, 6], out: [-0.1, 1.1], desc: "Squishes values to (0,1). Classic but can cause vanishing gradients in deep networks." },
        relu: { fn: relu, color: C.teal, label: "ReLU(x) = max(0,x)", range: [-6, 6], out: [-0.5, 6.5], desc: "Most popular today. Fast, simple, avoids vanishing gradients in positive range." },
        tanh: { fn: tanh, color: C.purple, label: "tanh(x) = (eˣ-e⁻ˣ)/(eˣ+e⁻ˣ)", range: [-4, 4], out: [-1.2, 1.2], desc: "Zero-centered version of sigmoid. Better for hidden layers in practice." },
    };
    const f = fns[selected];
    const W = 440, H = 200, PAD = 38;
    const [xMin, xMax] = f.range; const [yMin, yMax] = f.out;
    const pts = Array.from({ length: 200 }, (_, i) => { const x = xMin + i * (xMax - xMin) / 199; return { x, y: f.fn(x) }; });
    const px = x => PAD + ((x - xMin) / (xMax - xMin)) * (W - PAD * 2);
    const py = y => H - PAD - ((y - yMin) / (yMax - yMin || 1)) * (H - PAD * 2);
    const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${px(p.x).toFixed(1)} ${py(p.y).toFixed(1)}`).join(" ");
    const areaD = pathD + ` L ${px(xMax)} ${py(yMin)} L ${px(xMin)} ${py(yMin)} Z`;
    const probeY = f.fn(probeX);

    return (
        <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
                {Object.entries(fns).map(([k, v]) => (
                    <motion.button key={k} onClick={() => setSelected(k)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                        className="px-4 py-2 rounded-xl text-xs font-bold border transition-all"
                        style={selected === k ? { background: `${v.color}22`, borderColor: `${v.color}60`, color: v.color } : { borderColor: C.border, background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.35)" }}>
                        {k.charAt(0).toUpperCase() + k.slice(1)}
                    </motion.button>
                ))}
            </div>

            <div className="rounded-xl overflow-hidden" style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}` }}>
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto cursor-crosshair"
                    onMouseMove={e => { const rect = e.currentTarget.getBoundingClientRect(); const svgX = (e.clientX - rect.left) * (W / rect.width); const dataX = xMin + (svgX - PAD) / (W - PAD * 2) * (xMax - xMin); setProbeX(Math.max(xMin, Math.min(xMax, dataX))); }}
                    onMouseLeave={() => setProbeX(0)}>
                    <defs>
                        <linearGradient id={`afill_${selected}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={f.color} stopOpacity="0.2" /><stop offset="100%" stopColor={f.color} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {[-1, 0, 1].map(y => (
                        <line key={y} x1={PAD} y1={py(y)} x2={W - PAD} y2={py(y)} stroke={y === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)"} strokeWidth="1" strokeDasharray={y === 0 ? "none" : "4 3"} />
                    ))}
                    <line x1={px(0)} y1={PAD} x2={px(0)} y2={H - PAD} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 3" />
                    <AnimatePresence mode="wait">
                        <motion.path key={selected} d={areaD} fill={`url(#afill_${selected})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
                        <motion.path key={`line_${selected}`} d={pathD} fill="none" stroke={f.color} strokeWidth="3" strokeLinecap="round"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeInOut" }} />
                    </AnimatePresence>
                    {/* Probe */}
                    <line x1={px(probeX)} y1={PAD} x2={px(probeX)} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx={px(probeX)} cy={py(probeY)} r="5" fill={f.color} stroke="white" strokeWidth="1.5" />
                    <rect x={px(probeX) + 8} y={py(probeY) - 22} width={80} height={20} rx="5" fill="rgba(0,0,0,0.7)" />
                    <text x={px(probeX) + 48} y={py(probeY) - 8} textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace">f({probeX.toFixed(1)})={probeY.toFixed(3)}</text>
                    <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <text x={W / 2} y={H - 4} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="monospace">x</text>
                    <text x={W - PAD} y={PAD - 6} textAnchor="end" fill={f.color} fontSize="9" fontFamily="monospace">{f.label}</text>
                </svg>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 text-center text-xs font-mono">
                {[{ l: "Input x", v: probeX.toFixed(2), c: "rgba(255,255,255,0.7)" }, { l: "Output f(x)", v: probeY.toFixed(4), c: f.color }, { l: "Active?", v: probeY > 0.5 ? "Yes ✓" : "No ✕", c: probeY > 0.5 ? C.green : C.coral }].map(s => (
                    <div key={s.l} className="rounded-xl py-2 px-2 border" style={{ borderColor: C.border, background: "rgba(255,255,255,0.02)" }}>
                        <div className="text-white/30 text-[9px] uppercase tracking-widest mb-0.5">{s.l}</div>
                        <div className="font-black" style={{ color: s.c }}>{s.v}</div>
                    </div>
                ))}
            </div>

            <div className="rounded-xl p-4 border text-sm text-white/50 leading-relaxed" style={{ background: `${f.color}08`, borderColor: `${f.color}20` }}>
                <span className="font-bold" style={{ color: f.color }}>{selected.toUpperCase()}: </span>{f.desc}
                <span className="block mt-1 text-white/30 text-xs font-mono">Hover the chart to probe x→f(x) values!</span>
            </div>
        </div>
    );
}

// ─── ★ BACKPROP VISUALIZER ────────────────────────────────────────────────────
function BackpropViz() {
    const [step, setStep] = useState(0);
    const [autoPlay, setAutoPlay] = useState(false);
    const autoRef = useRef(null);

    const steps = [
        { title: "Forward Pass", icon: "→", color: C.teal, desc: "Input flows forward through all layers. Each neuron computes: output = activation(W·x + b). Store all intermediate values.", math: "ŷ = f(W·x + b)" },
        { title: "Compute Loss", icon: "⚡", color: C.amber, desc: "Compare prediction ŷ to true label y. Loss = (ŷ − y)². High loss = bad prediction. This is what we minimize.", math: "L = (ŷ − y)²" },
        { title: "Backward Pass", icon: "←", color: C.coral, desc: "Gradients flow backward using chain rule. ∂L/∂W = ∂L/∂ŷ · ∂ŷ/∂h · ∂h/∂W. Each layer gets its gradient.", math: "∂L/∂W = chain rule" },
        { title: "Update Weights", icon: "↑", color: C.green, desc: "W = W − α·∂L/∂W. Learning rate α controls step size. All weights nudged to reduce loss. Repeat thousands of times!", math: "W ← W − α·∂L/∂W" },
    ];

    useEffect(() => {
        if (autoPlay) {
            autoRef.current = setInterval(() => setStep(s => (s + 1) % steps.length), 2000);
        } else clearInterval(autoRef.current);
        return () => clearInterval(autoRef.current);
    }, [autoPlay]);

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {steps.map((s, i) => (
                    <motion.button key={i} onClick={() => { setStep(i); setAutoPlay(false); }}
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        className="p-4 rounded-xl border text-left transition-all relative overflow-hidden"
                        style={step === i ? { background: `${s.color}18`, borderColor: `${s.color}50` } : { borderColor: C.border, background: "rgba(255,255,255,0.02)" }}>
                        {step === i && <motion.div className="absolute inset-0 opacity-10 rounded-xl" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ background: s.color }} />}
                        <div className="text-2xl mb-2" style={{ color: s.color }}>{s.icon}</div>
                        <div className="text-xs font-bold text-white leading-tight">{s.title}</div>
                        <div className="text-[10px] font-mono text-white/25 mt-1">Step {i + 1}</div>
                    </motion.button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}
                    className="rounded-xl p-6 border relative overflow-hidden"
                    style={{ background: `${steps[step].color}0a`, borderColor: `${steps[step].color}30` }}>
                    <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{steps[step].icon}</span>
                            <div>
                                <div className="text-xs font-mono uppercase tracking-widest" style={{ color: steps[step].color }}>Step {step + 1} of {steps.length}</div>
                                <h3 className="font-black text-white">{steps[step].title}</h3>
                            </div>
                        </div>
                        <div className="font-mono text-xs px-3 py-2 rounded-lg font-bold" style={{ background: `${steps[step].color}20`, color: steps[step].color }}>{steps[step].math}</div>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed">{steps[step].desc}</p>
                    {step < steps.length - 1 && (
                        <motion.button onClick={() => setStep(s => s + 1)} className="mt-4 text-xs font-bold flex items-center gap-1" style={{ color: steps[step].color }} whileHover={{ x: 3 }}>
                            Next: {steps[step + 1].title} →
                        </motion.button>
                    )}
                </motion.div>
            </AnimatePresence>

            <motion.button onClick={() => setAutoPlay(a => !a)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="w-full py-2.5 rounded-xl text-sm font-bold border transition-all"
                style={{ borderColor: autoPlay ? `${C.purple}50` : C.border, background: autoPlay ? `${C.purple}15` : "rgba(255,255,255,0.02)", color: autoPlay ? C.purple : "rgba(255,255,255,0.5)" }}>
                {autoPlay ? "⏹ Stop Auto-Step" : "▶ Auto-play Training Loop"}
            </motion.button>
        </div>
    );
}

// ─── ★ NEURON PLAYGROUND GAME ─────────────────────────────────────────────────
function NeuronPlayground() {
    const [weights, setWeights] = useState([0.5, -0.3, 0.8]);
    const [bias, setBias] = useState(0.1);
    const [inputs, setInputs] = useState([1.0, 0.5, -0.2]);
    const [activation, setActivation] = useState("sigmoid");
    const [showFormula, setShowFormula] = useState(false);

    const fns = { sigmoid, relu, tanh };
    const z = inputs.reduce((s, x, i) => s + x * weights[i], bias);
    const output = fns[activation](z);
    const fires = output > 0.5;

    const randomize = () => {
        setWeights([...Array(3)].map(() => +(Math.random() * 2 - 1).toFixed(2)));
        setBias(+(Math.random() * 2 - 1).toFixed(2));
        setInputs([...Array(3)].map(() => +(Math.random() * 2 - 1).toFixed(2)));
    };

    return (
        <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
                {/* Inputs & weights */}
                <div className="space-y-3">
                    <div className="text-xs font-mono text-white/40 uppercase tracking-widest">Inputs & Weights</div>
                    {inputs.map((inp, i) => (
                        <div key={i} className="rounded-xl p-3 border" style={{ borderColor: C.border, background: "rgba(255,255,255,0.02)" }}>
                            <div className="flex justify-between text-xs font-mono mb-2">
                                <span style={{ color: C.teal }}>x{i + 1} = {inp.toFixed(2)}</span>
                                <span style={{ color: C.purple }}>w{i + 1} = {weights[i].toFixed(2)}</span>
                                <span className="text-white/40">x{i + 1}·w{i + 1} = {(inp * weights[i]).toFixed(3)}</span>
                            </div>
                            <div className="space-y-1">
                                <input type="range" min="-1" max="1" step="0.1" value={inp} onChange={e => { const n = [...inputs]; n[i] = +e.target.value; setInputs(n); }}
                                    className="w-full" style={{ accentColor: C.teal }} />
                                <input type="range" min="-2" max="2" step="0.1" value={weights[i]} onChange={e => { const n = [...weights]; n[i] = +e.target.value; setWeights(n); }}
                                    className="w-full" style={{ accentColor: C.purple }} />
                            </div>
                        </div>
                    ))}
                    <div className="rounded-xl p-3 border" style={{ borderColor: `${C.amber}30`, background: `${C.amber}08` }}>
                        <div className="flex justify-between text-xs font-mono mb-2"><span style={{ color: C.amber }}>Bias b = {bias.toFixed(2)}</span><span className="text-white/40">Added to weighted sum</span></div>
                        <input type="range" min="-2" max="2" step="0.1" value={bias} onChange={e => setBias(+e.target.value)} className="w-full" style={{ accentColor: C.amber }} />
                    </div>
                </div>

                {/* Output visualization */}
                <div className="space-y-3">
                    <div className="text-xs font-mono text-white/40 uppercase tracking-widest">Neuron Output</div>

                    {/* Big neuron viz */}
                    <div className="rounded-2xl p-6 border text-center relative overflow-hidden" style={{ borderColor: fires ? `${C.green}40` : `${C.coral}20`, background: fires ? `${C.green}08` : "rgba(255,255,255,0.02)" }}>
                        <motion.div className="text-6xl mb-2" animate={fires ? { scale: [1, 1.1, 1], filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] } : {}} transition={{ duration: 0.8, repeat: fires ? Infinity : 0 }}>
                            {fires ? "⚡" : "○"}
                        </motion.div>
                        <div className="text-xs font-mono text-white/40 mb-1">Neuron {fires ? "FIRES" : "silent"}</div>
                        <motion.div key={output.toFixed(3)} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="text-3xl font-black font-mono" style={{ color: fires ? C.green : C.coral }}>
                            {output.toFixed(4)}
                        </motion.div>
                    </div>

                    {/* Computation breakdown */}
                    <div className="rounded-xl p-4 border space-y-2" style={{ borderColor: C.border, background: "rgba(0,0,0,0.2)" }}>
                        <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Computation</div>
                        <div className="text-xs font-mono space-y-1">
                            <div style={{ color: "rgba(255,255,255,0.5)" }}>z = Σ(xᵢ·wᵢ) + b = <span className="font-bold text-white">{z.toFixed(4)}</span></div>
                            <div style={{ color: "rgba(255,255,255,0.5)" }}>output = {activation}(z) = <span className="font-bold" style={{ color: fires ? C.green : C.coral }}>{output.toFixed(4)}</span></div>
                        </div>
                    </div>

                    {/* Activation choice */}
                    <div className="flex gap-1.5">
                        {["sigmoid", "relu", "tanh"].map(a => (
                            <motion.button key={a} onClick={() => setActivation(a)} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
                                className="flex-1 py-2 rounded-lg border text-xs font-bold transition-all"
                                style={{ borderColor: activation === a ? `${C.purple}50` : C.border, background: activation === a ? `${C.purple}15` : "rgba(255,255,255,0.02)", color: activation === a ? C.purple : "rgba(255,255,255,0.4)" }}>
                                {a}
                            </motion.button>
                        ))}
                    </div>

                    <motion.button onClick={randomize} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        className="w-full py-2.5 rounded-xl text-sm font-bold text-black"
                        style={{ background: `linear-gradient(135deg, ${C.coral}, ${C.purple})` }}>
                        🎲 Randomize Neuron
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

// ─── ★ LOSS LANDSCAPE GAME ────────────────────────────────────────────────────
function LossLandscape() {
    const [w, setW] = useState(2.5);
    const [b, setB] = useState(1.5);
    const [history, setHistory] = useState([]);
    const [gradientStep, setGradientStep] = useState(false);
    const [lr, setLr] = useState(0.3);

    // Simple 2D loss surface: L = (w-1)^2 + (b-0.5)^2 (bowl shape)
    const loss = (wv, bv) => (wv - 1) ** 2 + (bv - 0.5) ** 2 + 0.05 * Math.sin(wv * 3) * Math.cos(bv * 3);
    const currentLoss = loss(w, b);

    const takeStep = () => {
        setGradientStep(true);
        // Numerical gradient
        const eps = 0.01;
        const dw = (loss(w + eps, b) - loss(w - eps, b)) / (2 * eps);
        const db = (loss(w, b + eps) - loss(w, b - eps)) / (2 * eps);
        const nw = Math.max(-3, Math.min(4, w - lr * dw));
        const nb = Math.max(-2, Math.min(3, b - lr * db));
        setHistory(h => [...h.slice(-19), { w, b, loss: currentLoss }]);
        setW(nw); setB(nb);
        setTimeout(() => setGradientStep(false), 300);
    };

    const reset = () => { setW(2.5); setB(1.5); setHistory([]); };

    // SVG loss landscape
    const W_SVG = 300, H_SVG = 200;
    const wMin = -3, wMax = 4, bMin = -2, bMax = 3;
    const toSVGx = (v) => ((v - wMin) / (wMax - wMin)) * W_SVG;
    const toSVGy = (v) => H_SVG - ((v - bMin) / (bMax - bMin)) * H_SVG;

    // Contour lines
    const contourLevels = [0.5, 1, 2, 3, 5, 8];
    const contourPaths = contourLevels.map(level => {
        const pts = [];
        for (let wi = -3; wi <= 4; wi += 0.15) {
            for (let bi = -2; bi <= 3; bi += 0.15) {
                if (Math.abs(loss(wi, bi) - level) < 0.1) pts.push({ x: toSVGx(wi), y: toSVGy(bi) });
            }
        }
        return { level, pts };
    });

    return (
        <div className="space-y-5">
            <div className="rounded-xl p-4 border text-sm text-white/50" style={{ borderColor: C.border, background: "rgba(255,255,255,0.02)" }}>
                🎮 Drag sliders or click <span className="text-white font-bold">Gradient Step</span> to descend toward minimum loss (center). This is what training does automatically — millions of times!
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
                {/* Loss landscape SVG */}
                <div>
                    <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-2">Loss Landscape (w, b space)</div>
                    <div className="rounded-xl overflow-hidden relative" style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${C.border}` }}>
                        <svg viewBox={`0 0 ${W_SVG} ${H_SVG}`} className="w-full h-auto">
                            {/* Contour circles */}
                            {contourLevels.map((level, i) => (
                                <ellipse key={i} cx={toSVGx(1)} cy={toSVGy(0.5)}
                                    rx={level * 38} ry={level * 30}
                                    fill="none" stroke={C.purple} strokeWidth="0.8" strokeOpacity={0.3 - i * 0.04} />
                            ))}
                            {/* History trail */}
                            {history.map((h, i) => (
                                <circle key={i} cx={toSVGx(h.w)} cy={toSVGy(h.b)} r="2" fill={C.teal} opacity={0.4 + i / history.length * 0.6} />
                            ))}
                            {/* Minimum marker */}
                            <circle cx={toSVGx(1)} cy={toSVGy(0.5)} r="5" fill={C.green} opacity="0.8" />
                            <text x={toSVGx(1) + 8} y={toSVGy(0.5) + 4} fill={C.green} fontSize="8" fontFamily="monospace">min</text>
                            {/* Current position */}
                            <motion.circle cx={toSVGx(w)} cy={toSVGy(b)} r="7" fill={C.coral} stroke="white" strokeWidth="2"
                                animate={gradientStep ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }} />
                            {/* Axis labels */}
                            <text x={W_SVG - 20} y={H_SVG - 4} fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">w →</text>
                            <text x={4} y={12} fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">↑ b</text>
                        </svg>
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-3">
                    <div className="text-xs font-mono text-white/40 uppercase tracking-widest">Parameters</div>

                    {[{ l: "Weight w", v: w, set: setW, min: -3, max: 4, col: C.coral }, { l: "Bias b", v: b, set: setB, min: -2, max: 3, col: C.purple }].map(s => (
                        <div key={s.l} className="rounded-xl p-3 border" style={{ borderColor: C.border, background: "rgba(255,255,255,0.02)" }}>
                            <div className="flex justify-between text-xs font-mono mb-2"><span style={{ color: s.col }}>{s.l} = {s.v.toFixed(2)}</span></div>
                            <input type="range" min={s.min} max={s.max} step="0.05" value={s.v} onChange={e => { s.set(+e.target.value); setHistory([]); }} className="w-full" style={{ accentColor: s.col }} />
                        </div>
                    ))}

                    <div className="rounded-xl p-3 border" style={{ borderColor: `${C.amber}30`, background: `${C.amber}08` }}>
                        <div className="flex justify-between text-xs font-mono mb-2"><span style={{ color: C.amber }}>Learning rate α = {lr.toFixed(2)}</span></div>
                        <input type="range" min="0.05" max="1.0" step="0.05" value={lr} onChange={e => setLr(+e.target.value)} className="w-full" style={{ accentColor: C.amber }} />
                    </div>

                    {/* Current loss */}
                    <div className="rounded-xl p-4 border text-center" style={{ borderColor: `${currentLoss < 0.3 ? C.green : C.coral}40`, background: `${currentLoss < 0.3 ? C.green : C.coral}08` }}>
                        <div className="text-xs font-mono text-white/30 mb-1">Current Loss</div>
                        <motion.div key={currentLoss.toFixed(3)} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-2xl font-black font-mono"
                            style={{ color: currentLoss < 0.3 ? C.green : currentLoss < 1 ? C.amber : C.coral }}>{currentLoss.toFixed(4)}</motion.div>
                        <div className="text-xs text-white/30 mt-1">{currentLoss < 0.1 ? "🏆 Near minimum!" : currentLoss < 0.5 ? "Getting close..." : "Keep descending!"}</div>
                    </div>

                    <div className="flex gap-2">
                        <motion.button onClick={takeStep} whileHover={{ scale: 1.04, boxShadow: `0 0 25px ${C.teal}40` }} whileTap={{ scale: 0.97 }}
                            className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
                            style={{ background: `linear-gradient(135deg, ${C.teal}, ${C.green})` }}>
                            ↓ Gradient Step
                        </motion.button>
                        <motion.button onClick={reset} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                            className="px-4 py-3 rounded-xl border text-white/50 text-sm"
                            style={{ borderColor: C.border, background: "rgba(255,255,255,0.02)" }}>↺</motion.button>
                    </div>

                    {history.length > 0 && (
                        <div className="rounded-xl p-3 border" style={{ borderColor: C.border, background: "rgba(0,0,0,0.2)" }}>
                            <div className="text-[10px] font-mono text-white/30 mb-2">Loss history ({history.length} steps)</div>
                            <div className="flex items-end gap-0.5 h-10">
                                {[...history, { loss: currentLoss }].map((h, i) => {
                                    const norm = Math.min(h.loss / 8, 1);
                                    return <motion.div key={i} className="flex-1 rounded-t" initial={{ height: 0 }} animate={{ height: `${Math.max(5, norm * 100)}%` }} style={{ background: norm < 0.2 ? C.green : norm < 0.5 ? C.amber : C.coral, opacity: 0.7 }} />;
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Real World Cards ─────────────────────────────────────────────────────────
function RWCard({ icon, title, desc, delay = 0 }) {
    return (
        <Reveal delay={delay}>
            <motion.div whileHover={{ y: -5, boxShadow: `0 16px 50px ${C.purple}18` }}
                className="rounded-2xl border p-5 text-center relative overflow-hidden"
                style={{ background: C.card, borderColor: C.border }}>
                <motion.div className="text-4xl mb-3" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 4, repeat: Infinity, delay }}>{icon}</motion.div>
                <h3 className="font-bold text-white mb-2 text-sm">{title}</h3>
                <p className="text-white/38 text-xs leading-relaxed">{desc}</p>
            </motion.div>
        </Reveal>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NeuralNetworkPage() {
    return (
        <div className="min-h-screen text-white" style={{ background: C.navy }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;} html{scroll-behavior:smooth;} body{overflow-x:hidden;}
        input[type=range]{-webkit-appearance:none;background:transparent;width:100%;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:${C.purple};cursor:pointer;margin-top:-6px;box-shadow:0 0 8px ${C.purple}60;}
        input[type=range]::-webkit-slider-runnable-track{height:4px;border-radius:2px;background:rgba(255,255,255,0.08);}
        ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-track{background:#060410;}
        ::-webkit-scrollbar-thumb{background:linear-gradient(#FF6B6B,#A855F7);border-radius:2px;}
        ::selection{background:rgba(168,85,247,0.3);color:white;}
      `}</style>
            <Navbar />
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.07]" style={{ background: C.purple }} />
                <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.06]" style={{ background: C.coral }} />
                <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.04]" style={{ background: C.teal }} />
                <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(rgba(168,85,247,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-6 sm:space-y-8">
                <div className="space-y-5">
                    <Reveal y={20} delay={0.05}>
                        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                            <Link href="/" className="text-white/28 hover:text-white/55 transition-colors">Home</Link>
                            <span className="text-white/20">›</span>
                            <Link href="/learning-path" className="text-white/28 hover:text-white/55 transition-colors">Learning Path</Link>
                            <span className="text-white/20">›</span>
                            <span className="text-white/60 cursor-default">Neural Networks</span>
                        </div>
                    </Reveal>
                    <Reveal delay={0.08}>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="text-xs font-mono px-3 py-1.5 rounded-full border" style={{ borderColor: `${C.teal}40`, background: `${C.teal}0d`, color: C.teal }}>🧠 Intermediate · 45 min</span>
                            <span className="text-xs font-mono px-3 py-1.5 rounded-full border" style={{ borderColor: `${C.purple}40`, background: `${C.purple}0d`, color: C.purple }}>Module 3 · Neural Networks</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight" style={{ fontFamily: "'Georgia',serif" }}>
                            <G from={C.teal} to={C.purple}>Neural Networks</G><br /><span className="text-white">The Brain of AI</span>
                        </h1>
                    </Reveal>
                    <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-5">
                        <div className="w-full lg:max-w-sm"><ProgressBar current={3} total={5} /></div>
                        <Reveal delay={0.2}>
                            <Link href="/learning-path">
                                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm text-white/55 hover:text-white transition-colors"
                                    style={{ borderColor: C.border, background: "rgba(255,255,255,0.03)" }}>‹ Previous Module</motion.button>
                            </Link>
                        </Reveal>
                    </div>
                </div>

                {/* Hero */}
                <Reveal delay={0.1}>
                    <div className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg,${C.teal}12,${C.purple}18)`, border: `1px solid ${C.purple}30` }}>
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(${C.teal} 1px,transparent 1px),linear-gradient(90deg,${C.teal} 1px,transparent 1px)`, backgroundSize: "50px 50px" }} />
                        <motion.div className="text-5xl mb-4" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity }}>🧠</motion.div>
                        <h2 className="text-2xl sm:text-4xl font-black text-white mb-4" style={{ fontFamily: "'Georgia',serif" }}>Inspired by the <G from={C.teal} to={C.purple}>Human Brain</G></h2>
                        <p className="text-white/50 max-w-3xl mx-auto leading-relaxed">Neural networks learn by example — just like you learned to recognize dogs without anyone defining what "dog" means mathematically. They find patterns humans can't even describe.</p>
                        <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs font-mono text-white/30">
                            {["Layers", "Activation Functions", "Backpropagation", "Loss Landscape", "Neuron Playground"].map(t => (
                                <span key={t} className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full" style={{ background: `linear-gradient(135deg,${C.teal},${C.purple})` }} />{t}</span>
                            ))}
                        </div>
                    </div>
                </Reveal>

                <Card delay={0.1} glow>
                    <SectionHeader number={1} title="Layers — How Information Flows" subtitle="Click each layer · Animate signal propagation" />
                    <div className="mt-6"><LayerExplorer /></div>
                </Card>

                <Card delay={0.12} glow>
                    <SectionHeader number={2} title="🎮 Neuron Playground — Build One Neuron" subtitle="Tune weights, bias, activation · Watch it fire in real time" />
                    <div className="mt-6 space-y-4">
                        <p className="text-white/50 text-sm leading-relaxed">A single neuron takes weighted inputs, adds a bias, applies activation. Drag sliders to see how each weight changes the output. Does the neuron fire?</p>
                        <NeuronPlayground />
                    </div>
                </Card>

                <Card delay={0.13}>
                    <SectionHeader number={3} title="Activation Functions — Adding Non-Linearity" subtitle="Hover chart to probe f(x) values at any point" />
                    <div className="mt-6 space-y-4">
                        <p className="text-white/50 text-sm leading-relaxed">Activation functions decide whether a neuron "fires." Without them, stacking layers does nothing — the whole network collapses to a single linear equation. Move your mouse over the chart to probe values!</p>
                        <ActivationChart />
                    </div>
                </Card>

                <Card delay={0.14}>
                    <SectionHeader number={4} title="Backpropagation — How Networks Learn" subtitle="Step through training · Enable auto-play" />
                    <div className="mt-6 space-y-4">
                        <p className="text-white/50 text-sm leading-relaxed">Backprop flows the error signal backward through the network, telling each weight how much to adjust. Enable auto-play to see the training loop in action!</p>
                        <BackpropViz />
                    </div>
                </Card>

                <Card delay={0.15} glow>
                    <SectionHeader number={5} title="🎮 Loss Landscape — Gradient Descent Game" subtitle="Manually descend or let gradient steps guide you to minimum" />
                    <div className="mt-6 space-y-4">
                        <p className="text-white/50 text-sm leading-relaxed">The goal of training is to find weights that minimize loss. Drag sliders or click <span style={{ color: C.teal }}>Gradient Step</span> to roll down the loss surface. Try different learning rates!</p>
                        <LossLandscape />
                    </div>
                </Card>

                <div className="space-y-5">
                    <Reveal><h2 className="text-2xl sm:text-4xl font-black text-white text-center" style={{ fontFamily: "'Georgia',serif" }}><G from={C.teal} to={C.purple}>Real-World</G> Applications</h2></Reveal>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <RWCard icon="👁️" title="Image Recognition" delay={0.05} desc="CNNs classify millions of images — powering Face ID, medical scans, self-driving vision." />
                        <RWCard icon="🎙️" title="Voice Assistants" delay={0.1} desc="RNNs and Transformers turn speech to text. Siri, Alexa, Google Assistant all run neural nets." />
                        <RWCard icon="🎮" title="Game AI" delay={0.15} desc="AlphaGo, OpenAI Five — neural networks that mastered games humans thought machines could never beat." />
                    </div>
                </div>

                <Reveal delay={0.1}>
                    <div className="rounded-2xl border-2 border-dashed p-8 text-center" style={{ borderColor: `${C.teal}35` }}>
                        <div className="text-4xl mb-3">⚡</div>
                        <h3 className="text-xl font-black text-white mb-2">Ready for the next challenge?</h3>
                        <p className="text-white/40 text-sm mb-6">You've explored how neural networks learn. Now see how trees make decisions.</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/decision-trees">
                                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                    className="px-6 py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
                                    style={{ background: `linear-gradient(135deg,${C.coral},${C.purple})` }}>Next: Decision Trees →</motion.div>
                            </Link>
                            <Link href="/learning-path">
                                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                    className="px-6 py-3 rounded-xl text-sm font-semibold text-white/55 hover:text-white border border-white/10 hover:border-white/25 transition-colors cursor-pointer">
                                    Back to Learning Path
                                </motion.div>
                            </Link>
                        </div>
                    </div>
                </Reveal>
            </main>

            <footer className="relative z-10 border-t py-8 px-6 text-center" style={{ borderColor: C.border }}>
                <div className="flex items-center justify-center gap-2 mb-2"><NeuralLogo size={24} />
                    <span className="text-sm font-black"><span style={{ color: C.coral }}>ML</span><span style={{ color: C.purple }}>era</span></span>
                </div>
                <p className="text-white/18 text-xs font-mono">© 2026 MLera · IIIT Dharwad Research Park</p>
            </footer>
        </div>
    );
}  
