"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const C = {
  coral: "#FF6B6B", purple: "#A855F7", navy: "#0D0B1E",
  green: "#4ADE80", teal: "#2DD4BF", blue: "#60A5FA", amber: "#FBBF24",
  card: "rgba(255,255,255,0.028)", border: "rgba(255,255,255,0.07)",
};

function G({ children, from = C.green, to = C.teal }) {
  return <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg,${from},${to})` }}>{children}</span>;
}
function Reveal({ children, delay = 0, y = 40, className }) {
  const ref = useRef(null); const inV = useInView(ref, { once: true, margin: "-50px" });
  return <motion.div ref={ref} className={className} initial={{ opacity: 0, y }} animate={inV ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
function NeuralLogo({ size = 32 }) {
  const nodes = [{ x: 14, y: 6 }, { x: 34, y: 10 }, { x: 8, y: 22 }, { x: 28, y: 18 }, { x: 44, y: 26 }, { x: 14, y: 34 }, { x: 34, y: 38 }, { x: 20, y: 50 }];
  const edges = [[0, 3], [1, 3], [2, 3], [3, 4], [3, 5], [3, 6], [5, 7], [6, 7], [4, 6]];
  return (<svg width={size} height={size} viewBox="0 0 52 56" fill="none" overflow="visible">
    <defs><linearGradient id="nlg3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={C.coral} /><stop offset="100%" stopColor={C.purple} /></linearGradient>
      <filter id="nglow3"><feGaussianBlur stdDeviation="1.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
    {edges.map(([a, b], i) => <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="url(#nlg3)" strokeWidth="1.2" strokeOpacity="0.5" />)}
    {nodes.map((n, i) => <circle key={i} cx={n.x} cy={n.y} r="3" fill="url(#nlg3)" filter="url(#nglow3)" />)}
  </svg>);
}
function Navbar() {
  return (<motion.nav initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(13,11,30,0.92)", borderBottom: `1px solid ${C.border}`, backdropFilter: "blur(16px)" }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 group">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative flex items-center justify-center -ml-2 sm:ml-0">
          <Image src="/navbar-logo-2.png" alt="MLera Logo" width={120} height={40} className="object-contain w-[100px] sm:w-[120px]" priority />
        </motion.div>
      </Link>
      <div className="flex items-center gap-3">
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-white/30 font-mono"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Module 5 of 5</span>
        <Link href="/">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="text-xs px-4 py-2 rounded-lg font-semibold text-white" style={{ background: `linear-gradient(135deg,${C.coral},${C.purple})` }}>Dashboard</motion.button>
        </Link>
      </div>
    </div>
  </motion.nav>);
}
function Card({ children, delay = 0, glow = false }) {
  return (<Reveal delay={delay}><motion.div whileHover={{ boxShadow: `0 8px 60px rgba(74,222,128,${glow ? "0.12" : "0.06"})` }} className="rounded-2xl border p-6 sm:p-8 relative overflow-hidden" style={{ background: C.card, borderColor: C.border }}>
    <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.03] pointer-events-none" style={{ background: `radial-gradient(circle,${C.green},transparent)` }} />
    {children}
  </motion.div></Reveal>);
}
function SectionHeader({ number, title, subtitle }) {
  return (<div className="flex items-start gap-4 mb-2"><motion.div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
    style={{ background: `linear-gradient(135deg,${C.green},${C.teal})` }} whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 400 }}>{number}</motion.div>
    <div><h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>{subtitle && <p className="text-xs text-white/35 font-mono mt-0.5">{subtitle}</p>}</div>
  </div>);
}

// ─── ★ ENHANCED GRID WORLD Q-LEARNING ────────────────────────────────────────
const GRID_SIZE = 5;
const GOAL = { r: 4, c: 4 };
const TRAPS = [{ r: 1, c: 1 }, { r: 2, c: 3 }, { r: 3, c: 1 }];
const WALLS = [{ r: 1, c: 3 }, { r: 2, c: 1 }];

const isGoal = (r, c) => r === GOAL.r && c === GOAL.c;
const isTrap = (r, c) => TRAPS.some(t => t.r === r && t.c === c);
const isWall = (r, c) => WALLS.some(w => w.r === r && w.c === c);

function GridWorld() {
  const [agentPos, setAgentPos] = useState({ r: 0, c: 0 });
  const [trail, setTrail] = useState([{ r: 0, c: 0 }]);
  const [steps, setSteps] = useState(0);
  const [reward, setReward] = useState(0);
  const [status, setStatus] = useState("idle");
  const [episode, setEpisode] = useState(1);
  const [qTable, setQTable] = useState({});
  const [particles, setParticles] = useState([]);
  const [winStreak, setWinStreak] = useState(0);
  const [episodeHistory, setEpisodeHistory] = useState([]);
  const [autoPlay, setAutoPlay] = useState(false);
  const intervalRef = useRef(null);
  const autoRef = useRef(null);

  const dirs = [{ r: -1, c: 0, label: "↑" }, { r: 1, c: 0, label: "↓" }, { r: 0, c: -1, label: "←" }, { r: 0, c: 1, label: "→" }];

  const getQ = useCallback((r, c, a) => qTable[`${r},${c},${a}`] || 0, [qTable]);
  const setQ = useCallback((r, c, a, val) => setQTable(prev => ({ ...prev, [`${r},${c},${a}`]: val })), []);

  const getBestAction = useCallback((r, c) => {
    let best = 0, bestV = -Infinity;
    dirs.forEach((_, i) => { const v = getQ(r, c, i); if (v > bestV) { bestV = v; best = i; } });
    return best;
  }, [getQ]);

  const step = useCallback((r, c, epsilon = 0.3) => {
    let actionIdx;
    if (Math.random() < epsilon) actionIdx = Math.floor(Math.random() * 4);
    else actionIdx = getBestAction(r, c);
    const d = dirs[actionIdx];
    const nr = Math.max(0, Math.min(GRID_SIZE - 1, r + d.r));
    const nc = Math.max(0, Math.min(GRID_SIZE - 1, c + d.c));
    if (isWall(nr, nc)) return { nr: r, nc: c, reward: -0.1, done: false, actionIdx };
    let rew = -0.1; let done = false;
    if (isGoal(nr, nc)) { rew = 1; done = true; }
    else if (isTrap(nr, nc)) { rew = -1; done = true; }
    const lr = 0.3, gamma = 0.9;
    const old = getQ(r, c, actionIdx);
    const nextMax = Math.max(...dirs.map((_, i) => getQ(nr, nc, i)));
    const newQ = old + lr * (rew + gamma * nextMax - old);
    setQ(r, c, actionIdx, newQ);
    return { nr, nc, reward: rew, done, actionIdx };
  }, [getQ, setQ, getBestAction]);

  const spawnParticles = (r, c, color, count = 8) => {
    const ps = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i, r, c,
      vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3,
      color, life: 1
    }));
    setParticles(prev => [...prev, ...ps]);
    setTimeout(() => setParticles(prev => prev.filter(p => !ps.find(pp => pp.id === p.id))), 800);
  };

  const runEpisode = useCallback(() => {
    if (status === "running") return;
    setStatus("running");
    let r = 0, c = 0, totalR = 0, s = 0;
    setAgentPos({ r, c }); setTrail([{ r, c }]);
    const eps = Math.max(0.05, 0.8 / episode);
    intervalRef.current = setInterval(() => {
      const { nr, nc, reward: rew, done } = step(r, c, eps);
      r = nr; c = nc; totalR += rew; s++;
      setAgentPos({ r, c });
      setTrail(prev => [...prev.slice(-10), { r, c }]);
      setSteps(s); setReward(+totalR.toFixed(2));
      if (done || s > 60) {
        clearInterval(intervalRef.current);
        const won = isGoal(r, c);
        const lost = isTrap(r, c);
        setStatus(won ? "won" : lost ? "lost" : "timeout");
        if (won) { spawnParticles(r, c, C.green, 12); setWinStreak(w => w + 1); }
        else { spawnParticles(r, c, C.coral, 8); setWinStreak(0); }
        setEpisode(e => e + 1);
        setEpisodeHistory(h => [...h.slice(-19), { ep: episode, reward: +totalR.toFixed(2), won, steps: s }]);
      }
    }, 140);
  }, [step, episode, status]);

  useEffect(() => {
    if (autoPlay && status !== "running") {
      autoRef.current = setTimeout(() => runEpisode(), 600);
    }
    return () => clearTimeout(autoRef.current);
  }, [autoPlay, status, runEpisode]);

  useEffect(() => () => { clearInterval(intervalRef.current); clearTimeout(autoRef.current); }, []);

  const reset = () => { clearInterval(intervalRef.current); clearTimeout(autoRef.current); setAutoPlay(false); setAgentPos({ r: 0, c: 0 }); setTrail([{ r: 0, c: 0 }]); setSteps(0); setReward(0); setStatus("idle"); setQTable({}); setEpisode(1); setWinStreak(0); setEpisodeHistory([]); };

  const qVal = (r, c) => Math.max(...dirs.map((_, i) => getQ(r, c, i)));
  const getBestDir = (r, c) => { let best = 0, bestV = -Infinity; dirs.forEach((d, i) => { const v = getQ(r, c, i); if (v > bestV) { bestV = v; best = i; } }); return bestV > 0 ? dirs[best].label : "·"; };

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5 items-start">
        {/* Grid */}
        <div className="space-y-3 relative">
          <div className="grid gap-1.5 relative" style={{ gridTemplateColumns: `repeat(${GRID_SIZE},1fr)` }}>
            {Array.from({ length: GRID_SIZE }).map((_, r) =>
              Array.from({ length: GRID_SIZE }).map((_, c) => {
                const isAgent = agentPos.r === r && agentPos.c === c;
                const trailIdx = trail.findIndex(t => t.r === r && t.c === c);
                const inTrail = trailIdx >= 0 && !isAgent;
                const trailOpacity = inTrail ? (trailIdx / trail.length) * 0.4 : 0;
                const qv = qVal(r, c);
                const wall = isWall(r, c);
                const goal = isGoal(r, c);
                const trap = isTrap(r, c);
                const bestDir = episode > 2 && !wall && !goal && !trap ? getBestDir(r, c) : null;
                return (
                  <motion.div key={`${r}-${c}`}
                    className="aspect-square rounded-lg flex items-center justify-center relative overflow-hidden select-none"
                    style={{ background: goal ? `${C.green}22` : trap ? `${C.coral}22` : wall ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${goal ? C.green : trap ? C.coral : "rgba(255,255,255,0.06)"}` }}
                    animate={isAgent ? { scale: [1, 1.12, 1] } : {}} transition={{ duration: 0.4, repeat: isAgent ? Infinity : 0 }}>
                    {!wall && !goal && !trap && qv !== 0 && (
                      <div className="absolute inset-0 rounded-lg" style={{ background: qv > 0 ? C.green : C.coral, opacity: Math.min(Math.abs(qv) * 0.35, 0.4) }} />
                    )}
                    {inTrail && <motion.div className="absolute inset-1 rounded" style={{ background: `${C.teal}`, opacity: trailOpacity }} initial={{ opacity: 0 }} animate={{ opacity: trailOpacity }} />}
                    {isAgent && (
                      <motion.div className="w-4 h-4 rounded-full z-10 shadow-lg"
                        style={{ background: `linear-gradient(135deg,${C.green},${C.teal})`, boxShadow: `0 0 14px ${C.green}90` }}
                        animate={{ scale: [1, 1.25, 1], boxShadow: [`0 0 14px ${C.green}90`, `0 0 22px ${C.green}`, `0 0 14px ${C.green}90`] }}
                        transition={{ duration: 0.5, repeat: Infinity }} />
                    )}
                    {goal && <span className="text-lg z-10">🏁</span>}
                    {trap && <span className="text-sm z-10">💀</span>}
                    {wall && <span className="text-xs z-10 text-white/15">▪</span>}
                    {bestDir && bestDir !== "·" && !isAgent && (
                      <span className="absolute bottom-0.5 left-1 text-[10px] font-bold z-10 opacity-60" style={{ color: C.teal }}>{bestDir}</span>
                    )}
                    {!wall && !goal && !trap && qv !== 0 && (
                      <span className="absolute top-0.5 right-1 text-[8px] font-mono opacity-50 z-10" style={{ color: qv > 0 ? C.green : C.coral }}>{qv.toFixed(1)}</span>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-mono">
            {[{ col: C.green, label: "Goal 🏁" }, { col: C.coral, label: "Trap 💀" }, { col: "rgba(255,255,255,0.2)", label: "Wall" }, { col: C.teal, label: "Agent 🤖" }, { col: "rgba(45,212,191,0.4)", label: "Trail" }].map(l => (
              <span key={l.label} className="flex items-center gap-1.5 text-white/35"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: l.col }} />{l.label}</span>
            ))}
          </div>
        </div>

        {/* Stats & Controls */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2.5">
            {[{ label: "Episode", val: episode, col: C.purple }, { label: "Steps", val: steps, col: C.teal }, { label: "Reward", val: reward, col: reward >= 0 ? C.green : C.coral }, { label: "Win Streak", val: `${winStreak}🔥`, col: C.amber }].map(s => (
              <div key={s.label} className="rounded-xl py-3 px-3 text-center border" style={{ background: "rgba(255,255,255,0.02)", borderColor: C.border }}>
                <div className="text-[10px] font-mono text-white/30 mb-1 uppercase tracking-widest">{s.label}</div>
                <motion.div key={String(s.val)} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-base font-black font-mono" style={{ color: s.col }}>{s.val}</motion.div>
              </div>
            ))}
          </div>

          {/* Status banner */}
          <AnimatePresence mode="wait">
            <motion.div key={status} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="rounded-xl px-4 py-3 text-center text-sm font-bold border"
              style={{ background: status === "won" ? `${C.green}15` : status === "lost" ? `${C.coral}15` : `${C.teal}10`, borderColor: status === "won" ? `${C.green}30` : status === "lost" ? `${C.coral}30` : `${C.teal}20`, color: status === "won" ? C.green : status === "lost" ? C.coral : status === "running" ? C.teal : "rgba(255,255,255,0.4)" }}>
              {status === "won" ? "🏆 Goal Reached! Great learning!" : status === "lost" ? "💀 Trap! But the agent learns..." : status === "running" ? "⚡ Agent is exploring..." : "⏸ Ready — Run an episode!"}
            </motion.div>
          </AnimatePresence>

          {/* Episode chart */}
          {episodeHistory.length > 1 && (
            <div className="rounded-xl p-3 border" style={{ background: "rgba(0,0,0,0.3)", borderColor: C.border }}>
              <div className="text-[10px] font-mono text-white/30 mb-2 uppercase tracking-widest">Reward History (last 20)</div>
              <div className="flex items-end gap-0.5 h-14">
                {episodeHistory.map((ep, i) => {
                  const norm = (ep.reward + 1) / 2;
                  return <motion.div key={i} className="flex-1 rounded-t" initial={{ height: 0 }} animate={{ height: `${Math.max(10, norm * 100)}%` }}
                    style={{ background: ep.won ? C.green : C.coral, opacity: 0.7 }} title={`Ep ${ep.ep}: ${ep.reward}`} />;
                })}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <motion.button onClick={runEpisode} disabled={status === "running"}
              whileHover={status !== "running" ? { scale: 1.04, boxShadow: `0 0 30px ${C.green}40` } : {}} whileTap={status !== "running" ? { scale: 0.97 } : {}}
              className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
              style={{ background: `linear-gradient(135deg,${C.green},${C.teal})`, opacity: status === "running" ? 0.6 : 1 }}>
              {status === "running" ? "⚡ Running..." : "▶ Run Episode"}
            </motion.button>
            <motion.button onClick={() => setAutoPlay(a => !a)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="px-3 py-3 rounded-xl text-xs font-bold border transition-all"
              style={{ borderColor: autoPlay ? `${C.amber}60` : C.border, background: autoPlay ? `${C.amber}15` : "rgba(255,255,255,0.02)", color: autoPlay ? C.amber : "rgba(255,255,255,0.4)" }}>
              {autoPlay ? "⏹ Stop" : "🔁 Auto"}
            </motion.button>
            <motion.button onClick={reset} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="px-3 py-3 rounded-xl text-sm font-semibold text-white/55 border hover:text-white transition-colors"
              style={{ borderColor: C.border, background: "rgba(255,255,255,0.02)" }}>↺</motion.button>
          </div>
          <p className="text-xs text-white/28 font-mono text-center">
            {episode > 5 ? "🧠 Arrows = learned policy direction!" : "Run 5+ episodes to see learned policy arrows appear."}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── ★ INTERACTIVE BANDIT GAME ─────────────────────────────────────────────
function BanditGame() {
  const [pulls, setPulls] = useState([0, 0, 0, 0]);
  const [rewards, setRewards] = useState([0, 0, 0, 0]);
  const [totalPulls, setTotalPulls] = useState(0);
  const [lastReward, setLastReward] = useState(null);
  const [lastArm, setLastArm] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [flashing, setFlashing] = useState(null);
  // Hidden true probs
  const trueProbs = [0.2, 0.5, 0.8, 0.4];
  const colors = [C.coral, C.amber, C.green, C.blue];
  const names = ["Arm A", "Arm B", "Arm C", "Arm D"];

  const pull = (i) => {
    if (totalPulls >= 20) return;
    const won = Math.random() < trueProbs[i];
    const r = won ? 1 : 0;
    setFlashing(i);
    setTimeout(() => setFlashing(null), 500);
    setPulls(p => { const n = [...p]; n[i]++; return n; });
    setRewards(rw => { const n = [...rw]; n[i] += r; return n; });
    setTotalPulls(t => t + 1);
    setLastReward(r);
    setLastArm(i);
  };

  const reset = () => { setPulls([0, 0, 0, 0]); setRewards([0, 0, 0, 0]); setTotalPulls(0); setLastReward(null); setLastArm(null); setRevealed(false); };

  const avgReward = (i) => pulls[i] > 0 ? (rewards[i] / pulls[i]).toFixed(2) : "—";

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-4 border text-sm text-white/50 leading-relaxed" style={{ borderColor: C.border, background: "rgba(255,255,255,0.02)" }}>
        🎰 You have <span className="font-bold text-white">{20 - totalPulls} pulls left</span>. Each arm has a hidden win probability. Explore to find the best arm, then exploit it! Classic <span style={{ color: C.teal }}>Multi-Armed Bandit</span> problem.
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {names.map((name, i) => (
          <motion.div key={i} className="rounded-2xl border p-4 text-center space-y-3"
            style={{ background: flashing === i ? `${colors[i]}20` : "rgba(255,255,255,0.02)", borderColor: flashing === i ? colors[i] : C.border }}
            animate={flashing === i ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 0.3 }}>
            <div className="text-2xl">{["🎰", "🎲", "🎯", "🃏"][i]}</div>
            <div className="font-bold text-white text-sm">{name}</div>
            <motion.button onClick={() => pull(i)} disabled={totalPulls >= 20}
              whileHover={totalPulls < 20 ? { scale: 1.06, boxShadow: `0 0 20px ${colors[i]}50` } : {}}
              whileTap={totalPulls < 20 ? { scale: 0.95 } : {}}
              className="w-full py-2 rounded-xl text-xs font-black text-black"
              style={{ background: `linear-gradient(135deg,${colors[i]},${colors[i]}aa)`, opacity: totalPulls >= 20 ? 0.4 : 1 }}>
              PULL
            </motion.button>
            <div className="space-y-1 text-xs font-mono">
              <div className="text-white/35">Pulls: <span style={{ color: colors[i] }}>{pulls[i]}</span></div>
              <div className="text-white/35">Win rate: <span className="text-white/70">{avgReward(i)}</span></div>
              {/* Win rate bar */}
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div className="h-full rounded-full" style={{ background: colors[i] }}
                  animate={{ width: pulls[i] > 0 ? `${(rewards[i] / pulls[i]) * 100}%` : "0%" }} transition={{ duration: 0.4 }} />
              </div>
            </div>
            {revealed && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-xs font-mono rounded-lg py-1" style={{ background: `${colors[i]}20`, color: colors[i] }}>
                True: {(trueProbs[i] * 100).toFixed(0)}%
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Last result */}
      <AnimatePresence>
        {lastReward !== null && (
          <motion.div key={`${totalPulls}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="rounded-xl p-3 border text-sm text-center font-bold"
            style={{ background: lastReward ? `${C.green}15` : `${C.coral}15`, borderColor: lastReward ? `${C.green}30` : `${C.coral}30`, color: lastReward ? C.green : C.coral }}>
            {lastReward ? "🎉 Win! +1 reward" : "😞 Loss — keep exploring"}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        {totalPulls >= 20 && !revealed && (
          <motion.button onClick={() => setRevealed(true)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04, boxShadow: `0 0 30px ${C.amber}40` }} whileTap={{ scale: 0.97 }}
            className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
            style={{ background: `linear-gradient(135deg,${C.amber},${C.coral})` }}>
            🔍 Reveal True Probabilities!
          </motion.button>
        )}
        <motion.button onClick={reset} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          className="flex-1 py-3 rounded-xl font-bold text-sm border text-white/60 hover:text-white"
          style={{ borderColor: C.border, background: "rgba(255,255,255,0.02)" }}>↺ New Game</motion.button>
      </div>

      {revealed && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-4 border text-sm" style={{ borderColor: `${C.green}30`, background: `${C.green}08` }}>
          <div className="font-bold text-white mb-2">🧠 Analysis</div>
          <p className="text-white/50 text-xs leading-relaxed">The best arm was <span style={{ color: C.green }}>Arm C (80% win rate)</span>. Did you discover it through exploration? An optimal ε-greedy agent would spend ~20% time exploring and 80% exploiting the best arm.</p>
        </motion.div>
      )}
    </div>
  );
}

// ─── ★ REWARD CONCEPTS VISUALIZER ────────────────────────────────────────────
function RewardViz() {
  const [scenario, setScenario] = useState(0);
  const [animStep, setAnimStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const playRef = useRef(null);

  const scenarios = [
    {
      title: "Game Playing", icon: "🎮", col: C.teal, events: [
        { t: 0, r: 0, label: "Start" }, { t: 5, r: -0.1, label: "Move left" }, { t: 10, r: -0.1, label: "Move right" },
        { t: 15, r: -1, label: "Hit obstacle" }, { t: 20, r: -0.1, label: "Try again" }, { t: 25, r: 0.5, label: "Coin!" },
        { t: 30, r: -0.1, label: "Exploring" }, { t: 35, r: 1, label: "Level done!" },
      ]
    },
    {
      title: "Robot Navigation", icon: "🤖", col: C.purple, events: [
        { t: 0, r: 0, label: "Start" }, { t: 5, r: -0.1, label: "Step fwd" }, { t: 10, r: -0.5, label: "Bumped wall" },
        { t: 15, r: -0.1, label: "Backtrack" }, { t: 20, r: -0.1, label: "Turn left" }, { t: 25, r: -0.1, label: "Step fwd" },
        { t: 30, r: 0.3, label: "Closer!" }, { t: 35, r: 1, label: "Goal!" },
      ]
    },
    {
      title: "Self-Driving", icon: "🚗", col: C.amber, events: [
        { t: 0, r: 0, label: "Start" }, { t: 5, r: 0.1, label: "Smooth lane" }, { t: 10, r: -0.3, label: "Hard brake" },
        { t: 15, r: 0.1, label: "Safe follow" }, { t: 20, r: -0.5, label: "Lane drift" }, { t: 25, r: 0.2, label: "Signal" },
        { t: 30, r: 0.1, label: "Merge" }, { t: 35, r: 1, label: "Destination!" },
      ]
    },
  ];

  const sc = scenarios[scenario];
  const W = 420, H = 160, PAD = 40;
  const tMax = 35, rMin = -1.3, rMax = 1.3;
  const px = t => PAD + (t / tMax) * (W - PAD * 2);
  const py = r => H - PAD - ((r - rMin) / (rMax - rMin)) * (H - PAD * 2);

  let cumR = 0;
  const cumPts = sc.events.map(e => { cumR += e.r; return { t: e.t, r: cumR }; });
  const visibleEvents = sc.events.slice(0, animStep + 1);
  const visibleCum = cumPts.slice(0, animStep + 1);

  const playAnim = () => {
    setPlaying(true); setAnimStep(0);
    let s = 0;
    playRef.current = setInterval(() => {
      s++; setAnimStep(s);
      if (s >= sc.events.length - 1) { clearInterval(playRef.current); setPlaying(false); }
    }, 600);
  };

  useEffect(() => { setAnimStep(sc.events.length - 1); }, [scenario]);
  useEffect(() => () => clearInterval(playRef.current), []);

  const pathD = (pts) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${px(p.t)},${py(p.r)}`).join(" ");

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {scenarios.map((s, i) => (
          <motion.button key={i} onClick={() => { setScenario(i); setAnimStep(s.events.length - 1); }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
            style={{ borderColor: scenario === i ? `${s.col}60` : C.border, background: scenario === i ? `${s.col}15` : "rgba(255,255,255,0.02)", color: scenario === i ? s.col : "rgba(255,255,255,0.4)" }}>
            {s.icon} {s.title}
          </motion.button>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: "rgba(0,0,0,0.35)", border: `1px solid ${C.border}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          <line x1={PAD} y1={py(0)} x2={W - PAD} y2={py(0)} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
          <text x={PAD - 4} y={py(0) + 4} textAnchor="end" fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="monospace">0</text>
          <text x={PAD - 4} y={py(1) + 4} textAnchor="end" fill={C.green} fontSize="8" fontFamily="monospace">+1</text>
          <text x={PAD - 4} y={py(-1) + 4} textAnchor="end" fill={C.coral} fontSize="8" fontFamily="monospace">-1</text>

          {/* Cumulative reward path */}
          {visibleCum.length > 1 && (
            <motion.path d={pathD(visibleCum)} fill="none" stroke={sc.col} strokeWidth="2" strokeOpacity="0.7"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
          )}

          {/* Individual reward dots */}
          {visibleEvents.map((e, i) => (
            <g key={i}>
              <motion.circle cx={px(e.t)} cy={py(e.r)} r="5" fill={e.r >= 0 ? C.green : C.coral} stroke="white" strokeWidth="1.5" strokeOpacity="0.4"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, delay: 0.1 }} />
              {i === visibleEvents.length - 1 && (
                <motion.text x={px(e.t)} y={py(e.r) - 10} textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace" opacity="0.7"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{e.label}</motion.text>
              )}
            </g>
          ))}
        </svg>
      </div>

      <div className="flex gap-3">
        <motion.button onClick={playAnim} disabled={playing} whileHover={!playing ? { scale: 1.04 } : {}} whileTap={!playing ? { scale: 0.97 } : {}}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold text-black"
          style={{ background: `linear-gradient(135deg,${sc.col},${sc.col}aa)`, opacity: playing ? 0.6 : 1 }}>
          {playing ? "⏳ Animating..." : "▶ Replay Animation"}
        </motion.button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 text-center text-xs font-mono">
        {[{ label: "Total Steps", val: sc.events.length }, { label: "Total Reward", val: visibleCum[visibleCum.length - 1]?.r.toFixed(2) }, { label: "Final Event", val: visibleEvents[visibleEvents.length - 1]?.label }].map(s => (
          <div key={s.label} className="rounded-xl py-2 px-2 border" style={{ background: "rgba(255,255,255,0.02)", borderColor: C.border }}>
            <div className="text-white/30 text-[9px] uppercase tracking-widest mb-1">{s.label}</div>
            <div className="text-white font-bold text-sm">{s.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ★ POLICY EXPLORER WITH SIMULATION ───────────────────────────────────────
function PolicyExplorer() {
  const [selected, setSelected] = useState(1);
  const [simRunning, setSimRunning] = useState(false);
  const [simResult, setSimResult] = useState(null);
  const [epsilonVal, setEpsilonVal] = useState(0.3);
  const simRef = useRef(null);

  const policies = [
    { name: "Greedy", icon: "😤", col: C.coral, desc: "Always exploit — pick highest known reward. Fast but misses better options.", reward: 0.6, explore: 0 },
    { name: "ε-Greedy", icon: "🎯", col: C.teal, desc: "Explore with probability ε, otherwise exploit. Gold standard approach.", reward: 0.85, explore: 30 },
    { name: "Random", icon: "🎲", col: C.purple, desc: "Always explore randomly. Very slow to converge, but thorough.", reward: -0.1, explore: 100 },
    { name: "UCB", icon: "📈", col: C.amber, desc: "Upper Confidence Bound — tries less-visited actions optimistically.", reward: 0.9, explore: 15 },
  ];

  const p = policies[selected];

  const runSimulation = () => {
    setSimRunning(true); setSimResult(null);
    const epsilon = selected === 1 ? epsilonVal : selected === 0 ? 0 : selected === 2 ? 1 : 0.15;
    let totalR = 0, steps = 0, wins = 0;
    // Simulate 30 rounds
    for (let i = 0; i < 30; i++) {
      if (Math.random() < epsilon || i < 5) totalR += Math.random() > 0.5 ? 0.5 : -0.3;
      else totalR += Math.random() < 0.8 ? 1 : -0.1;
      steps++;
      if (totalR > 0) wins++;
    }
    setTimeout(() => {
      setSimResult({ reward: +totalR.toFixed(2), wins, steps });
      setSimRunning(false);
    }, 1200);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {policies.map((pol, i) => (
          <motion.button key={i} onClick={() => setSelected(i)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="rounded-xl p-3 border text-center transition-all"
            style={{ borderColor: selected === i ? `${pol.col}60` : C.border, background: selected === i ? `${pol.col}12` : "rgba(255,255,255,0.02)" }}>
            <div className="text-xl mb-1">{pol.icon}</div>
            <div className="text-xs font-bold" style={{ color: selected === i ? pol.col : "rgba(255,255,255,0.5)" }}>{pol.name}</div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={selected} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
          className="rounded-xl p-5 border" style={{ background: `${p.col}0a`, borderColor: `${p.col}30` }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{p.icon}</span>
            <div><h3 className="font-black text-white">{p.name} Policy</h3><p className="text-white/45 text-xs mt-0.5">{p.desc}</p></div>
          </div>

          {selected === 1 && (
            <div className="mb-4 p-3 rounded-xl border" style={{ borderColor: `${p.col}25`, background: `${p.col}08` }}>
              <div className="flex justify-between text-xs font-mono text-white/50 mb-2">
                <span>Epsilon (ε) = {epsilonVal.toFixed(2)}</span>
                <span className="text-white/30">{epsilonVal < 0.2 ? "More exploit" : epsilonVal > 0.6 ? "More explore" : "Balanced"}</span>
              </div>
              <input type="range" min="0.05" max="1" step="0.05" value={epsilonVal} onChange={e => setEpsilonVal(+e.target.value)}
                className="w-full accent-teal-400" style={{ accentColor: p.col }} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs font-mono text-white/30 mb-2">Expected Reward</div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div className="h-full rounded-full" style={{ background: p.col }} initial={{ width: 0 }} animate={{ width: `${(p.reward + 0.3) / 1.3 * 100}%` }} transition={{ duration: 0.8 }} />
              </div>
              <div className="text-sm font-black font-mono mt-1" style={{ color: p.col }}>{p.reward > 0 ? "+" : ""}{p.reward}</div>
            </div>
            <div>
              <div className="text-xs font-mono text-white/30 mb-2">Exploration %</div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div className="h-full rounded-full" style={{ background: C.purple }} initial={{ width: 0 }} animate={{ width: `${p.explore}%` }} transition={{ duration: 0.8 }} />
              </div>
              <div className="text-sm font-black font-mono mt-1" style={{ color: C.purple }}>{p.explore}%</div>
            </div>
          </div>

          <motion.button onClick={runSimulation} disabled={simRunning} whileHover={!simRunning ? { scale: 1.04 } : {}} whileTap={!simRunning ? { scale: 0.97 } : {}}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-black"
            style={{ background: `linear-gradient(135deg,${p.col},${p.col}cc)`, opacity: simRunning ? 0.6 : 1 }}>
            {simRunning ? "🔄 Simulating..." : "🧪 Simulate 30 Rounds"}
          </motion.button>

          <AnimatePresence>
            {simResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 grid grid-cols-3 gap-2">
                {[{ l: "Total Reward", v: simResult.reward, c: simResult.reward > 0 ? C.green : C.coral }, { l: "Win Rounds", v: simResult.wins, c: C.teal }, { l: "Steps", v: simResult.steps, c: C.purple }].map(s => (
                  <div key={s.l} className="rounded-lg py-2 text-center border" style={{ borderColor: `${s.c}25`, background: `${s.c}08` }}>
                    <div className="text-[9px] font-mono text-white/30 mb-0.5">{s.l}</div>
                    <div className="text-sm font-black font-mono" style={{ color: s.c }}>{s.v}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── ★ Q-TABLE EXPLAINER ─────────────────────────────────────────────────────
function QTableExplainer() {
  const [hover, setHover] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const states = ["S1 (start)", "S2", "S3", "S4 (trap)", "S5 (goal)"];
  const actions = ["↑", "↓", "←", "→"];
  const qVals = [
    [0.12, -0.3, 0.08, 0.45],
    [-0.1, 0.6, 0.2, -0.05],
    [0.35, 0.1, -0.2, 0.78],
    [-1, -1, -1, -1],
    [1, 1, 1, 1],
  ];
  const bestAction = (row) => {
    let best = 0, bestV = -Infinity;
    qVals[row].forEach((v, i) => { if (v > bestV) { bestV = v; best = i; } });
    return best;
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: C.border }}>
        <table className="w-full text-sm min-w-[320px]">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)" }}>
              <th className="text-left px-4 py-3 text-xs font-mono text-white/30 uppercase tracking-widest">State</th>
              {actions.map((a, ai) => <th key={a} className="px-4 py-3 text-xs font-mono text-white/30 uppercase tracking-widest">
                <span style={{ color: C.teal }}>{a}</span>
              </th>)}
              <th className="px-4 py-3 text-xs font-mono text-white/30 uppercase tracking-widest">Best</th>
            </tr>
          </thead>
          <tbody>
            {states.map((s, si) => (
              <motion.tr key={si} className="border-t transition-all cursor-pointer"
                style={{ borderColor: "rgba(255,255,255,0.04)", background: hover === si ? "rgba(255,255,255,0.03)" : "transparent" }}
                onMouseEnter={() => setHover(si)} onMouseLeave={() => setHover(null)}>
                <td className="px-4 py-3 text-white/60 text-xs font-mono font-bold">{s}</td>
                {qVals[si].map((v, ai) => (
                  <td key={ai} className="px-4 py-3 text-center" onClick={() => setSelectedCell({ si, ai, v })}>
                    <motion.span className="text-xs font-black font-mono px-2 py-1 rounded cursor-pointer"
                      style={{ background: bestAction(si) === ai ? `${v >= 0 ? C.green : C.coral}30` : `${v >= 0 ? C.green : C.coral}18`, color: v >= 0 ? C.green : C.coral, border: bestAction(si) === ai ? `1px solid ${v >= 0 ? C.green : C.coral}50` : "1px solid transparent" }}
                      whileHover={{ scale: 1.15 }}>
                      {v.toFixed(2)}{bestAction(si) === ai && " ★"}
                    </motion.span>
                  </td>
                ))}
                <td className="px-4 py-3 text-center">
                  <span className="text-base" style={{ color: C.amber }}>{actions[bestAction(si)]}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedCell && (
          <motion.div key={`${selectedCell.si}-${selectedCell.ai}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-xl p-4 border text-sm" style={{ background: `${selectedCell.v >= 0 ? C.green : C.coral}10`, borderColor: `${selectedCell.v >= 0 ? C.green : C.coral}30` }}>
            <div className="font-bold text-white mb-1">Q({states[selectedCell.si]}, {actions[selectedCell.ai]}) = {selectedCell.v.toFixed(2)}</div>
            <p className="text-white/50 text-xs">This means: in state <span className="text-white/80">{states[selectedCell.si]}</span>, taking action <span className="text-white/80">{actions[selectedCell.ai]}</span> has expected future reward of <span style={{ color: selectedCell.v >= 0 ? C.green : C.coral }}>{selectedCell.v.toFixed(2)}</span>. {selectedCell.v > 0 ? "A good choice!" : "Avoid this action here."}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-white/35 leading-relaxed">
        ★ starred values = best action per state. Click any cell to inspect. Formula: <span className="font-mono" style={{ color: C.teal }}>Q(s,a) ← Q(s,a) + α[r + γ·max Q(s',a') − Q(s,a)]</span>
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ReinforcementLearningPage() {
  return (
    <div className="min-h-screen text-white" style={{ background: C.navy }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;} html{scroll-behavior:smooth;} body{overflow-x:hidden;}
        input[type=range]{-webkit-appearance:none;background:transparent;width:100%;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:${C.teal};cursor:pointer;margin-top:-5px;}
        input[type=range]::-webkit-slider-runnable-track{height:4px;border-radius:2px;background:rgba(255,255,255,0.08);}
        ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-track{background:#060410;}
        ::-webkit-scrollbar-thumb{background:linear-gradient(#4ADE80,#2DD4BF);border-radius:2px;}
        ::selection{background:rgba(74,222,128,0.3);color:white;}
      `}</style>
      <Navbar />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.07]" style={{ background: C.green }} />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.06]" style={{ background: C.teal }} />
        <motion.div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full blur-[100px] opacity-[0.04]" style={{ background: C.purple }}
          animate={{ x: [-50, 50, -50], y: [-30, 30, -30] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(rgba(74,222,128,1) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
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
              <span className="text-white/60 cursor-default">Reinforcement Learning</span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-xs font-mono px-3 py-1.5 rounded-full border" style={{ borderColor: `${C.green}40`, background: `${C.green}0d`, color: C.green }}>🎮 Advanced · 60 min</span>
              <span className="text-xs font-mono px-3 py-1.5 rounded-full border" style={{ borderColor: `${C.teal}40`, background: `${C.teal}0d`, color: C.teal }}>Module 5 · Final Boss</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight" style={{ fontFamily: "'Georgia',serif" }}>
              <G from={C.green} to={C.teal}>Reinforcement Learning</G><br /><span className="text-white">Learning by Trial & Error</span>
            </h1>
          </Reveal>
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-5">
            <div className="w-full lg:max-w-sm space-y-2">
              <div className="flex justify-between text-xs font-mono text-white/35"><span>Module Progress</span><span>5/5 — FINAL</span></div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg,${C.green},${C.teal})` }} initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.2, delay: 0.4 }} />
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div key={i} className="flex-1 h-1 rounded-full" style={{ background: `linear-gradient(90deg,${C.green},${C.teal})` }}
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }} />
                ))}
              </div>
            </div>
            <Reveal delay={0.2}><motion.a href="/decision-tree" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm text-white/55 hover:text-white transition-colors cursor-pointer"
              style={{ borderColor: C.border, background: "rgba(255,255,255,0.03)" }}>‹ Decision Trees</motion.a></Reveal>
          </div>
        </div>

        {/* Hero */}
        <Reveal delay={0.1}>
          <div className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg,${C.green}12,${C.teal}18)`, border: `1px solid ${C.green}30` }}>
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(${C.green} 1px,transparent 1px),linear-gradient(90deg,${C.teal} 1px,transparent 1px)`, backgroundSize: "50px 50px" }} />
            <motion.div className="text-5xl mb-4" animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>🎮</motion.div>
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-4" style={{ fontFamily: "'Georgia',serif" }}>
              Learn Like a <G from={C.green} to={C.teal}>Child Playing a Game</G>
            </h2>
            <p className="text-white/50 max-w-3xl mx-auto leading-relaxed">No labeled data. No teacher. Just an agent, an environment, and rewards. RL powered AlphaGo, ChatGPT's RLHF fine-tuning, and every game-playing AI you've ever marveled at.</p>
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs font-mono text-white/30">
              {["Rewards", "Policies", "Q-Learning", "Multi-Armed Bandit", "Exploration vs Exploitation"].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full" style={{ background: `linear-gradient(135deg,${C.green},${C.teal})` }} />{t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Section 1: GridWorld */}
        <Card delay={0.1} glow>
          <SectionHeader number={1} title="Q-Learning Grid World — Train Your Agent" subtitle="Run episodes · Enable Auto-play · Watch policy arrows emerge" />
          <div className="mt-6 space-y-4">
            <p className="text-white/50 text-sm leading-relaxed">
              An agent starts at top-left and must reach the <span className="font-bold" style={{ color: C.green }}>goal 🏁</span> while avoiding <span className="font-bold" style={{ color: C.coral }}>traps 💀</span>.
              Enable <span style={{ color: C.amber }}>Auto-play</span> to watch learning happen in real time — tiny policy arrows appear after ~5 episodes!
            </p>
            <GridWorld />
          </div>
        </Card>

        {/* Section 2: Bandit Game */}
        <Card delay={0.12} glow>
          <SectionHeader number={2} title="Multi-Armed Bandit — The Pure Exploration Game" subtitle="20 pulls to find the best slot machine" />
          <div className="mt-6 space-y-4">
            <p className="text-white/50 text-sm leading-relaxed">
              The <span className="font-bold" style={{ color: C.teal }}>Multi-Armed Bandit</span> is RL stripped to its essence: you have limited tries, unknown rewards, and must balance exploring new options vs exploiting what's already working.
            </p>
            <BanditGame />
          </div>
        </Card>

        {/* Section 3: Rewards */}
        <Card delay={0.13}>
          <SectionHeader number={3} title="Rewards — The Language of RL" subtitle="Replay animated reward trajectories across scenarios" />
          <div className="mt-6 space-y-4">
            <p className="text-white/50 text-sm leading-relaxed">
              Reward signals tell the agent what's good (+) and bad (−). The agent's goal: maximize <span className="font-bold" style={{ color: C.green }}>total cumulative reward</span> over time — not just immediate gain.
            </p>
            <RewardViz />
          </div>
        </Card>

        {/* Section 4: Policies */}
        <Card delay={0.14}>
          <SectionHeader number={4} title="Policies — The Agent's Strategy" subtitle="Simulate different exploration strategies" />
          <div className="mt-6 space-y-4">
            <p className="text-white/50 text-sm leading-relaxed">
              A <span className="font-bold" style={{ color: C.teal }}>policy</span> maps every state to an action. Tune epsilon on ε-Greedy, then simulate to compare performance. UCB often beats pure greedy by being "optimistic."
            </p>
            <PolicyExplorer />
          </div>
        </Card>

        {/* Section 5: Q-Table */}
        <Card delay={0.16}>
          <SectionHeader number={5} title="Q-Table — Memory of Learned Values" subtitle="Click cells to inspect state-action values" />
          <div className="mt-6 space-y-4">
            <p className="text-white/50 text-sm leading-relaxed">
              Q-Learning stores a value Q(s,a) for every state-action pair. Click any cell to see what it means. ★ marks the best action in each state.
            </p>
            <QTableExplainer />
          </div>
        </Card>

        {/* Real World */}
        <div className="space-y-5">
          <Reveal><h2 className="text-2xl sm:text-4xl font-black text-white text-center" style={{ fontFamily: "'Georgia',serif" }}><G from={C.green} to={C.teal}>Real-World</G> Applications</h2></Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {[{ icon: "♟️", title: "Game Playing", desc: "AlphaGo beat world champion Lee Sedol. OpenAI Five defeated Dota 2 pros. Pure RL, zero human strategy." }, { icon: "🦾", title: "Robotics", desc: "Robots learn to walk, grasp, and navigate by trial and error in simulation — then deploy in the real world." }, { icon: "🚗", title: "Self-Driving Cars", desc: "Lane keeping, intersection decisions, and parking learned through millions of simulated miles of RL training." }].map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div whileHover={{ y: -5, boxShadow: `0 16px 50px ${C.green}18` }} className="rounded-2xl border p-5 text-center" style={{ background: C.card, borderColor: C.border }}>
                  <motion.div className="text-4xl mb-3" animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}>{item.icon}</motion.div>
                  <h3 className="font-bold text-white mb-2 text-sm">{item.title}</h3>
                  <p className="text-white/38 text-xs leading-relaxed">{item.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Completion */}
        <Reveal delay={0.1}>
          <div className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
            style={{ background: `linear-gradient(135deg,${C.green}15,${C.teal}15,${C.purple}15)`, border: `1px solid ${C.green}40` }}>
            <motion.div className="absolute inset-0 opacity-10" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              style={{ background: `conic-gradient(${C.green},${C.teal},${C.purple},${C.green})` }} />
            <motion.div className="text-6xl mb-4" animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>🏆</motion.div>
            <h3 className="text-2xl sm:text-4xl font-black text-white mb-3" style={{ fontFamily: "'Georgia',serif" }}>
              You've Completed the <G from={C.green} to={C.teal}>MLera Core Path!</G>
            </h3>
            <p className="text-white/45 max-w-xl mx-auto mb-8">From Linear Regression to Reinforcement Learning — you've built a solid foundation in Machine Learning. You're ready for the advanced modules.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.a href="/" whileHover={{ scale: 1.04, boxShadow: `0 0 40px ${C.green}40` }} whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-xl text-sm font-bold text-black cursor-pointer"
                style={{ background: `linear-gradient(135deg,${C.green},${C.teal})` }}>🎓 View Certificate</motion.a>
              <motion.a href="/" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white/55 hover:text-white border border-white/10 hover:border-white/25 transition-colors cursor-pointer">
                Explore Advanced Modules →
              </motion.a>
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
