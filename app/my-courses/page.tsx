"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

const C = {
    teal: "#2DD4BF",
    purple: "#A855F7",
    navy: "#0D0B1E",
    border: "rgba(255,255,255,0.05)",
};

function G({ children }: { children: React.ReactNode }) {
    return <span className="bg-clip-text text-transparent inline" style={{ backgroundImage: "linear-gradient(135deg,#2DD4BF 0%,#3B82F6 40%,#A855F7 100%)" }}>{children}</span>;
}

export default function MyCoursesPage() {
    const courses = [
        { title: "Neural Networks Fundamentals", progress: 0, mod: "Module 3", color: C.purple, active: true },
        { title: "Decision Trees & Ensembles", progress: 0, mod: "Module 4", color: "#FF6B6B", active: true },
        { title: "Reinforcement Learning", progress: 0, mod: "Module 5", color: "#FBBF24", active: false },
        { title: "Deep Learning Architectures", progress: 0, mod: "Module 6", color: C.teal, active: false },
    ];

    return (
        <div className="min-h-screen font-sans text-foreground overflow-hidden">
            <Navbar />

            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.08]" style={{ background: C.teal }} />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(rgba(45,212,191,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            </div>

            <main className="relative z-10 pt-32 pb-24 px-6 max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-16">
                    <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight" style={{ fontFamily: "'Georgia',serif" }}>
                        Pick up where<br />you <G>left off.</G>
                    </h1>
                    <p className="text-lg text-white/50 max-w-xl">
                        Track your progress across all strictly structured MLera paths. Every concept mastered brings you one step closer to fluency.
                    </p>
                </motion.div>

                <div className="space-y-6">
                    {courses.map((c, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                            className={`p-6 md:p-8 rounded-2xl border ${c.active ? 'opacity-100 hover:bg-white/[0.02]' : 'opacity-40'} transition-colors relative overflow-hidden`}
                            style={{ background: "rgba(255,255,255,0.015)", borderColor: C.border }}>

                            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: c.progress > 0 ? c.color : 'transparent' }} />

                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                                <div>
                                    <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: c.color }}>{c.mod}</div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{c.title}</h3>
                                    <div className="text-sm text-white/40 font-mono">
                                        {c.progress > 0 ? (c.progress === 100 ? "Completed" : "In Progress") : "Not Started"}
                                    </div>
                                </div>

                                <div className="w-full md:w-64">
                                    <div className="flex justify-between text-xs font-mono text-white/40 mb-2">
                                        <span>Progress</span><span>{c.progress}%</span>
                                    </div>
                                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                                        <motion.div className="h-full rounded-full" style={{ background: c.color }} initial={{ width: 0 }} animate={{ width: `${c.progress}%` }} transition={{ duration: 1, delay: 0.5 }} />
                                    </div>
                                    <button className="mt-4 w-full py-3 rounded-xl text-sm font-bold transition-all"
                                        style={{ background: c.active ? (c.progress > 0 ? `${c.color}20` : 'rgba(255,255,255,0.05)') : 'transparent', color: c.active ? (c.progress > 0 ? c.color : 'white') : 'rgba(255,255,255,0.3)', border: `1px solid ${c.active ? (c.progress > 0 ? `${c.color}40` : 'rgba(255,255,255,0.1)') : 'rgba(255,255,255,0.05)'}` }}>
                                        {c.progress === 0 ? (c.active ? "Start Learning" : "Locked") : (c.progress === 100 ? "Review Material" : "Continue Learning →")}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
