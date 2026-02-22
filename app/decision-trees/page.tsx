"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { RotateCcw, GitBranch, Scissors, AlignCenter } from "lucide-react";

const C = {
    coral: "#FF6B6B", purple: "#A855F7", navy: "#0D0B1E", amber: "#FBBF24",
    green: "#4ADE80", teal: "#2DD4BF", card: "rgba(255,255,255,0.028)", border: "rgba(255,255,255,0.07)",
};
const cn = (...c: any[]) => c.filter(Boolean).join(" ");

function G({ children, from = C.amber, to = C.coral }: any) {
    return <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg,${from},${to})` }}>{children}</span>;
}
function Reveal({ children, delay = 0, y = 40, className }: any) {
    const ref = useRef(null); const inV = useInView(ref, { once: true, margin: "-50px" });
    return <motion.div ref={ref} className={className} initial={{ opacity: 0, y }} animate={inV ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
function NeuralLogo({ size = 32 }) {
    const nodes = [{ x: 14, y: 6 }, { x: 34, y: 10 }, { x: 8, y: 22 }, { x: 28, y: 18 }, { x: 44, y: 26 }, { x: 14, y: 34 }, { x: 34, y: 38 }, { x: 20, y: 50 }];
    const edges = [[0, 3], [1, 3], [2, 3], [3, 4], [3, 5], [3, 6], [5, 7], [6, 7], [4, 6]];
    return (<svg width={size} height={size} viewBox="0 0 52 56" fill="none" overflow="visible">
        <defs><linearGradient id="nlg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={C.coral} /><stop offset="100%" stopColor={C.purple} /></linearGradient>
            <filter id="nglow2"><feGaussianBlur stdDeviation="1.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        {edges.map(([a, b], i) => <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="url(#nlg2)" strokeWidth="1.2" strokeOpacity="0.5" />)}
        {nodes.map((n, i) => <circle key={i} cx={n.x} cy={n.y} r="3" fill="url(#nlg2)" filter="url(#nglow2)" />)}
    </svg>);
}
function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    return (<motion.nav initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="fixed top-0 left-0 right-0 z-50 transition-all duration-300" style={scrolled ? { background: "rgba(13,11,30,0.92)", borderBottom: `1px solid ${C.border}`, backdropFilter: "blur(16px)" } : {}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative flex items-center justify-center -ml-2 sm:ml-0">
                    <Image src="/navbar-logo-2.png" alt="MLera Logo" width={120} height={40} className="object-contain w-[100px] sm:w-[120px]" priority />
                </motion.div>
            </Link>
            <div className="flex items-center gap-3">
                <span className="hidden sm:flex items-center gap-1.5 text-xs text-white/30 font-mono"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Module 4 of 5</span>
                <Link href="/">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="text-xs px-4 py-2 rounded-lg font-semibold text-white" style={{ background: `linear-gradient(135deg,${C.coral},${C.purple})` }}>Dashboard</motion.button>
                </Link>
            </div>
        </div>
    </motion.nav>);
}
function Card({ children, delay = 0, className }: any) {
    return (<Reveal delay={delay} className={className}><motion.div whileHover={{ boxShadow: `0 8px 60px rgba(251,191,36,0.08)` }} className="rounded-2xl border p-6 sm:p-8 relative overflow-hidden" style={{ background: C.card, borderColor: C.border }}>
        <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.03] pointer-events-none" style={{ background: `radial-gradient(circle,${C.amber},transparent)` }} />
        {children}
    </motion.div></Reveal>);
}
function SectionHeader({ number, title, subtitle }: any) {
    return (<div className="flex items-start gap-4 mb-2"><motion.div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
        style={{ background: `linear-gradient(135deg,${C.amber},${C.coral})` }} whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 400 }}>{number}</motion.div>
        <div><h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>{subtitle && <p className="text-xs text-white/35 font-mono mt-0.5">{subtitle}</p>}</div>
    </div>);
}

// ─── ★ ANIMATED DECISION TREE SVG ─────────────────────────────────────────────
function DecisionTreeViz({ showPruned = false }: any) {
    const [hoveredNode, setHoveredNode] = useState<number | null>(null);
    const [revealing, setRevealing] = useState(false);
    const [visibleNodes, setVisibleNodes] = useState([0]);

    const nodes = [
        { id: 0, x: 300, y: 40, label: "Age > 30?", type: "decision", col: C.amber, result: null },
        { id: 1, x: 160, y: 130, label: "Income > 50k?", type: "decision", col: C.teal, result: null },
        { id: 2, x: 440, y: 130, label: "Has Degree?", type: "decision", col: C.purple, result: null },
        { id: 3, x: 80, y: 220, label: "LOW RISK", type: "leaf", col: C.green, result: "✓" },
        { id: 4, x: 240, y: 220, label: "MEDIUM", type: "leaf", col: C.amber, result: "~" },
        { id: 5, x: 370, y: 220, label: "HIGH RISK", type: "leaf", col: C.coral, result: "✕" },
        { id: 6, x: 510, y: 220, label: "LOW RISK", type: "leaf", col: C.green, result: "✓" },
        // Pruned subtree (node 4 splits further)
        ...(showPruned ? [] : []),
    ];
    const edges = [
        { from: 0, to: 1, label: "YES" }, { from: 0, to: 2, label: "NO" },
        { from: 1, to: 3, label: "YES" }, { from: 1, to: 4, label: "NO" },
        { from: 2, to: 5, label: "NO" }, { from: 2, to: 6, label: "YES" },
    ];

    const revealTree = () => {
        setRevealing(true);
        setVisibleNodes([0]);
        const order = [0, 1, 2, 3, 4, 5, 6];
        order.forEach((id, i) => {
            setTimeout(() => setVisibleNodes(v => [...v, id]), i * 300);
        });
        setTimeout(() => setRevealing(false), order.length * 300 + 200);
    };

    const nodeById = (id: number) => nodes.find(n => n.id === id);

    return (
        <div className="space-y-4">
            <div className="w-full rounded-2xl overflow-hidden" style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}` }}>
                <svg viewBox="0 0 600 280" className="w-full h-auto" style={{ minHeight: 180 }}>
                    <defs>
                        <filter id="treeGlow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                    </defs>

                    {/* Edges */}
                    {edges.map((e, i) => {
                        const from = nodeById(e.from), to = nodeById(e.to);
                        if (!from || !to) return null;
                        const visible = visibleNodes.includes(e.from) && visibleNodes.includes(e.to);
                        return (
                            <g key={i}>
                                <motion.line x1={from.x} y1={from.y + 16} x2={to.x} y2={to.y - 16}
                                    stroke={visible ? from.col : "rgba(255,255,255,0.05)"} strokeWidth="1.5" strokeOpacity="0.6"
                                    initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0.1 }} transition={{ duration: 0.4 }}
                                />
                                {visible && (
                                    <motion.text x={(from.x + to.x) / 2 + 6} y={(from.y + to.y) / 2}
                                        textAnchor="middle" fill={from.col} fontSize="9" fontFamily="monospace" opacity="0.7"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                        {e.label}
                                    </motion.text>
                                )}
                            </g>
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map(n => {
                        const visible = visibleNodes.includes(n.id);
                        const hovered = hoveredNode === n.id;
                        const isLeaf = n.type === "leaf";
                        return (
                            <g key={n.id} onMouseEnter={() => setHoveredNode(n.id)} onMouseLeave={() => setHoveredNode(null)}
                                style={{ cursor: "pointer" }}>
                                <motion.rect x={n.x - (isLeaf ? 42 : 52)} y={n.y - 16} width={isLeaf ? 84 : 104} height={32}
                                    rx="8"
                                    fill={visible ? `${n.col}22` : "rgba(255,255,255,0.02)"}
                                    stroke={visible ? n.col : "rgba(255,255,255,0.06)"}
                                    strokeWidth={hovered ? 2.5 : 1.5}
                                    filter={hovered ? "url(#treeGlow)" : "none"}
                                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: visible ? 1 : 0, opacity: visible ? 1 : 0 }}
                                    transition={{ type: "spring", stiffness: 300, delay: 0 }}
                                />
                                {visible && (
                                    <motion.text x={n.x} y={n.y + 4} textAnchor="middle" fill={n.col}
                                        fontSize={isLeaf ? "9" : "10"} fontFamily="monospace" fontWeight="bold"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                        {n.label}
                                    </motion.text>
                                )}
                                {isLeaf && visible && (
                                    <motion.circle cx={n.x - 32} cy={n.y} r="6" fill={n.col} opacity="0.4"
                                        animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Hovered node tooltip */}
            <AnimatePresence>
                {hoveredNode !== null && (
                    <motion.div key={hoveredNode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="rounded-xl p-4 border text-sm" style={{ background: `${nodeById(hoveredNode)?.col}12`, borderColor: `${nodeById(hoveredNode)?.col}30` }}>
                        <span className="font-bold" style={{ color: nodeById(hoveredNode)?.col }}>{nodeById(hoveredNode)?.label}</span>
                        <span className="text-white/45 ml-2">— {nodeById(hoveredNode)?.type === "leaf" ? "Leaf node (final decision)" : "Decision node (splits data)"}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button onClick={revealTree} disabled={revealing}
                whileHover={!revealing ? { scale: 1.04, boxShadow: `0 0 30px ${C.amber}40` } : {}} whileTap={!revealing ? { scale: 0.97 } : {}}
                className="w-full py-3.5 rounded-xl font-bold text-black"
                style={{ background: `linear-gradient(135deg,${C.amber},${C.coral})`, opacity: revealing ? 0.7 : 1 }}>
                {revealing ? "🌳 Growing Tree..." : "🌱 Animate Tree Growth"}
            </motion.button>
        </div>
    );
}

// ─── ★ SPLITTING VISUALIZER ───────────────────────────────────────────────────
function SplittingViz() {
    const [threshold, setThreshold] = useState(5);
    const W = 460, H = 200, PAD = 40;
    const points = [
        { x: 1.2, y: 0, label: "No" }, { x: 2.1, y: 0, label: "No" }, { x: 3.0, y: 1, label: "Yes" },
        { x: 3.8, y: 0, label: "No" }, { x: 4.5, y: 1, label: "Yes" }, { x: 5.5, y: 1, label: "Yes" },
        { x: 6.2, y: 1, label: "Yes" }, { x: 7.0, y: 0, label: "No" }, { x: 7.8, y: 1, label: "Yes" },
        { x: 8.5, y: 1, label: "Yes" }, { x: 9.1, y: 0, label: "No" }, { x: 9.8, y: 1, label: "Yes" },
    ];
    const xMin = 0, xMax = 11;
    const px = (x: number) => PAD + (x - xMin) / (xMax - xMin) * (W - PAD * 2);
    const py = (y: number) => y === 1 ? H * 0.3 : H * 0.7;

    const left = points.filter(p => p.x < threshold);
    const right = points.filter(p => p.x >= threshold);
    const purity = (pts: any[]) => {
        if (!pts.length) return 1;
        const yes = pts.filter(p => p.label === "Yes").length / pts.length;
        const no = 1 - yes;
        if (yes === 0 || no === 0) return 1;
        return 1 - (yes * yes + no * no); // Gini
    };
    const giniLeft = purity(left).toFixed(3);
    const giniRight = purity(right).toFixed(3);
    const weighted = ((left.length * purity(left) + right.length * purity(right)) / points.length).toFixed(3);

    return (
        <div className="space-y-4">
            <div className="rounded-xl overflow-hidden" style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}` }}>
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
                    {/* Split line */}
                    <motion.line x1={px(threshold)} y1={PAD} x2={px(threshold)} y2={H - PAD}
                        stroke={C.amber} strokeWidth="2" strokeDasharray="6 3"
                        animate={{ x1: px(threshold), x2: px(threshold) }} transition={{ duration: 0.2 }} />
                    {/* Region fills */}
                    <motion.rect x={PAD} y={PAD} width={px(threshold) - PAD} height={H - PAD * 2}
                        fill={C.purple} opacity="0.04" animate={{ width: px(threshold) - PAD }} transition={{ duration: 0.2 }} />
                    <motion.rect x={px(threshold)} y={PAD} width={(W - PAD) - px(threshold)} height={H - PAD * 2}
                        fill={C.teal} opacity="0.04" animate={{ x: px(threshold), width: (W - PAD) - px(threshold) }} transition={{ duration: 0.2 }} />
                    {/* Label rows */}
                    <text x={W / 2} y={H * 0.15} textAnchor="middle" fill={C.green} fontSize="9" fontFamily="monospace">YES (1)</text>
                    <text x={W / 2} y={H * 0.85} textAnchor="middle" fill={C.coral} fontSize="9" fontFamily="monospace">NO (0)</text>
                    {/* Points */}
                    {points.map((p, i) => {
                        const isLeft = p.x < threshold;
                        const col = p.label === "Yes" ? C.green : C.coral;
                        return (
                            <motion.circle key={i} cx={px(p.x)} cy={py(p.y)} r="7"
                                fill={col} stroke="white" strokeWidth="1.5" strokeOpacity="0.4"
                                animate={{ opacity: isLeft ? 1 : 0.55, scale: isLeft ? 1 : 0.85 }}
                                transition={{ duration: 0.3 }} />
                        );
                    })}
                    {/* Split label */}
                    <text x={px(threshold)} y={PAD - 6} textAnchor="middle" fill={C.amber} fontSize="10" fontFamily="monospace" fontWeight="bold">
                        Split: x &lt; {threshold}
                    </text>
                    {/* X axis */}
                    <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    {[0, 2, 4, 6, 8, 10].map(x => (
                        <text key={x} x={px(x)} y={H - PAD + 12} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="monospace">{x}</text>
                    ))}
                </svg>
            </div>

            <div className="space-y-2.5">
                <div className="flex justify-between text-xs font-mono text-white/45">
                    <span>Split Threshold: x &lt; <span style={{ color: C.amber }} className="font-bold">{threshold}</span></span>
                    <span>{left.length} left · {right.length} right</span>
                </div>
                <div className="relative h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="absolute h-full rounded-full" style={{ width: `${(threshold / 10) * 100}%`, background: `linear-gradient(90deg,${C.purple},${C.amber})` }} />
                    <input type="range" min={1} max={10} step={0.5} value={threshold} onChange={e => setThreshold(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" style={{ zIndex: 10 }} />
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white pointer-events-none"
                        style={{ left: `calc(${(threshold / 10) * 100}% - 8px)`, background: `linear-gradient(135deg,${C.purple},${C.amber})` }} />
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                {[{ label: "Left Gini", val: giniLeft, col: C.purple }, { label: "Right Gini", val: giniRight, col: C.teal }, { label: "Weighted", val: weighted, col: C.amber }].map((item, i) => (
                    <div key={i} className="rounded-xl p-3 text-center border" style={{ background: `${item.col}08`, borderColor: `${item.col}20` }}>
                        <div className="text-[10px] font-mono text-white/30 mb-1 uppercase tracking-widest">{item.label}</div>
                        <motion.div key={item.val} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="text-base font-black font-mono" style={{ color: item.col }}>{item.val}</motion.div>
                    </div>
                ))}
            </div>
            <p className="text-xs text-white/35 leading-relaxed">
                <span style={{ color: C.amber }} className="font-bold">Gini Impurity</span> measures how mixed a node is. 0 = pure (all same class). The algorithm picks the split that minimizes weighted Gini.
            </p>
        </div>
    );
}

// ─── ★ PRUNING DEMO ───────────────────────────────────────────────────────────
function PruningDemo() {
    const [pruned, setPruned] = useState(false);
    const prunedNodes = [
        { id: 0, x: 240, y: 40, label: "Income>50k?", col: C.amber }, { id: 1, x: 120, y: 130, label: "HIGH RISK", leaf: true, col: C.coral }, { id: 2, x: 360, y: 130, label: "LOW RISK", leaf: true, col: C.green },
    ];
    const fullNodes = [
        { id: 0, x: 240, y: 40, label: "Income>50k?", col: C.amber }, { id: 1, x: 120, y: 130, label: "Age>25?", col: C.teal }, { id: 2, x: 360, y: 130, label: "Degree?", col: C.purple },
        { id: 3, x: 60, y: 220, label: "MEDIUM", leaf: true, col: C.amber }, { id: 4, x: 180, y: 220, label: "HIGH", leaf: true, col: C.coral },
        { id: 5, x: 310, y: 220, label: "HIGH", leaf: true, col: C.coral }, { id: 6, x: 420, y: 220, label: "LOW", leaf: true, col: C.green },
    ];
    const nodes = pruned ? prunedNodes : fullNodes;
    const edges = pruned
        ? [{ from: 0, to: 1, label: "NO" }, { from: 0, to: 2, label: "YES" }]
        : [{ from: 0, to: 1, label: "NO" }, { from: 0, to: 2, label: "YES" }, { from: 1, to: 3, label: "NO" }, { from: 1, to: 4, label: "YES" }, { from: 2, to: 5, label: "NO" }, { from: 2, to: 6, label: "YES" }];
    const nb = (id: number) => nodes.find(n => n.id === id);

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                {[{ label: "🌿 Full Tree (Overfit)", val: false }, { label: "✂️ Pruned Tree", val: true }].map(opt => (
                    <motion.button key={String(opt.val)} onClick={() => setPruned(opt.val)}
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        className="flex-1 py-3 rounded-xl border text-sm font-semibold transition-all"
                        style={pruned === opt.val
                            ? { background: `${C.amber}18`, borderColor: `${C.amber}50`, color: C.amber }
                            : { borderColor: C.border, background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.35)" }}>
                        {opt.label}
                    </motion.button>
                ))}
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}` }}>
                <svg viewBox="0 0 480 280" className="w-full h-auto" style={{ minHeight: 160 }}>
                    <defs><filter id="pruneGlow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
                    {edges.map((e, i) => {
                        const from = nb(e.from), to = nb(e.to);
                        if (!from || !to) return null;
                        return (<g key={i}>
                            <motion.line x1={from.x} y1={from.y + 16} x2={to.x} y2={to.y - 16}
                                stroke={from.col} strokeWidth="1.5" strokeOpacity="0.6"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: i * 0.1 }} />
                            <motion.text x={(from.x + to.x) / 2 + 8} y={(from.y + to.y) / 2} fill={from.col}
                                fontSize="9" fontFamily="monospace" opacity="0.7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 + 0.2 }}>
                                {e.label}
                            </motion.text>
                        </g>);
                    })}
                    {nodes.map(n => (
                        <g key={n.id}>
                            <motion.rect x={n.x - 46} y={n.y - 15} width={92} height={30} rx="8"
                                fill={`${n.col}18`} stroke={n.col} strokeWidth="1.5"
                                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 280 }} />
                            <motion.text x={n.x} y={n.y + 4} textAnchor="middle" fill={n.col}
                                fontSize="9.5" fontFamily="monospace" fontWeight="bold"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                {n.label}
                            </motion.text>
                        </g>
                    ))}
                </svg>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl p-4 border" style={{ background: `${C.coral}08`, borderColor: `${C.coral}20` }}>
                    <p className="font-bold mb-2" style={{ color: C.coral }}>🌿 Full Tree Problems</p>
                    <p className="text-white/40 text-xs leading-relaxed">Memorizes training data including noise. Fails on new data. Too many splits = overfitting = poor generalization.</p>
                </div>
                <div className="rounded-xl p-4 border" style={{ background: `${C.green}08`, borderColor: `${C.green}20` }}>
                    <p className="font-bold mb-2" style={{ color: C.green }}>✂️ Pruned Tree Benefits</p>
                    <p className="text-white/40 text-xs leading-relaxed">Removes branches that don't add much value. Simpler, more generalizable, faster to evaluate.</p>
                </div>
            </div>
        </div>
    );
}

