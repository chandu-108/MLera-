
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
                            {["Home", "Learning Path", "Neural Networks"].map((item, i) => (
                                <span key={i} className="flex items-center gap-2">{i > 0 && <span className="text-white/20">›</span>}
                                    <span className={i === 2 ? "text-white/60" : "text-white/28 cursor-pointer hover:text-white/55"}>{item}</span>
                                </span>
                            ))}
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
                            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm text-white/55 hover:text-white transition-colors"
                                style={{ borderColor: C.border, background: "rgba(255,255,255,0.03)" }}>‹ Previous Module</motion.button>
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
                            <motion.a href="/decision-tree" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                className="px-6 py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
                                style={{ background: `linear-gradient(135deg,${C.coral},${C.purple})` }}>Next: Decision Trees →</motion.a>
                            <motion.a href="/" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                className="px-6 py-3 rounded-xl text-sm font-semibold text-white/55 hover:text-white border border-white/10 hover:border-white/25 transition-colors cursor-pointer">
                                Back to Learning Path
                            </motion.a>
                        </div>
                    </div>
                </Reveal>
            </main>

            <footer className="relative z-10 border-t py-8 px-6 text-center" style={{ borderColor: C.border }}>
                <div className="flex items-center justify-center gap-2 mb-2"><NeuralLogo size={24} />
                    <span className="text-sm font-black"><span style={{ color: C.coral }}>ML</span><span style={{ color: C.purple }}>era</span></span>
                </div>
                <p className="text-white/18 text-xs font-mono">© 2025 MLera · IIIT Dharwad Research Park</p>
            </footer>
        </div>
    );
}  
