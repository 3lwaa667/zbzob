/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Minus, RotateCcw, Smartphone, Watch, Download, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Progression: 0 -> 15 -> 30 -> 40 -> GAME
const PROGRESSION = ["0", "15", "30", "40", "GAME"];

export default function App() {
  const [team1Points, setTeam1Points] = useState("0");
  const [team1Games, setTeam1Games] = useState(0);
  const [team2Points, setTeam2Points] = useState("0");
  const [team2Games, setTeam2Games] = useState(0);
  const [servingTeam, setServingTeam] = useState(1);
  const [team1Players, setTeam1Players] = useState<string[]>([]);
  const [team2Players, setTeam2Players] = useState<string[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState(["hazem", "aly", "ezz", "el mo", "joe", "seif"]);
  const [newPlayer, setNewPlayer] = useState("");
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [lastActionTime, setLastActionTime] = useState(0);
  const [isVibrating, setIsVibrating] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasMatchStarted, setHasMatchStarted] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setIsTimerRunning(false);
      } else {
        if (hasMatchStarted) {
          setIsTimerRunning(true);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [hasMatchStarted]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startTimerIfNeeded = () => {
    if (!hasMatchStarted) {
      setHasMatchStarted(true);
    }
    setIsTimerRunning(true);
  };

  const randomizePlayers = () => {
    const pool = [...availablePlayers].sort(() => 0.5 - Math.random());
    setTeam1Players(pool.slice(0, 2));
    setTeam2Players(pool.slice(2, 4));
  };

  const togglePlayerTeam = (player: string) => {
    if (team1Players.includes(player)) {
      setTeam1Players(prev => prev.filter(p => p !== player));
      setTeam2Players(prev => [...prev, player]);
    } else if (team2Players.includes(player)) {
      setTeam2Players(prev => prev.filter(p => p !== player));
    } else {
      if (team1Players.length < 2) {
        setTeam1Players(prev => [...prev, player]);
      } else if (team2Players.length < 2) {
        setTeam2Players(prev => [...prev, player]);
      }
    }
  };

  const addAvailablePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayer.trim() && !availablePlayers.includes(newPlayer.toLowerCase())) {
      setAvailablePlayers(prev => [...prev, newPlayer.toLowerCase()]);
      setNewPlayer('');
    }
  };

  const removeAvailablePlayer = (player: string) => {
    setAvailablePlayers(prev => prev.filter(p => p !== player));
    setTeam1Players(prev => prev.filter(p => p !== player));
    setTeam2Players(prev => prev.filter(p => p !== player));
  };

  const debounceCheck = useCallback(() => {
    const now = Date.now();
    if (now - lastActionTime < 300) return true;
    setLastActionTime(now);
    return false;
  }, [lastActionTime]);

  const triggerVibration = () => {
    setIsVibrating(true);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    setTimeout(() => setIsVibrating(false), 100);
  };

  const pushHistory = () => {
    setHistory(prev => [...prev, {
      team1Points, team2Points, team1Games, team2Games, servingTeam
    }]);
  };

  const popHistory = () => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setTeam1Points(last.team1Points);
      setTeam2Points(last.team2Points);
      setTeam1Games(last.team1Games);
      setTeam2Games(last.team2Games);
      setServingTeam(last.servingTeam);
      return prev.slice(0, -1);
    });
  };

  const handleGameWin = (team: number) => {
    setTeam1Games(g => team === 1 ? g + 1 : g);
    setTeam2Games(g => team === 2 ? g + 1 : g);
    setTeam1Points("0");
    setTeam2Points("0");
    setServingTeam(s => s === 1 ? 2 : 1);
  };

  const incrementTeam1 = () => {
    if (debounceCheck()) return;
    triggerVibration();
    pushHistory();
    startTimerIfNeeded();
    
    let t1 = team1Points;
    let t2 = team2Points;
    let won = false;

    if (t1 === "0") t1 = "15";
    else if (t1 === "15") t1 = "30";
    else if (t1 === "30") t1 = "40";
    else if (t1 === "40") {
        if (t2 === "40") t1 = "AD";
        else if (t2 === "AD") { t1 = "GP"; t2 = "GP"; }
        else won = true;
    }
    else if (t1 === "AD" || t1 === "GP") won = true;

    if (won) handleGameWin(1);
    else {
        setTeam1Points(t1);
        setTeam2Points(t2);
    }
  };

  const decrementTeam1 = () => {
    if (debounceCheck()) return;
    triggerVibration();
    popHistory();
  };

  const incrementTeam2 = () => {
    if (debounceCheck()) return;
    triggerVibration();
    pushHistory();
    startTimerIfNeeded();
    
    let t1 = team1Points;
    let t2 = team2Points;
    let won = false;

    if (t2 === "0") t2 = "15";
    else if (t2 === "15") t2 = "30";
    else if (t2 === "30") t2 = "40";
    else if (t2 === "40") {
        if (t1 === "40") t2 = "AD";
        else if (t1 === "AD") { t1 = "GP"; t2 = "GP"; }
        else won = true;
    }
    else if (t2 === "AD" || t2 === "GP") won = true;

    if (won) handleGameWin(2);
    else {
        setTeam1Points(t1);
        setTeam2Points(t2);
    }
  };

  const decrementTeam2 = () => {
    if (debounceCheck()) return;
    triggerVibration();
    popHistory();
  };

  const resetMatch = () => {
    setHistory([]);
    setTeam1Points("0");
    setTeam1Games(0);
    setTeam2Points("0");
    setTeam2Games(0);
    setElapsedSeconds(0);
    setIsTimerRunning(false);
    setHasMatchStarted(false);
    triggerVibration();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-10 flex flex-col font-sans selection:bg-lime-400 selection:text-black">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter">PadelScore<span className="text-lime-400 font-black">.OS</span></h1>
          <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest">Wear OS Lightweight Scoring Engine</p>
        </div>
        <div className="flex gap-4">
          <div className="px-3 py-1 border border-neutral-800 rounded-full text-[10px] uppercase font-bold text-neutral-400">v1.2.0-stable</div>
          <div className="px-3 py-1 border border-lime-500/30 text-lime-400 rounded-full text-[10px] uppercase font-bold bg-lime-400/5">Optimized for Pixel Watch</div>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex-1 grid grid-cols-12 auto-rows-min gap-4">
        
        {/* Left Panel: Companion Config (Bento Card) */}
        <div className="col-span-12 md:col-span-3 row-span-2 md:row-span-4 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col overflow-hidden">
            <h3 className="text-lime-400 text-xs font-black uppercase mb-4 tracking-wider italic">Companion Config</h3>
            <div className="flex-1 overflow-y-auto hidden-scrollbar mb-4">
              <div className="space-y-2">
                {availablePlayers.map(p => {
                  const inT1 = team1Players.includes(p);
                  const inT2 = team2Players.includes(p);
                  return (
                    <div key={p} className={`flex items-center justify-between p-2 rounded-xl text-sm transition-colors border max-w-full ${inT1 ? 'bg-lime-400/10 border-lime-400/30 text-lime-400' : inT2 ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-black/40 border-neutral-800 text-neutral-400'}`}>
                      <div className="flex items-center gap-2 overflow-hidden cursor-pointer flex-1" onClick={() => togglePlayerTeam(p)}>
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${inT1 ? 'bg-lime-400' : inT2 ? 'bg-blue-500' : 'bg-neutral-700'}`} />
                        <span className="truncate">{p}</span>
                      </div>
                      <button onClick={() => removeAvailablePlayer(p)} className="p-1 hover:text-white flex-shrink-0">
                        <Minus className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <form onSubmit={addAvailablePlayer} className="flex gap-2">
              <input 
                type="text" 
                value={newPlayer}
                onChange={e => setNewPlayer(e.target.value)}
                placeholder="New player..." 
                className="flex-1 bg-black/40 border border-neutral-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-lime-400 text-white placeholder-neutral-600"
              />
              <button disabled={!newPlayer.trim()} type="submit" className="bg-neutral-800 text-white rounded-xl px-3 py-2 disabled:opacity-50 hover:bg-neutral-700 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </form>
        </div>

        {/* Center: The Watch Simulator (Featured Bento Card) */}
        <div className="col-span-12 md:col-span-6 row-span-6 bg-black border border-neutral-800 rounded-[3rem] flex items-center justify-center relative py-10 overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(163,230,53,0.05),transparent)] pointer-events-none" />
          
          <div className="relative">
            {/* Watch Bezel Styling updated for Bento Theme */}
            <div className="w-[320px] h-[320px] md:w-[380px] md:h-[380px] bg-neutral-900 rounded-full p-2.5 shadow-2xl border-4 border-neutral-800 flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-[1.02]">
              
              {/* Screen Content */}
              <div 
                className={`w-full h-full bg-black rounded-full flex flex-col items-stretch overflow-hidden relative transition-transform duration-75 ${isVibrating ? 'scale-[0.98]' : 'scale-100'}`}
                style={{ clipPath: 'circle(50% at 50% 50%)' }}
              >
                {isSetupOpen ? (
                  <div className="absolute inset-0 z-50 bg-neutral-900 flex flex-col p-4">
                    <div className="text-center font-bold text-[10px] text-lime-400 mt-6 tracking-widest">SELECT PLAYERS</div>
                    <div className="flex-1 overflow-y-auto w-full px-6 mt-4 mb-10 hidden-scrollbar space-y-2">
                       {availablePlayers.map(p => {
                         const inT1 = team1Players.includes(p);
                         const inT2 = team2Players.includes(p);
                         return (
                           <div key={p} onClick={() => togglePlayerTeam(p)} className={`text-center py-2 rounded-full text-xs font-bold transition-colors cursor-pointer border ${inT1 ? 'bg-lime-400/20 border-lime-400/50 text-lime-400' : inT2 ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-neutral-800 border-neutral-700 text-neutral-400'}`}>
                             {p} {inT1 ? '(T1)' : inT2 ? '(T2)' : ''}
                           </div>
                         );
                       })}
                    </div>
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                      <button onClick={randomizePlayers} className="bg-neutral-800 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1">
                        <RefreshCcw className="w-3 h-3" /> SHUFFLE
                      </button>
                      <button onClick={() => setIsSetupOpen(false)} className="bg-lime-400 text-black px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-[0_0_15px_rgba(163,230,53,0.3)]">DONE</button>
                    </div>
                  </div>
                ) : null}

                {/* Time / Status Bar */}
                <div className="absolute top-10 left-0 right-0 text-center text-[10px] font-bold text-lime-400/60 uppercase tracking-[0.2em] z-10">
                  {/* Keep blank or use for generic status */}
                </div>

                {/* Team 1 Section */}
                <div className={`flex-1 flex flex-col justify-center px-10 pt-8 transition-colors ${servingTeam === 1 ? 'bg-gradient-to-b from-lime-400/10 to-transparent' : 'bg-transparent'}`}>
                  <div className="flex justify-between items-center h-full">
                    <div className="flex-1 flex flex-col justify-center cursor-pointer" onClick={() => { if (!hasMatchStarted) setIsSetupOpen(true); else randomizePlayers(); }}>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-lime-400 tracking-widest leading-none">TEAM 1</span>
                        {servingTeam === 1 && <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />}
                      </div>
                      {team1Players.length > 0 && (
                        <div className="text-[8px] text-neutral-400 uppercase leading-[10px] mt-1 pr-2 uppercase">
                          {team1Players.join(',\n')}
                        </div>
                      )}
                      <div className="text-[12px] text-neutral-500 font-mono mt-1 leading-none">G: {team1Games}</div>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={team1Points}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        className="flex-1 text-center text-6xl font-black italic text-white leading-none"
                      >
                        {team1Points}
                      </motion.div>
                    </AnimatePresence>
                    <div className="flex-1 flex flex-col gap-3 items-end">
                      <button onClick={incrementTeam1} className="w-9 h-9 bg-lime-400 rounded-full flex items-center justify-center text-black active:scale-90 transition-transform shadow-[0_0_15px_rgba(163,230,53,0.3)]">
                        <Plus className="w-5 h-5" />
                      </button>
                      <button onClick={decrementTeam1} className="w-9 h-9 bg-neutral-800 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform">
                        <Minus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Timer Divider */}
                <div className="relative z-10 flex items-center justify-center -my-3">
                  <div className="h-px w-24 bg-neutral-800/80"></div>
                  {hasMatchStarted ? (
                    <div className="px-3 py-0.5 rounded-full bg-neutral-800 border border-neutral-700 text-[10px] font-mono font-bold text-lime-400 mx-2 shadow-[0_0_10px_rgba(163,230,53,0.1)]">
                      {formatTime(elapsedSeconds)}
                    </div>
                  ) : (
                    <div className="h-px w-8 bg-neutral-800/80 mx-2"></div>
                  )}
                  <div className="h-px w-24 bg-neutral-800/80"></div>
                </div>

                {/* Team 2 Section */}
                <div className={`flex-1 flex flex-col justify-center px-10 pt-4 bg-gradient-to-t transition-colors ${servingTeam === 2 ? 'from-lime-400/10 to-transparent' : 'from-neutral-900/50 to-transparent'}`}>
                  <div className="flex justify-between items-center h-full">
                    <div className="flex-1 flex flex-col justify-center cursor-pointer" onClick={() => { if (!hasMatchStarted) setIsSetupOpen(true); else randomizePlayers(); }}>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-lime-400 tracking-widest leading-none">TEAM 2</span>
                        {servingTeam === 2 && <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />}
                      </div>
                      {team2Players.length > 0 && (
                        <div className="text-[8px] text-neutral-400 uppercase leading-[10px] mt-1 pr-2 uppercase">
                          {team2Players.join(',\n')}
                        </div>
                      )}
                      <div className="text-[12px] text-neutral-500 font-mono mt-1 leading-none">G: {team2Games}</div>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={team2Points}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        className="flex-1 text-center text-6xl font-black italic text-neutral-400 leading-none"
                      >
                        {team2Points}
                      </motion.div>
                    </AnimatePresence>
                    <div className="flex-1 flex flex-col gap-3 items-end">
                      <button onClick={incrementTeam2} className="w-9 h-9 bg-lime-400 rounded-full flex items-center justify-center text-black active:scale-90 transition-transform shadow-[0_0_15px_rgba(163,230,53,0.3)]">
                        <Plus className="w-5 h-5" />
                      </button>
                      <button onClick={decrementTeam2} className="w-9 h-9 bg-neutral-800 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform">
                        <Minus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reset Mini Button */}
                <button 
                  onClick={resetMatch} 
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 p-2 text-neutral-600 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Digital Crown */}
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-12 bg-neutral-800 rounded-r-lg border-y border-r border-neutral-700" />
            </div>
          </div>
        </div>

        {/* Right Panel: Tech Stack (Bento Card) */}
        <div className="col-span-12 md:col-span-3 row-span-3 bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
          <h3 className="text-neutral-500 text-xs font-black uppercase mb-6 tracking-wider">Tech Stack</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-black/40 p-3 rounded-2xl border border-neutral-800">
              <span className="text-xs font-medium text-neutral-400">Kotlin Coroutines</span>
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
            </div>
            <div className="flex justify-between items-center bg-black/40 p-3 rounded-2xl border border-neutral-800">
              <span className="text-xs font-medium text-neutral-400">Jetpack Compose</span>
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></div>
            </div>
            <div className="flex justify-between items-center bg-black/40 p-3 rounded-2xl border border-neutral-800">
              <span className="text-xs font-medium text-neutral-400">Lifecycle ViewModel</span>
              <div className="h-1.5 w-1.5 rounded-full bg-lime-400 shadow-[0_0_8px_#a3e635]"></div>
            </div>
          </div>
        </div>

        {/* Features: High Visibility (Highlight Bento Card) */}
        <div className="col-span-12 md:col-span-3 row-span-2 bg-lime-400 rounded-3xl p-6 flex flex-col justify-between">
          <div className="text-neutral-950">
            <h4 className="font-black text-2xl leading-none italic uppercase">High<br/>Visibility</h4>
            <p className="text-[10px] mt-2 font-bold opacity-70 uppercase leading-tight font-mono">Outdoor-ready interface for intense glare.</p>
          </div>
          <div className="w-full h-10 bg-black/5 rounded-xl flex items-center justify-center border border-black/10">
            <span className="text-black font-black text-[10px] tracking-widest uppercase">4000 Nits Optimized</span>
          </div>
        </div>

        {/* Technical Stats (Small Bento Cards) */}
        <div className="col-span-12 md:col-span-3 row-span-1 bg-neutral-900 border border-neutral-800 rounded-3xl p-4 flex items-center justify-around">
          <div className="text-center">
            <p className="text-[8px] text-neutral-500 font-bold uppercase mb-0.5">Weight</p>
            <p className="text-xl font-black text-white">1.2 MB</p>
          </div>
          <div className="w-px h-8 bg-neutral-800"></div>
          <div className="text-center">
            <p className="text-[8px] text-neutral-500 font-bold uppercase mb-0.5">Memory</p>
            <p className="text-xl font-black text-white">18 MB</p>
          </div>
        </div>

        {/* Build Info & Instructions (Bento Card) */}
        <div className="col-span-12 md:col-span-3 row-span-1 bg-neutral-900 border border-neutral-800 rounded-3xl p-4 flex flex-col justify-center gap-2">
           <div className="flex items-center gap-3">
             <Download className="w-4 h-4 text-lime-400" />
             <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Build Manual</span>
           </div>
           <div className="text-[9px] text-neutral-500 font-mono leading-tight">
             1. OPEN /WEAR-APP IN AS<br/>
             2. SYNC GRADLE &amp; BUILD APK<br/>
             3. INSTALL VIA ADB
           </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-8 pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center text-neutral-600 font-mono text-[9px] uppercase tracking-widest gap-4">
        <div>// Security Engine: Local-Only Sandbox</div>
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-lime-400" /> Screen Awake: Active</span>
          <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-lime-400" /> Battery: &lt; 0.5%/hr</span>
          <span>Build: #0921-X</span>
        </div>
      </footer>
    </div>
  );
}

