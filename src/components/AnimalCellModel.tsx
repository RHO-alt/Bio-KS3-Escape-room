/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CellModelWidgetState } from "../types";
import { soundManager } from "../lib/sounds";

export default function AnimalCellModel() {
  const [state, setState] = useState<CellModelWidgetState>({
    selectedOrganelle: "nucleus"
  });

  const organelles = [
    {
      id: "nucleus",
      name: "Nucleus",
      role: "Command Center",
      techSpec: "Contains genetic material/DNA; controls cellular replication and metabolic activities of the cytoplasm.",
      color: "border-cyan-400 bg-cyan-950/20 text-cyan-300",
      pillColor: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
    },
    {
      id: "membrane",
      name: "Cell Membrane",
      role: "Security Gate",
      techSpec: "Semi-permeable barrier surrounding the cytoplasm. Tactically controls what molecules enter and depart the perimeter.",
      color: "border-orange-400 bg-orange-950/20 text-orange-300",
      pillColor: "bg-orange-500/20 text-orange-400 border border-orange-500/40"
    },
    {
      id: "cytoplasm",
      name: "Cytoplasm",
      role: "Factory Floor",
      techSpec: "Jelly-like fluid cytosol baseline where crucial metabolic bio-chemical reactions are carried out.",
      color: "border-teal-400 bg-teal-950/20 text-teal-300",
      pillColor: "bg-teal-500/20 text-teal-400 border border-teal-500/40"
    },
    {
      id: "mitochondria",
      name: "Mitochondria",
      role: "Power Generators",
      techSpec: "Double-membrane power engines conducting cellular respiration to extract ATP biological energy from sugars.",
      color: "border-red-400 bg-red-950/20 text-red-300",
      pillColor: "bg-red-500/20 text-red-400 border border-red-500/40"
    },
    {
      id: "ribosomes",
      name: "Ribosomes",
      role: "Assembly Lines",
      techSpec: "Tiny structures conducting translation of genetic messenger RNA strands to synthesize essential cellular proteins.",
      color: "border-green-400 bg-green-950/20 text-green-300",
      pillColor: "bg-green-500/20 text-green-400 border border-green-500/40"
    }
  ];

  const handleOrganelleSelect = (id: string) => {
    soundManager.playClick();
    setState({ selectedOrganelle: id });
  };

  const selectedData = organelles.find((org) => org.id === state.selectedOrganelle) || organelles[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="animal-cell-model-root">
      
      {/* Holographic interactive cell diagram preview (Left) */}
      <div className="lg:col-span-7 bg-cyan-950/10 border border-cyan-500/20 p-6 rounded-xl relative flex flex-col items-center justify-center overflow-hidden min-h-[380px]" id="hologram-stage-cell">
        <div className="absolute top-4 left-4 flex items-center space-x-1.5 font-mono text-[10px] text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>ANIMAL CELL CYBERNETIC HOLOGRAM SCANNER</span>
        </div>

        {/* Outer glowing cell membrane circle */}
        <div 
          onClick={() => handleOrganelleSelect("membrane")}
          id="visual-cell-membrane"
          className={`relative w-64 h-64 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 border-2 ${
            state.selectedOrganelle === "membrane" 
              ? "border-orange-400 shadow-[0_0_25px_rgba(251,146,60,0.4)] bg-orange-950/5 scale-105" 
              : "border-cyan-500/40 hover:border-cyan-400 hover:scale-[1.02]"
          }`}
        >
          {/* Internal Cytoplasm Jelly */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              handleOrganelleSelect("cytoplasm");
            }}
            id="visual-cell-cytoplasm"
            className={`w-[90%] h-[90%] rounded-full absolute flex items-center justify-center transition-all ${
              state.selectedOrganelle === "cytoplasm" ? "bg-teal-500/10" : "bg-cyan-500/5 hover:bg-cyan-500/10"
            }`}
          >
            {/* Nucleus inside */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                handleOrganelleSelect("nucleus");
              }}
              id="visual-cell-nucleus"
              className={`w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                state.selectedOrganelle === "nucleus"
                  ? "border-cyan-300 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                  : "border-cyan-600/40 bg-cyan-950/25 hover:border-cyan-400"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-cyan-500/40 animate-pulse border border-cyan-300" id="nucleolus" />
            </div>

            {/* Mitochondria scattered shapes */}
            {[
              { top: "25%", left: "15%", rot: "rotate-[35deg]" },
              { top: "65%", left: "70%", rot: "rotate-[-45deg]" },
              { top: "15%", left: "68%", rot: "rotate-[80deg]" }
            ].map((mito, idx) => (
              <div
                key={`mito-${idx}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOrganelleSelect("mitochondria");
                }}
                id={`visual-cell-mito-${idx}`}
                className={`absolute w-10 h-5 border rounded-full cursor-pointer flex justify-between px-1 items-center transition-all ${mito.rot} ${
                  state.selectedOrganelle === "mitochondria"
                    ? "border-red-400 bg-red-950/40 scale-110 shadow-[0_0_10px_rgba(248,113,113,0.3)]"
                    : "border-red-500/30 bg-red-950/15 hover:border-red-400"
                }`}
                style={{ top: mito.top, left: mito.left }}
              >
                <div className="w-full h-[1px] bg-red-500/50 absolute top-1/2 left-0 transform -translate-y-1/2" />
                <div className="w-1 h-2 rounded bg-red-400/40" />
                <div className="w-1 h-2 rounded bg-red-400/40" />
              </div>
            ))}

            {/* Ribosomes dots */}
            {[
              { top: "45%", left: "18%" },
              { top: "72%", left: "30%" },
              { top: "52%", left: "78%" },
              { top: "28%", left: "48%" },
              { top: "70%", left: "54%" }
            ].map((rib, idx) => (
              <div
                key={`rib-${idx}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOrganelleSelect("ribosomes");
                }}
                id={`visual-cell-rib-${idx}`}
                className={`absolute w-2 h-2 rounded-full cursor-pointer transition-all ${
                  state.selectedOrganelle === "ribosomes"
                    ? "bg-green-400 scale-150 ring-2 ring-green-500"
                    : "bg-green-500/60 hover:bg-green-400"
                }`}
                style={{ top: rib.top, left: rib.left }}
              />
            ))}
          </div>
        </div>

        {/* Legend overlays */}
        <div className="absolute bottom-3 left-4 flex flex-wrap gap-2 text-[9px] font-mono">
          <span className="text-cyan-400">CYAN = NUCLEUS</span>
          <span className="text-orange-400">ORANGE = MEMBRANE</span>
          <span className="text-red-400">RED = MITOCHONDRIA</span>
          <span className="text-green-400">GREEN = RIBOSOMES</span>
        </div>
      </div>

      {/* Cyber specs details (Right) */}
      <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/40 border border-slate-800 p-6 rounded-xl" id="organelle-spec-panel">
        <div>
          <div className="border-b border-cyan-950/40 pb-2 mb-4">
            <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">DATA CARD 03</span>
            <h4 className="text-sm font-sans font-medium text-slate-300 uppercase mt-0.5">Tactical Diagnostics</h4>
          </div>

          {/* Selector list */}
          <div className="space-y-1.5" id="organelle-selector-list">
            {organelles.map((org) => (
              <button
                key={org.id}
                onClick={() => handleOrganelleSelect(org.id)}
                id={`btn-organelle-${org.id}`}
                className={`w-full py-2.5 px-3 rounded text-left font-mono text-xs border transition flex items-center justify-between ${
                  state.selectedOrganelle === org.id
                    ? "bg-cyan-500/10 border-cyan-500 text-cyan-300 shadow shadow-cyan-950 font-bold"
                    : "bg-slate-900/30 border-slate-800 text-slate-400 hover:border-cyan-800"
                }`}
              >
                <span>{org.name.toUpperCase()}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                  state.selectedOrganelle === org.id ? "bg-cyan-500 text-slate-950 font-extrabold" : "bg-slate-800 text-slate-400"
                }`}>
                  {org.role}
                </span>
              </button>
            ))}
          </div>

          {/* Diagnostic specifications readout */}
          <div className={`mt-5 p-4 rounded-lg border-2 ${selectedData.color}`} id="selected-organelle-readout">
            <div className="flex items-center space-x-2 mb-1.5">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${selectedData.pillColor}`}>
                {selectedData.role.toUpperCase()}
              </span>
              <h5 className="font-heading font-semibold text-sm tracking-tight">{selectedData.name}</h5>
            </div>
            <p className="text-xs leading-relaxed font-sans">{selectedData.techSpec}</p>
          </div>
        </div>

        {/* Base insight alert box */}
        <div className="mt-5 p-2.5 bg-cyan-950/20 border border-cyan-500/30 rounded text-[10px] text-cyan-300 font-mono leading-tight">
          <strong>Key biological insight:</strong> These 5 fundamental sub-cellular structures (Membrane, Cytoplasm, Ribosomes, Mitochondria, & Nucleus) form the structural baseline for ALL animal cells.
        </div>
      </div>
    </div>
  );
}