// ─── Medical Diagnosis Interactive ────────────────────────────────────────────
function DiagnosisDemo() {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const questions = [
        { id: "fever", label: "High fever (>38.5°C)?", yes: "chest_pain", no: "result_mild" },
        { id: "chest_pain", label: "Chest pain present?", yes: "result_serious", no: "result_moderate" },
        { id: "result_mild", label: null, result: "LOW RISK — Monitor at home", col: C.green },
        { id: "result_moderate", label: null, result: "MODERATE — See doctor today", col: C.amber },
        { id: "result_serious", label: null, result: "HIGH RISK — Emergency care now!", col: C.coral },
    ];
    const getState = () => {
        if (!answers.fever) return "fever";
        if (answers.fever === "yes") return "chest_pain" in answers ? (answers.chest_pain === "yes" ? "result_serious" : "result_moderate") : "chest_pain";
        return "result_mild";
    };
    const state = getState();
    const q = questions.find(q => q.id === state);
    if (!q) return null;
    const isResult = state.startsWith("result");

    return (
        <div className="space-y-4">
            <div className="rounded-2xl p-6 border relative overflow-hidden" style={{ background: "rgba(0,0,0,0.3)", borderColor: C.border }}>
                <div className="text-xs font-mono text-white/30 mb-4 uppercase tracking-widest">Medical Diagnosis Decision Tree</div>

                {/* Path indicator */}
                <div className="flex items-center gap-2 flex-wrap mb-5">
                    {Object.entries(answers).map(([k, v]) => (
                        <span key={k} className="text-xs font-mono px-2 py-1 rounded" style={{ background: `${C.amber}15`, color: C.amber }}>
                            {k}: <span className="font-bold">{v}</span>
                        </span>
                    ))}
                    {Object.keys(answers).length > 0 && <span className="text-white/20 text-xs">→</span>}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={state} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                        {!isResult ? (
                            <div className="space-y-4">
                                <div className="text-base font-bold text-white">{q.label}</div>
                                <div className="flex gap-3">
                                    {["yes", "no"].map(ans => (
                                        <motion.button key={ans} onClick={() => setAnswers(prev => ({ ...prev, [state]: ans }))}
                                            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
                                            className="flex-1 py-3 rounded-xl font-bold text-sm"
                                            style={ans === "yes" ? { background: `${C.green}20`, border: `1px solid ${C.green}40`, color: C.green } : { background: `${C.coral}15`, border: `1px solid ${C.coral}30`, color: C.coral }}>
                                            {ans === "yes" ? "✓ Yes" : "✕ No"}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <motion.div className="rounded-xl p-5 text-center" style={{ background: `${q.col}18`, border: `1px solid ${q.col}40` }}
                                    initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                                    <div className="text-3xl mb-2">🏥</div>
                                    <div className="text-lg font-black" style={{ color: q.col }}>{q.result}</div>
                                </motion.div>
                                <motion.button onClick={() => setAnswers({})} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white/55 hover:text-white border border-white/10 hover:border-white/25 transition-colors">
                                    ↺ Try Again
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DecisionTreePage() {
    return (
        <div className="min-h-screen text-white" style={{ background: C.navy }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;} html{scroll-behavior:smooth;} body{overflow-x:hidden;}
        input[type=range]{-webkit-appearance:none;background:transparent;}
        ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-track{background:#060410;}
        ::-webkit-scrollbar-thumb{background:linear-gradient(#FBBF24,#FF6B6B);border-radius:2px;}
        ::selection{background:rgba(251,191,36,0.3);color:white;}
      `}</style>
            <Navbar />
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.07]" style={{ background: C.amber }} />
                <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.06]" style={{ background: C.coral }} />
                <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(rgba(251,191,36,1) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
            </div>
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="space-y-5">
                    <Reveal y={20} delay={0.05}>
                        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                            <Link href="/" className="text-white/28 hover:text-white/55 transition-colors">Home</Link>
                            <span className="text-white/20">›</span>
                            <Link href="/learning-path" className="text-white/28 hover:text-white/55 transition-colors">Learning Path</Link>
                            <span className="text-white/20">›</span>
                            <span className="text-white/60 cursor-default">Decision Trees</span>
                        </div>
                    </Reveal>
                    <Reveal delay={0.08}>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="text-xs font-mono px-3 py-1.5 rounded-full border" style={{ borderColor: `${C.amber}40`, background: `${C.amber}0d`, color: C.amber }}>🌳 Intermediate · 35 min</span>
                            <span className="text-xs font-mono px-3 py-1.5 rounded-full border" style={{ borderColor: `${C.coral}40`, background: `${C.coral}0d`, color: C.coral }}>Module 4 · Decision Trees</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight" style={{ fontFamily: "'Georgia',serif" }}>
                            <G from={C.amber} to={C.coral}>Decision Trees</G><br /><span className="text-white">Making Choices Step by Step</span>
                        </h1>
                    </Reveal>
                    <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-5">
                        <div className="w-full lg:max-w-sm">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-mono text-white/35"><span>Module Progress</span><span>4/5 complete</span></div>
                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                                    <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg,${C.amber},${C.coral})` }} initial={{ width: 0 }} animate={{ width: "80%" }} transition={{ duration: 1.2, delay: 0.4 }} />
                                </div>
                            </div>
                        </div>
                        <Reveal delay={0.2}>
                            <Link href="/neural-networks" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm text-white/55 hover:text-white transition-colors cursor-pointer"
                                style={{ borderColor: C.border, background: "rgba(255,255,255,0.03)" }}>‹ Neural Networks</Link>
                        </Reveal>
                    </div>
                </div>

                {/* Hero */}
                <Reveal delay={0.1}>
                    <div className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg,${C.amber}12,${C.coral}18)`, border: `1px solid ${C.amber}30` }}>
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(${C.amber} 1px,transparent 1px),linear-gradient(90deg,${C.amber} 1px,transparent 1px)`, backgroundSize: "50px 50px" }} />
                        <motion.div className="text-5xl mb-4" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 4, repeat: Infinity }}>🌳</motion.div>
                        <h2 className="text-2xl sm:text-4xl font-black text-white mb-4" style={{ fontFamily: "'Georgia',serif" }}>
                            Like a Game of <G from={C.amber} to={C.coral}>20 Questions</G>
                        </h2>
                        <p className="text-white/50 max-w-3xl mx-auto leading-relaxed">
                            Decision trees ask a series of yes/no questions to classify data — exactly like how a doctor narrows down a diagnosis,
                            or how a credit officer evaluates a loan application.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs font-mono text-white/30">
                            {["Tree Structure", "Splitting", "Pruning", "Gini Impurity"].map(t => (
                                <span key={t} className="flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full" style={{ background: `linear-gradient(135deg,${C.amber},${C.coral})` }} />
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </Reveal>

                {/* Section 1 */}
                <Card delay={0.1}>
                    <SectionHeader number={1} title="Tree Structure — Anatomy of a Decision Tree" subtitle="Hover nodes · Click 'Animate' to watch it grow" />
                    <div className="mt-6 space-y-4">
                        <p className="text-white/50 text-sm leading-relaxed">Every decision tree has three types of nodes: <span className="font-bold" style={{ color: C.amber }}>root</span> (top question), <span className="font-bold" style={{ color: C.teal }}>internal nodes</span> (intermediate questions), and <span className="font-bold" style={{ color: C.green }}>leaves</span> (final decisions). Hover any node to learn about it.</p>
                        <DecisionTreeViz />
                    </div>
                </Card>

                {/* Section 2 */}
                <Card delay={0.12}>
                    <SectionHeader number={2} title="Splitting — How the Tree Decides Where to Split" subtitle="Drag the threshold to minimize Gini impurity" />
                    <div className="mt-6 space-y-4">
                        <p className="text-white/50 text-sm leading-relaxed">The algorithm tests every possible split and picks the one that creates the most "pure" groups — where each side is mostly one class. This is measured by <span className="font-bold" style={{ color: C.amber }}>Gini Impurity</span>.</p>
                        <SplittingViz />
                    </div>
                </Card>

                {/* Section 3 */}
                <Card delay={0.14}>
                    <SectionHeader number={3} title="Pruning — Preventing Overfitting" subtitle="Compare full vs pruned tree" />
                    <div className="mt-6 space-y-4">
                        <p className="text-white/50 text-sm leading-relaxed">A tree that perfectly fits training data might fail on new data — it memorizes noise. Pruning removes unnecessary branches, creating a simpler, more generalizable model.</p>
                        <PruningDemo />
                    </div>
                </Card>

                {/* Section 4 */}
                <Card delay={0.16}>
                    <SectionHeader number={4} title="Real-World Demo — Medical Diagnosis" subtitle="Navigate an actual decision tree" />
                    <div className="mt-6 space-y-4">
                        <p className="text-white/50 text-sm leading-relaxed">Experience how a medical AI uses a decision tree to triage patients. Answer the questions and follow the path to a diagnosis.</p>
                        <DiagnosisDemo />
                    </div>
                </Card>

                {/* Real world */}
                <div className="space-y-5">
                    <Reveal><h2 className="text-2xl sm:text-4xl font-black text-white text-center" style={{ fontFamily: "'Georgia',serif" }}><G from={C.amber} to={C.coral}>Real-World</G> Applications</h2></Reveal>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {[{ icon: "🏥", title: "Medical Diagnosis", desc: "Symptom-based patient triage, disease risk assessment, treatment path selection." }, { icon: "💳", title: "Credit Scoring", desc: "Banks use trees to evaluate loan applications: income, credit history, employment." }, { icon: "🎯", title: "Recommendations", desc: "Netflix, Amazon, Spotify — decision trees power \"users like you also liked\" systems." }].map((item, i) => (
                            <Reveal key={i} delay={i * 0.08}>
                                <motion.div whileHover={{ y: -5, boxShadow: `0 16px 50px ${C.amber}18` }} className="rounded-2xl border p-5 text-center" style={{ background: C.card, borderColor: C.border }}>
                                    <motion.div className="text-4xl mb-3" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i }}>{item.icon}</motion.div>
                                    <h3 className="font-bold text-white mb-2 text-sm">{item.title}</h3>
                                    <p className="text-white/38 text-xs leading-relaxed">{item.desc}</p>
                                </motion.div>
                            </Reveal>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <Reveal delay={0.1}>
                    <div className="rounded-2xl border-2 border-dashed p-8 text-center" style={{ borderColor: `${C.amber}35` }}>
                        <div className="text-4xl mb-3">🎮</div>
                        <h3 className="text-xl font-black text-white mb-2">Ready for the hardest concept in ML?</h3>
                        <p className="text-white/40 text-sm mb-6">You've mastered how trees make decisions. Now explore how agents learn by trial and error.</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/reinforcement-learning">
                                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                    className="px-6 py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
                                    style={{ background: `linear-gradient(135deg,${C.amber},${C.coral})` }}>Next: Reinforcement Learning →</motion.div>
                            </Link>
                            <Link href="/neural-networks">
                                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                    className="px-6 py-3 rounded-xl text-sm font-semibold text-white/55 hover:text-white border border-white/10 hover:border-white/25 transition-colors cursor-pointer">‹ Neural Networks</motion.div>
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
