"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

const C = {
    coral: "#FF6B6B",
    purple: "#A855F7",
    navy: "#0D0B1E",
    amber: "#f59e0b",
    teal: "#2DD4BF",
    card: "rgba(255,255,255,0.02)",
    border: "rgba(255,255,255,0.05)",
};

function G({ children }: { children: React.ReactNode }) {
    return <span className="bg-clip-text text-transparent inline" style={{ backgroundImage: "linear-gradient(135deg,#FF6B6B 0%,#A855F7 100%)" }}>{children}</span>;
}

export default function LexiconPage() {
    const [active, setActive] = useState(0);
    const [search, setSearch] = useState("");

    const allTerms = [
        { term: "Epoch", cat: "Training", def: "One complete pass through the entire training dataset during the training of a neural network.", formula: "Epoch = (Total Samples) / (Batch Size) iterations", related: ["Batch", "Iteration", "Training Loop"] },
        { term: "Gradient Descent", cat: "Optimization", def: "An iterative algorithm that minimizes a loss function by repeatedly nudging parameters in the direction of steepest descent — the negative gradient.", formula: "θ ← θ − α · ∇J(θ)", related: ["Learning Rate", "Loss Function", "Backpropagation"] },
        { term: "Overfitting", cat: "Model Behavior", def: "When a model memorizes training data noise instead of learning general patterns — performing brilliantly on training but poorly on anything new.", formula: "train_acc↑↑ · val_acc↓↓", related: ["Regularization", "Dropout", "Cross-Validation"] },
        { term: "Attention Mechanism", cat: "Deep Learning", def: "A mechanism that lets models dynamically weight the importance of different input positions when producing each output.", formula: "Attn(Q,K,V) = softmax(QKᵀ/√dₖ)V", related: ["Transformer", "Self-Attention", "BERT"] },
        { term: "Backpropagation", cat: "Training", def: "The algorithm for computing gradients of the loss w.r.t. every parameter by applying the chain rule backward through the computation graph.", formula: "∂L/∂W = (∂L/∂a)(∂a/∂W)", related: ["Chain Rule", "Gradient Descent", "Forward Pass"] },
        { term: "Random Forest", cat: "Ensembles", def: "An ensemble learning method that constructs a multitude of decision trees at training time and outputs the mode of their classes.", formula: "ŷ = 1/k ∑(treeᵢ(x))", related: ["Decision Tree", "Bagging", "Ensemble"] }
    ];

    const terms = allTerms.filter(t => t.term.toLowerCase().includes(search.toLowerCase()) || t.cat.toLowerCase().includes(search.toLowerCase()));
    const t = terms[active] || terms[0];

    return (
        <div className="min-h-screen font-sans text-foreground overflow-hidden">
            <Navbar />

            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.06]" style={{ background: C.purple }} />
                <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(rgba(168,85,247,1) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
            </div>

            <main className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-12">
                    <span className="text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full border mb-6 inline-block" style={{ borderColor: `${C.purple}40`, color: C.purple, background: `${C.purple}10` }}>
                        Built-in Lexicon
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight" style={{ fontFamily: "'Georgia',serif" }}>
                        Every term. <G>Defined.</G>
                    </h1>

                    <div className="max-w-md">
                        <input
                            type="text"
                            placeholder="Search 500+ ML concepts..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setActive(0); }}
                            className="w-full h-14 px-6 rounded-xl border outline-none font-mono text-sm"
                            style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "white" }}
                        />
                    </div>
                </motion.div>

                {terms.length > 0 ? (
                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scroll">
                            {terms.map((tm, i) => (
                                <button key={i} onClick={() => setActive(i)} className={`w-full text-left p-4 rounded-xl border transition-all ${active === i ? '' : 'hover:bg-white/[0.02]'}`}
                                    style={active === i ? { background: `linear-gradient(135deg,${C.coral}15,${C.purple}15)`, borderColor: `${C.purple}50` } : { background: C.card, borderColor: C.border }}>
                                    <div className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: active === i ? C.coral : "rgba(255,255,255,0.3)" }}>{tm.cat}</div>
                                    <div className={`font-bold ${active === i ? 'text-white' : 'text-white/70'}`}>{tm.term}</div>
                                </button>
                            ))}
                        </div>

                        <div className="lg:col-span-2">
                            <AnimatePresence mode="wait">
                                <motion.div key={active} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                                    className="rounded-3xl p-8 md:p-12 border relative overflow-hidden" style={{ background: "rgba(255,255,255,0.015)", borderColor: `${C.purple}25` }}>
                                    <div className="absolute top-0 right-0 w-64 h-64 blur-3xl opacity-[0.15] pointer-events-none" style={{ background: "radial-gradient(circle,#A855F7,transparent)" }} />

                                    <span className="text-xs font-mono uppercase tracking-widest px-2 py-1 rounded mb-4 inline-block" style={{ background: `${C.purple}15`, color: C.purple }}>{t.cat}</span>
                                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: "'Georgia',serif" }}>{t.term}</h2>

                                    <p className="text-lg text-white/60 leading-relaxed mb-8">{t.def}</p>

                                    <div className="rounded-xl p-5 font-mono text-sm mb-8" style={{ background: `${C.coral}10`, borderLeft: `3px solid ${C.coral}`, color: "#FF9999" }}>
                                        {t.formula}
                                    </div>

                                    <div>
                                        <div className="text-white/30 text-xs font-mono uppercase tracking-widest mb-3">Related Concepts</div>
                                        <div className="flex flex-wrap gap-2">
                                            {t.related.map(r => (
                                                <span key={r} className="text-sm px-4 py-2 rounded-lg border cursor-pointer hover:bg-white/5 transition-colors" style={{ borderColor: C.border, color: "rgba(255,255,255,0.5)" }}>
                                                    {r}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 text-white/30 font-mono">No terms found matching "{search}"</div>
                )}
            </main>
        </div>
    );
}
