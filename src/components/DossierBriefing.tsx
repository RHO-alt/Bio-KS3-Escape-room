/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { soundManager } from "../lib/sounds";

interface DossierBriefingProps {
  onStartCommand: (name: string) => void;
}

export default function DossierBriefing({ onStartCommand }: DossierBriefingProps) {
  const [callsign, setCallsign] = useState("");

  const handleStart = () => {
    soundManager.playClick();
    onStartCommand(callsign.trim() || "SPECTRE-GAUNTLET");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 py-8 animate-fade-in" id="dossier-briefing-root">
      
      {/* Top Banner Graphic (Screenshot Page 1) */}
      <div className="text-center space-y-4 relative py-8 border-y border-white/5 bg-black/10" id="tactical-banner">
        
        {/* Absolute Glowing Tech Anchors */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500/60" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500/60" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500/60" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500/60" />

        <span className="text-xs font-sans tracking-[0.3em] text-amber-500 uppercase font-bold block animate-pulse">CLASSIFIED BIOTACTICAL DOSSIER</span>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-stone-100 tracking-tight leading-tight uppercase">
          OPERATION MICRO-HUD:
          <span className="block text-amber-500 font-extrabold text-2xl md:text-4xl mt-2 tracking-wide font-sans">BIOLOGY TACTICAL BOOTCAMP</span>
        </h1>
        <p className="text-[10px] text-stone-500 tracking-[0.2em] font-sans uppercase">
          Classified Revision Dossier. High-intensity data extraction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4">
        
        {/* Circular HUD scan element (Left) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-black/40 border border-white/5 rounded relative min-h-[300px] immersive-shadow-inner" id="hologram-concentric">
          <div className="absolute top-3 font-sans text-[8px] text-amber-500/80 tracking-widest font-semibold animate-pulse">HUD CELLULAR CORE TARGETING ACTIVE</div>
          
          <div className="relative w-44 h-44 rounded-full border border-dashed border-amber-500/30 flex items-center justify-center animate-[spin_40s_linear_infinite]" id="spinning-dashed-ring">
            <div className="w-36 h-36 rounded-full border border-amber-500/20 flex items-center justify-center animate-[spin_10s_linear_infinite_reverse]">
              <div className="w-24 h-24 rounded-full border border-amber-500/40 flex items-center justify-center animate-pulse">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-400 flex items-center justify-center">
                  <span className="text-amber-400 font-sans text-[10px] font-bold tracking-wider">CORE</span>
                </div>
              </div>
            </div>
          </div>
          <span className="text-[9px] font-sans text-stone-500 tracking-[0.15em] uppercase mt-4 block">SCAN: 8-POINT DATA ASSIMILATION</span>
        </div>

        {/* Tactical Briefing briefing card (Right - Page 1 Warning box) */}
        <div className="md:col-span-7 space-y-6" id="dossier-intro-brief-form">
          <div className="p-5 bg-stone-900/40 border border-amber-500/30 rounded-lg space-y-3 relative shadow-inner" id="alert-briefing-box">
            <div className="flex items-center space-x-2 text-amber-500 text-xs font-bold font-sans tracking-widest uppercase">
              <span className="text-base">⚠️</span>
              <span>ALERT: MISSION BRIEFING PROTOCOL</span>
            </div>

            <div className="w-full h-[1px] bg-white/5" />

            <p className="text-stone-300 font-serif text-sm leading-relaxed">
              <strong>Operatives:</strong> You have <strong>60 minutes</strong> to extract, process, and master the cellular data in this dossier. Read the Data Cards carefully. The answers to the Checkpoint Locks are embedded directly in the visual intel. Do not proceed until you have decoded the data. Clock starts now.
            </p>
          </div>

          {/* Callsign Input */}
          <div className="space-y-2 bg-black/40 border border-white/5 p-4 rounded" id="callsign-identity">
            <label className="block text-[10px] font-sans text-stone-400 font-bold tracking-widest uppercase">ENTER OPERATIVE CALLSIGN IDENTITY:</label>
            <input
              type="text"
              placeholder="e.g. ALPHA-SPECTRE"
              value={callsign}
              onChange={(e) => setCallsign(e.target.value)}
              id="callsign-input"
              className="w-full p-2.5 rounded bg-black/60 border border-zinc-800 focus:border-amber-500/60 outline-none font-mono text-xs text-stone-200 tracking-wider"
              maxLength={20}
            />
          </div>

          {/* Start Sequence Trigger Button */}
          <button
            onClick={handleStart}
            id="btn-commence-bootcamp"
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-sans text-xs font-bold rounded shadow-lg tracking-widest uppercase transition duration-200 cursor-pointer text-center select-none"
          >
            INITIATE SEQUENCE // ENTER INTEL LINK
          </button>
        </div>

      </div>

    </div>
  );
}
