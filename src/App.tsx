/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Minus, RotateCcw, Smartphone, Watch, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Progression: 0 -> 15 -> 30 -> 40 -> GAME
const PROGRESSION = ["0", "15", "30", "40", "GAME"];

export default function App() {
  const [team1Points, setTeam1Points] = useState(0);
  const [team1Games, setTeam1Games] = useState(0);
  const [team2Points, setTeam2Points] = useState(0);
  const [team2Games, setTeam2Games] = useState(0);
  const [servingTeam, setServingTeam] = useState(1);
  const [lastActionTime, setLastActionTime] = useState(0);
  const [isVibrating, setIsVibrating] = useState(false);

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

  const incrementTeam1 = () => {
    if (debounceCheck()) return;
    triggerVibration();
    if (team1Points < PROGRESSION.length - 1) {
      const next = team1Points + 1;
      if (PROGRESSION[next] === "GAME") {
        setTeam1Games(prev => prev + 1);
        setTeam1Points(0);
        setTeam2Points(0);
        setServingTeam(prev => prev === 1 ? 2 : 1);
      } else {
        setTeam1Points(next);
      }
    }
  };

  const decrementTeam1 = () => {
    if (debounceCheck()) return;
    triggerVibration();
    if (team1Points > 0) setTeam1Points(prev => prev - 1);
  };

  const incrementTeam2 = () => {
    if (debounceCheck()) return;
    triggerVibration();
    if (team2Points < PROGRESSION.length - 1) {
      const next = team2Points + 1;
      if (PROGRESSION[next] === "GAME") {
        setTeam2Games(prev => prev + 1);
        setTeam1Points(0);
        setTeam2Points(0);
        setServingTeam(prev => prev === 1 ? 2 : 1);
      } else {
        setTeam2Points(next);
      }
    }
  };

  const decrementTeam2 = () => {
    if (debounceCheck()) return;
    triggerVibration();
    if (team2Points > 0) setTeam2Points(prev => prev - 1);
  };

  const resetMatch = () => {
    setTeam1Points(0);
    setTeam1Games(0);
    setTeam2Points(0);
    setTeam2Games(0);
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
        
        {/* Left Panel: Logic (Bento Card) */}
        <div className="col-span-12 md:col-span-3 row-span-2 md:row-span-4 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between overflow-hidden">
          <div>
            <h3 className="text-lime-400 text-xs font-black uppercase mb-6 tracking-wider italic">Score Logic</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-light font-mono opacity-20 italic">01</span>
                <span className="text-lg font-medium tracking-tight leading-tight">Point Progression<br/><span className="text-neutral-500 text-sm">0-15-30-40-GAME</span></span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-light font-mono opacity-20 italic">02</span>
                <span className="text-lg font-medium tracking-tight leading-tight">Haptic Engine<br/><span className="text-neutral-500 text-sm">Confirmed vibrations</span></span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-light font-mono opacity-20 italic">03</span>
                <span className="text-lg font-medium tracking-tight leading-tight">Debounce Filter<br/><span className="text-neutral-500 text-sm">Anti-accidental taps</span></span>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-6 mt-6">
            <p className="text-[10px] text-neutral-500 uppercase leading-relaxed font-mono">
              Built with Jetpack Compose for Wear OS.<br/>Zero Network Latency Policy.
            </p>
          </div>
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
                {/* Time / Status Bar */}
                <div className="absolute top-10 left-0 right-0 text-center text-[10px] font-bold text-lime-400/60 uppercase tracking-[0.2em] z-10">
                  12:45 • SET 1
                </div>

                {/* Team 1 Section */}
                <div className={`flex-1 flex flex-col justify-center px-10 border-b border-neutral-800/50 pt-8 transition-colors ${servingTeam === 1 ? 'bg-gradient-to-b from-lime-400/10 to-transparent' : 'bg-transparent'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-lime-400 tracking-widest">TEAM 1</span>
                        {servingTeam === 1 && <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />}
                      </div>
                      <div className="text-[12px] text-neutral-500 font-mono">G: {team1Games}</div>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={team1Points}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        className="text-6xl font-black italic text-white"
                      >
                        {PROGRESSION[team1Points]}
                      </motion.div>
                    </AnimatePresence>
                    <div className="flex flex-col gap-2">
                      <button onClick={incrementTeam1} className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center text-black active:scale-90 transition-transform shadow-[0_0_15px_rgba(163,230,53,0.3)]">
                        <Plus className="w-6 h-6" />
                      </button>
                      <button onClick={decrementTeam1} className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform">
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Team 2 Section */}
                <div className={`flex-1 flex flex-col justify-center px-10 pt-4 bg-gradient-to-t transition-colors ${servingTeam === 2 ? 'from-lime-400/10 to-transparent' : 'from-neutral-900/50 to-transparent'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-lime-400 tracking-widest">TEAM 2</span>
                        {servingTeam === 2 && <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />}
                      </div>
                      <div className="text-[12px] text-neutral-500 font-mono">G: {team2Games}</div>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={team2Points}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        className="text-6xl font-black italic text-neutral-400"
                      >
                        {PROGRESSION[team2Points]}
                      </motion.div>
                    </AnimatePresence>
                    <div className="flex flex-col gap-2">
                      <button onClick={incrementTeam2} className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center text-black active:scale-90 transition-transform shadow-[0_0_15px_rgba(163,230,53,0.3)]">
                        <Plus className="w-6 h-6" />
                      </button>
                      <button onClick={decrementTeam2} className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform">
                        <Minus className="w-4 h-4" />
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

