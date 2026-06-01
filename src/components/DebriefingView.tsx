/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { soundManager } from "../lib/sounds";

interface DebriefingViewProps {
  onRestart: () => void;
  operativeName: string;
  timeTakenStr: string;
}

export default function DebriefingView({ onRestart, operativeName, timeTakenStr }: DebriefingViewProps) {
  
  const handleRestart = () => {
    soundManager.playClick();
    onRestart();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto space-y-6" id="debriefing-root">
      
      {/* Big Success Digital Screen (Screenshot Page 15) */}
      <div className="bg-slate-950/80 border-2 border-orange-500 rounded-3xl p-8 shadow-[0_0_35px_rgba(249,115,22,0.15)] relative overflow-hidden w-full" id="success-screen-box">
        {/* Abstract sci-fi grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />

        <div className="relative z-10 space-y-5">
          {/* Completion Glow Status */}
          <span className="text-[10px] font-mono tracking-[0.2em] text-orange-400 font-black uppercase bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/30">
            📡 SECURE DATA LINK ESTABLISHED
          </span>

          {/* Time digits */}
          <h1 className="text-5xl md:text-6xl font-sans tracking-widest text-orange-500 font-black animate-pulse drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]">
            00:00:00
          </h1>

          <div className="w-24 h-[1px] bg-orange-500/40 mx-auto" />

          {/* Success Title */}
          <h2 className="text-2xl md:text-3xl font-sans tracking-tight text-slate-100 font-extrabold uppercase">
            DATA EXTRACTION COMPLETE.
          </h2>

          <div className="mt-4 p-4 border border-dashed border-cyan-500/30 bg-cyan-950/10 rounded-xl">
            <p className="text-xs text-cyan-300 font-mono">
              OPERATIVE INITIATIVE PROFILE: <strong className="text-slate-100 uppercase">{operativeName || "SPECTRE-GAUNTLET"}</strong>
            </p>
            <p className="text-[11px] font-mono text-slate-500 mt-1 uppercase">
              DECRYPTION COMPLETED SPEED: {timeTakenStr}
            </p>
          </div>

          {/* Success Text matching PDF Page 15 */}
          <p className="text-sm text-slate-350 leading-relaxed font-sans max-w-md mx-auto">
            You have successfully navigated the sub-cellular matrix, calculated micro-scale mathematics, and decoded the special forces of biology.
          </p>

          <p className="text-xs text-orange-400/90 italic font-mono max-w-sm mx-auto">
            "Remember: The answers are never locked away; they are always hidden in the data. Stay sharp, Operatives."
          </p>
        </div>
      </div>

      {/* Restart / Re-evaluate Button */}
      <button
        onClick={handleRestart}
        id="btn-restart-bootcamp"
        className="px-8 py-3 bg-cyan-400 hover:bg-cyan-300 font-mono text-xs text-slate-950 font-bold rounded-xl shadow-lg hover:shadow-cyan-400/25 transition cursor-pointer select-none uppercase"
      >
        🔄 RE-INITIALIZE TACTICAL SEQUENCE
      </button>

    </div>
  );
}
