/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { soundManager } from "../lib/sounds";

interface FinalExtractionProps {
  onExtractionComplete: () => void;
}

export default function FinalExtraction({ onExtractionComplete }: FinalExtractionProps) {
  // Inputs state
  const [seq1Input, setSeq1Input] = useState("");
  const [seq1Unlocked, setSeq1Unlocked] = useState(false);
  const [seq1Feedback, setSeq1Feedback] = useState("");

  const [seq2Input, setSeq2Input] = useState("");
  const [seq2Unlocked, setSeq2Unlocked] = useState(false);
  const [seq2Feedback, setSeq2Feedback] = useState("");

  const [seq3Input, setSeq3Input] = useState("");
  const [seq3Unlocked, setSeq3Unlocked] = useState(false);
  const [seq3Feedback, setSeq3Feedback] = useState("");

  const [seq4Input, setSeq4Input] = useState("");
  const [seq4Unlocked, setSeq4Unlocked] = useState(false);
  const [seq4Feedback, setSeq4Feedback] = useState("");

  const keypadTap = () => {
    soundManager.keypadTap();
  };

  const handleSeq1Submit = () => {
    keypadTap();
    const clean = seq1Input.toLowerCase().trim();
    if (clean.includes("palisade")) {
      soundManager.playSuccess();
      setSeq1Unlocked(true);
      setSeq1Feedback("✔ NODE SECURED: Operative 04 (Palisade Cell) verified. Core structure includes massive interior chloroplast organelles.");
      checkAllUnlocked(true, seq2Unlocked, seq3Unlocked, seq4Unlocked);
    } else {
      soundManager.playFailure();
      setSeq1Feedback("✖ DECRYPTION FAILED: Unknown cell profile. Review Data Card 08 for leaf photosynthesis specialized operatives.");
    }
  };

  const handleSeq2Submit = () => {
    keypadTap();
    const clean = seq2Input.toLowerCase().trim();
    if (["500", "500x", "x500"].includes(clean)) {
      soundManager.playSuccess();
      setSeq2Unlocked(true);
      setSeq2Feedback("✔ NODE SECURED: Total magnification factor of x500 matches environmental scans.");
      checkAllUnlocked(seq1Unlocked, true, seq3Unlocked, seq4Unlocked);
    } else {
      soundManager.playFailure();
      setSeq2Feedback("✖ DECRYPTION FAILED: Scale math conflict. Total power is the product of eyepiece x10 and objective x50.");
    }
  };

  const handleSeq3Submit = () => {
    keypadTap();
    const clean = seq3Input.toLowerCase().trim();
    if (["50", "50mm", "50 mm"].includes(clean)) {
      soundManager.playSuccess();
      setSeq3Unlocked(true);
      setSeq3Feedback("✔ NODE SECURED: Metric conversion matching 50 millimeters. Scale calibrated.");
      checkAllUnlocked(seq1Unlocked, seq2Unlocked, true, seq4Unlocked);
    } else {
      soundManager.playFailure();
      setSeq3Feedback("✖ DECRYPTION FAILED: Range mismatch. Multiply centimeter value by 10 to resolve millimeters.");
    }
  };

  const handleSeq4Submit = () => {
    keypadTap();
    const clean = seq4Input.toLowerCase().trim();
    if (["0.1", "0.1mm", "0.1 mm"].includes(clean)) {
      soundManager.playSuccess();
      setSeq4Unlocked(true);
      setSeq4Feedback("✔ NODE SECURED: Actual Size computed at 0.1 mm. System equilibrium achieved.");
      checkAllUnlocked(seq1Unlocked, seq2Unlocked, seq3Unlocked, true);
    } else {
      soundManager.playFailure();
      setSeq4Feedback("✖ DECRYPTION FAILED: Extraction equation invalid. Actual Size = Image Size (50 mm) ÷ Magnification (500).");
    }
  };

  const checkAllUnlocked = (s1: boolean, s2: boolean, s3: boolean, s4: boolean) => {
    if (s1 && s2 && s3 && s4) {
      soundManager.playFinalCompletion();
      setTimeout(() => {
        onExtractionComplete();
      }, 1500);
    }
  };

  return (
    <div className="space-y-6" id="final-extraction-root">
      
      {/* Title block */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
        <span className="text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase block animate-pulse">CLASSIFIED SECTOR LEVEL 5</span>
        <h3 className="text-xl font-sans tracking-tight font-extrabold text-slate-100 uppercase mt-0.5">FINAL CONVERGENCE EXTRACTION</h3>
        <p className="text-xs text-slate-400 max-w-xl mx-auto mt-1 leading-relaxed">
          Decrypt all 4 cryptographic sequences in parallel to load the Palisade core cellular profile and complete data extraction.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column nodes: Sequence 1 & 2 */}
        <div className="xl:col-span-4 flex flex-col justify-between space-y-6">
          
          {/* Node 1: ID */}
          <div className={`p-5 rounded-xl border-2 bg-slate-950/45 transition duration-300 ${
            seq1Unlocked ? "border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.15)]" : "border-slate-800"
          }`} id="seq-node-1">
            <div className="flex justify-between items-center mb-2 font-mono text-xs">
              <span className="text-cyan-400 font-bold">DECRYPTION SEQUENCE 1: IDENTIFY</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${seq1Unlocked ? "bg-green-500/20 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                {seq1Unlocked ? "SECURED" : "PENDING"}
              </span>
            </div>
            <p className="text-[11px] text-slate-350 leading-relaxed mb-3">
              Look at the target cell. It has a cell wall, a large permanent vacuole, and is packed with chloroplasts. What specific specialised cell is this?
            </p>
            {seq1Unlocked ? (
              <div className="text-xs font-mono text-green-400 font-bold">{seq1Feedback}</div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Type specialized cell name..."
                  value={seq1Input}
                  onChange={(e) => setSeq1Input(e.target.value)}
                  id="seq-1-input"
                  className="w-full p-2 text-xs font-mono rounded bg-slate-950 border border-slate-850 text-slate-200"
                />
                <button
                  onClick={handleSeq1Submit}
                  id="btn-seq-1"
                  className="px-4 py-1.5 font-mono text-[10px] bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded transition cursor-pointer"
                >
                  ⚡ SECURE NODE 1
                </button>
                {seq1Feedback && <p className="text-[10px] font-mono text-red-400 mt-1 uppercase">{seq1Feedback}</p>}
              </div>
            )}
          </div>

          {/* Node 2: Calculate */}
          <div className={`p-5 rounded-xl border-2 bg-slate-950/45 transition duration-300 ${
            seq2Unlocked ? "border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.15)]" : "border-slate-800"
          }`} id="seq-node-2">
            <div className="flex justify-between items-center mb-2 font-mono text-xs">
              <span className="text-cyan-400 font-bold">DECRYPTION SEQUENCE 2: CALCULATE</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${seq2Unlocked ? "bg-green-500/20 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                {seq2Unlocked ? "SECURED" : "PENDING"}
              </span>
            </div>
            <p className="text-[11px] text-slate-350 leading-relaxed mb-3">
              The HUD shows you are using a x10 Eyepiece and a x50 Objective Lens. Calculate the Total Magnification.
            </p>
            {seq2Unlocked ? (
              <div className="text-xs font-mono text-green-400 font-bold">{seq2Feedback}</div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Total multiplied power..."
                  value={seq2Input}
                  onChange={(e) => setSeq2Input(e.target.value)}
                  id="seq-2-input"
                  className="w-full p-2 text-xs font-mono rounded bg-slate-950 border border-slate-850 text-slate-200"
                />
                <button
                  onClick={handleSeq2Submit}
                  id="btn-seq-2"
                  className="px-4 py-1.5 font-mono text-[10px] bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded transition cursor-pointer"
                >
                  ⚡ SECURE NODE 2
                </button>
                {seq2Feedback && <p className="text-[10px] font-mono text-red-400 mt-1 uppercase">{seq2Feedback}</p>}
              </div>
            )}
          </div>

        </div>

        {/* Middle Central Grid: Holographic target palisade cell (visualized from Page 12 operative cell) */}
        <div className="xl:col-span-4 bg-cyan-950/5 border border-cyan-500/15 p-6 rounded-xl flex flex-col items-center justify-center relative min-h-[350px]">
          <div className="absolute top-4 left-4 font-mono text-[9px] text-cyan-400">TARGET CORE CONVERGENCE WIREFRAME</div>
          
          <div className="relative w-56 h-76 border-2 border-cyan-500/30 rounded-3xl flex flex-col justify-between p-4 overflow-hidden shadow-inner bg-slate-950/50">
            {/* Cell wall border overlay */}
            <div className="absolute inset-2 border border-green-400/30 rounded-2xl flex flex-col justify-between p-3.5" id="cellulose-wall">
              
              {/* Large permanent vacuole */}
              <div className="w-[85%] h-24 border border-teal-400/40 rounded-xl mx-auto flex items-center justify-center bg-teal-950/20 shadow-inner mt-4" id="central-vacuole">
                <span className="font-mono text-[8px] text-teal-400 uppercase tracking-widest font-semibold">Vacuole core</span>
              </div>

              {/* Chloroplast stacked cells */}
              <div className="grid grid-cols-5 gap-1.5 p-1 mt-3" id="chloroplast-stacks">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="h-4.5 rounded-full border border-green-400/60 bg-green-950/40 shadow shadow-green-500 animate-pulse" />
                ))}
              </div>

              {/* Small Nucleus pushed to the side */}
              <div className="absolute bottom-6 left-3 w-8 h-8 rounded-full border border-cyan-400 bg-cyan-950/40 flex items-center justify-center" id="nucleus-pushed">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              </div>

            </div>
          </div>

          {/* Diagnostic Ruler below Cell */}
          <div className="mt-4 flex flex-col items-center">
            <div className="w-48 h-3.5 border-b border-x border-orange-500/40 flex justify-between px-1 relative">
              <span className="h-1.5 w-[1px] bg-orange-400"></span>
              <span className="h-1.5 w-[1px] bg-orange-400"></span>
              <span className="h-1.5 w-[1px] bg-orange-400"></span>
              <span className="h-1.5 w-[1px] bg-orange-400"></span>
              <span className="h-1.5 w-[1px] bg-orange-400"></span>
              <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-orange-400 tracking-wider font-semibold">
                IMAGE SIZE = 5 CENTIMETERS
              </div>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider mt-1.5">SPECIALIZED PALISADE SPECIMEN</span>
          </div>
        </div>

        {/* Right column nodes: Sequence 3 & 4 */}
        <div className="xl:col-span-4 flex flex-col justify-between space-y-6">
          
          {/* Node 3: Measure */}
          <div className={`p-5 rounded-xl border-2 bg-slate-950/45 transition duration-300 ${
            seq3Unlocked ? "border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.15)]" : "border-slate-800"
          }`} id="seq-node-3">
            <div className="flex justify-between items-center mb-2 font-mono text-xs">
              <span className="text-cyan-400 font-bold">DECRYPTION SEQUENCE 3: MEASURE</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${seq3Unlocked ? "bg-green-500/20 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                {seq3Unlocked ? "SECURED" : "PENDING"}
              </span>
            </div>
            <p className="text-[11px] text-slate-350 leading-relaxed mb-3">
              The Image Size on your screen measures 5 centimeters. Convert this to millimeters.
            </p>
            {seq3Unlocked ? (
              <div className="text-xs font-mono text-green-400 font-bold">{seq3Feedback}</div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Value in millimeters (mm)..."
                  value={seq3Input}
                  onChange={(e) => setSeq3Input(e.target.value)}
                  id="seq-3-input"
                  className="w-full p-2 text-xs font-mono rounded bg-slate-950 border border-slate-850 text-slate-200"
                />
                <button
                  onClick={handleSeq3Submit}
                  id="btn-seq-3"
                  className="px-4 py-1.5 font-mono text-[10px] bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded transition cursor-pointer"
                >
                  ⚡ SECURE NODE 3
                </button>
                {seq3Feedback && <p className="text-[10px] font-mono text-red-400 mt-1 uppercase">{seq3Feedback}</p>}
              </div>
            )}
          </div>

          {/* Node 4: Extract */}
          <div className={`p-5 rounded-xl border-2 bg-slate-950/45 transition duration-300 ${
            seq4Unlocked ? "border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.15)]" : "border-slate-800"
          }`} id="seq-node-4">
            <div className="flex justify-between items-center mb-2 font-mono text-xs">
              <span className="text-cyan-400 font-bold">DECRYPTION SEQUENCE 4: EXTRACT</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${seq4Unlocked ? "bg-green-500/20 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                {seq4Unlocked ? "SECURED" : "PENDING"}
              </span>
            </div>
            <p className="text-[11px] text-slate-350 leading-relaxed mb-3">
              Using your Total Magnification (x500) and your Image Size (50 mm), calculate the Actual Size of this cell using the Magnification Equation.
            </p>
            {seq4Unlocked ? (
              <div className="text-xs font-mono text-green-400 font-bold">{seq4Feedback}</div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Actual Size in millimeters (mm)..."
                  value={seq4Input}
                  onChange={(e) => setSeq4Input(e.target.value)}
                  id="seq-4-input"
                  className="w-full p-2 text-xs font-mono rounded bg-slate-950 border border-slate-850 text-slate-200"
                />
                <button
                  onClick={handleSeq4Submit}
                  id="btn-seq-4"
                  className="px-4 py-1.5 font-mono text-[10px] bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded transition cursor-pointer"
                >
                  ⚡ SECURE NODE 4
                </button>
                {seq4Feedback && <p className="text-[10px] font-mono text-red-400 mt-1 uppercase">{seq4Feedback}</p>}
              </div>
            )}
          </div>

        </div>

      </div>

      <div className="p-3 bg-cyan-950/15 border border-cyan-500/20 text-center font-mono text-[10px] text-cyan-400 uppercase tracking-widest font-semibold">
        📡 DECRYPTION QUEUE RUNNING: WAITING ON DATA PATH INTEGRATIONS...
      </div>
    </div>
  );
}
