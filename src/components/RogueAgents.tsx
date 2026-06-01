/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { soundManager } from "../lib/sounds";

export default function RogueAgents() {
  const [selectedProfile, setSelectedProfile] = useState<"yeast" | "bacteria">("yeast");

  const profiles = {
    yeast: {
      title: "PROFILE A: YEAST (FUNGI-ALIGNED)",
      tag: "EUKARYOTE MUTANT",
      intel: "DOES NOT have chloroplasts (completely heterotrophic and cannot photosynthesise, relying purely on glucose absorption).",
      structures: [
        { name: "Cell Wall (Chitin)", state: "PRESENT" },
        { name: "Cell Membrane", state: "PRESENT" },
        { name: "Cytoplasm cytosol", state: "PRESENT" },
        { name: "Mitochondria Power cells", state: "PRESENT" },
        { name: "Defensive command Nucleus", state: "PRESENT" },
        { name: "Chloroplast sugar factories", state: "MISSING (CANNOT Photosynthesise)" }
      ],
      description: "Yeast is a complex single-celled organism (Eukaryotic fungi) featuring cellulose/chitin cell walls and a true nucleus, but lacks chloroplast solar machinery.",
      color: "border-green-500/40 focus:border-green-400 bg-green-950/20",
      accent: "text-green-400 border-green-500"
    },
    bacteria: {
      title: "PROFILE B: BACTERIA (PROCARYOTIC PROTOCOL)",
      tag: "PRIMITIVE PROCARYOTE",
      intel: "DOES NOT have a nucleus (genetic strand floats loosely in cytosol) and DOES NOT have mitochondria (energy production is handled relative to the cell membrane instead).",
      structures: [
        { name: "Cell Wall (Murein)", state: "PRESENT" },
        { name: "Protective Slime Capsule", state: "PRESENT (EXCLUSIVE)" },
        { name: "Flagellum Tail Propeller", state: "PRESENT (EXCLUSIVE)" },
        { name: "Mitochondria Power cells", state: "MISSING (No dual membranes)" },
        { name: "Defensive command Nucleus", state: "MISSING (DNA floats loosely)" },
        { name: "Chloroplast sugar factories", state: "MISSING" }
      ],
      description: "A highly resilient primitive rogue cell. Lacks a defensive nuclear membrane and mitochondria, relying on extremely high-speed cell divisions.",
      color: "border-orange-500/40 focus:border-orange-400 bg-orange-950/20",
      accent: "text-orange-400 border-orange-500"
    }
  };

  const current = profiles[selectedProfile];

  const toggleProfile = (prof: "yeast" | "bacteria") => {
    soundManager.playClick();
    setSelectedProfile(prof);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="rogue-agents-root">
      
      {/* Side Profile Selectors (Left Panel) */}
      <div className="lg:col-span-4 flex flex-col space-y-3 justify-center" id="profiles-toggle-panel">
        <button
          onClick={() => toggleProfile("yeast")}
          id="btn-profile-yeast"
          className={`p-4 rounded-xl border text-left transition select-none ${
            selectedProfile === "yeast"
              ? "border-green-500 bg-green-950/15 shadow-[0_0_12px_rgba(34,197,94,0.15)] font-bold text-green-300"
              : "bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-350"
          }`}
        >
          <span className="block font-mono text-[9px] mb-1">FUNGI ALIGNMENT</span>
          <span className="text-sm font-sans block uppercase tracking-tight">Profile A: Yeast Cell</span>
        </button>

        <button
          onClick={() => toggleProfile("bacteria")}
          id="btn-profile-bacteria"
          className={`p-4 rounded-xl border text-left transition select-none ${
            selectedProfile === "bacteria"
              ? "border-orange-500 bg-orange-950/15 shadow-[0_0_12px_rgba(249,115,22,0.15)] font-bold text-orange-300"
              : "bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-350"
          }`}
        >
          <span className="block font-mono text-[9px] mb-1">PROKARYOTE DEPOSIT</span>
          <span className="text-sm font-sans block uppercase tracking-tight">Profile B: Bacteria Agent</span>
        </button>
      </div>

      {/* Cyber Scanne Panel Output (Right Panel) */}
      <div className="lg:col-span-8 bg-slate-950/40 border border-slate-800 p-6 rounded-xl flex flex-col justify-between" id="agents-viewer-panel">
        <div>
          {/* Header */}
          <div className="border-b border-cyan-950/40 pb-2.5 mb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">DATA CARD 06</span>
              <h4 className="text-sm font-sans font-semibold text-slate-300 uppercase mt-0.5">{current.title}</h4>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-extrabold ${selectedProfile === "yeast" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-orange-500/20 text-orange-400 border border-orange-500/30"}`}>
              {current.tag}
            </span>
          </div>

          <p className="text-xs text-slate-300 font-sans mb-4">{current.description}</p>

          {/* Diagnostic specifications matrix of structures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            {current.structures.map((st) => (
              <div key={st.name} className="p-2 sm:p-2.5 bg-slate-900/60 border border-slate-800 rounded font-mono text-xs flex justify-between items-center">
                <span className="text-slate-400">{st.name}</span>
                <span className={`text-[10px] font-bold ${
                  st.state === "PRESENT" ? "text-cyan-400" : st.state.includes("EXCLUSIVE") ? "text-orange-400" : "text-amber-550 text-amber-500/90 font-semibold"
                }`}>
                  {st.state}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical Key Intel Panel */}
        <div className={`p-4 rounded-xl border ${current.color}`} id="rogue-agents-intel">
          <div className="flex items-start space-x-2.5">
            <span className="text-lg">🚨</span>
            <div className="font-mono text-[10px]">
              <span className="font-bold text-red-400 uppercase block mb-1">KEY SECURE INTEL DIAGNOSTIC:</span>
              <p className="text-slate-300 leading-relaxed font-sans mt-0.5">
                {current.intel}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
