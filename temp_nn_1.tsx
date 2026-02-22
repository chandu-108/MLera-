import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

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
                <a href="#" className="flex items-center gap-2.5">
                    <motion.div whileHover={{ rotate: 10, scale: 1.08 }}><NeuralLogo size={34} /></motion.div>
                    <span className="text-lg font-black"><span style={{ color: C.coral }}>ML</span><span style={{ color: C.purple }}>era</span></span>
                    <span className="hidden sm:inline text-[10px] font-mono text-white/20 border border-white/10 px-1.5 py-0.5 rounded">IDRP</span>
                </a>
                <div className="flex items-center gap-3">
                    <span className="hidden sm:flex items-center gap-1.5 text-xs text-white/30 font-mono"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Module 3 of 5</span>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="text-xs px-4 py-2 rounded-lg font-semibold text-white"
                        style={{ background: `linear-gradient(135deg, ${C.coral}, ${C.purple})` }}>Dashboard</motion.button>
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
