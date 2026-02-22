

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

            <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
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
