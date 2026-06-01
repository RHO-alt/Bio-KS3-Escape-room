/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { soundManager } from "../lib/sounds";

export default function SpecialForces() {
  const [selectedOperative, setSelectedOperative] = useState<number>(1);

  const operatives = [
    {
      id: 1,
      cardId: 7,
      name: "OPERATIVE 1: RED BLOOD CELL",
      type: "ANIMAL FORCE",
      mission: "Transport chemical Oxygen payload (O2) from respiratory nodes to peripheral tissue cores.",
      adaptationA: {
        title: "Biconcave shape perimeter",
        details: "Increases membrane surface area drastically to maximize passive gas diffusion rates."
      },
      adaptationB: {
        title: "Absence of Cell Nucleus",
        details: "Creates maximum spatial volume inside the outer membrane to pack in hemoglobin carrier proteins."
      },
      graphicLabel: "BICONCAVE RED CORPUSCLE",
      glowColor: "border-cyan-500/40 focus:border-cyan-400 text-cyan-400 bg-cyan-950/10"
    },
    {
      id: 2,
      cardId: 7,
      name: "OPERATIVE 2: MUSCLE CELL",
      type: "ANIMAL FORCE",
      mission: "Conduct high-frequency physical contractions to coordinate mechanical skeletal movement.",
      adaptationA: {
        title: "Extreme length profile",
        details: "Contains specialized interlocking protein filaments that slide past each other to contract."
      },
      adaptationB: {
        title: "Mitochondrial Overload",
        details: "Fully packed with secondary mitochondria to continuously synthesize massive ATP energy reserves."
      },
      graphicLabel: "MYOFIBRIL CONTRACTOR",
      glowColor: "border-orange-500/40 focus:border-orange-400 text-orange-400 bg-orange-950/10"
    },
    {
      id: 3,
      cardId: 8,
      name: "OPERATIVE 3: ROOT HAIR CELL",
      type: "PLANT LEAGUE",
      mission: "Absorb subterranean water isotopes and mineral ions from deep soil matrices.",
      adaptationA: {
        title: "Elongated cytoplasmic projection",
        details: "Drastically expands cell surface area, maximizing interaction pathways with surrounding clay soils."
      },
      adaptationB: {
        title: "Nuclear survival (No Chloroplasts)",
        details: "Operates deep underground in zero light conditions; chloroplast solar cells are omitted to conserve resources."
      },
      graphicLabel: "SUBTERRANEAN ION ABSORBER",
      glowColor: "border-teal-500/40 focus:border-teal-400 text-teal-400 bg-teal-950/10"
    },
    {
      id: 4,
      cardId: 8,
      name: "OPERATIVE 4: PALISADE CELL",
      type: "PLANT LEAGUE",
      mission: "Serve as the primary light trapping engine of the top leaf column.",
      adaptationA: {
        title: "Tightly packed vertical columns",
        details: "Arranged closely together at the top surface of the leaf to stop all escaping light packets."
      },
      adaptationB: {
        title: "Chloroplast Overload",
        details: "Dense deposit of chlorophyll chloroplasts positioned close to the light facing wall to maximize photosynthesis."
      },
      graphicLabel: "PHOTOSYNTHETIC SOLAR MACHINE",
      glowColor: "border-green-500/40 focus:border-green-400 text-green-400 bg-green-950/10"
    }
  ];

  const current = operatives.find((op) => op.id === selectedOperative) || operatives[0];

  const handleOpSelect = (id: number) => {
    soundManager.playClick();
    setSelectedOperative(id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="special-forces-root">
      
      {/* Selector Side Panel (Left) */}
      <div className="lg:col-span-5 flex flex-col space-y-2.5 justify-center" id="ops-Selector-menu">
        <span className="text-[10px] font-mono text-slate-500 font-extrabold uppercase px-1">SELECT SPECIAL FORCES OPERATIVE</span>
        {operatives.map((op) => (
          <button
            key={op.id}
            onClick={() => handleOpSelect(op.id)}
            id={`btn-op-${op.id}`}
            className={`p-3 rounded-lg border text-left transition relative select-none ${
              selectedOperative === op.id
                ? "border-cyan-500 bg-slate-900 shadow font-semibold"
                : "bg-slate-950/40 border-slate-855 border-slate-800 text-slate-500 hover:border-slate-700"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-mono font-bold ${selectedOperative === op.id ? "text-cyan-400" : "text-slate-500"}`}>
                {op.name.split(":")[0]}
              </span>
              <span className="text-[8px] font-mono text-slate-500">CARD 0{op.cardId}</span>
            </div>
            <span className={`text-xs block font-heading tracking-tight uppercase ${selectedOperative === op.id ? "text-slate-100" : "text-slate-400"}`}>
              {op.name.split(":")[1].trim()}
            </span>
          </button>
        ))}
      </div>

      {/* Main Dossier Specs Readout (Right) */}
      <div className="lg:col-span-7 bg-slate-950/40 border border-slate-800 p-6 rounded-xl flex flex-col justify-between" id="op-intel-readout">
        <div>
          {/* Header */}
          <div className="border-b border-cyan-950/40 pb-2 mb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold tracking-widest">SPECIAL FORCES COMPILATION</span>
              <h4 className="text-sm font-sans font-bold text-slate-200 mt-0.5 uppercase tracking-wide">{current.name}</h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded font-semibold">
              {current.type}
            </span>
          </div>

          {/* Mission parameters */}
          <div className="mb-4 bg-slate-900/60 border border-slate-850 p-3 rounded-lg font-mono text-xs">
            <span className="text-orange-400 font-bold block uppercase mb-1">Dossier Target Mission:</span>
            <p className="text-slate-300 font-sans leading-relaxed">{current.mission}</p>
          </div>

          <div className="space-y-4">
            {/* Adaptation A */}
            <div className="border-l-2 border-cyan-500/60 pl-3">
              <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase block tracking-wider">ADAPTATION ALPHA:</span>
              <span className="font-sans font-semibold text-xs text-slate-200 block mt-0.5">{current.adaptationA.title}</span>
              <p className="text-xs text-slate-400 font-sans leading-normal mt-0.5">{current.adaptationA.details}</p>
            </div>

            {/* Adaptation B */}
            <div className="border-l-2 border-orange-500/60 pl-3">
              <span className="font-mono text-[10px] text-orange-400 font-bold uppercase block tracking-wider">ADAPTATION BRAVO:</span>
              <span className="font-sans font-semibold text-xs text-slate-200 block mt-0.5">{current.adaptationB.title}</span>
              <p className="text-xs text-slate-400 font-sans leading-normal mt-0.5">{current.adaptationB.details}</p>
            </div>
          </div>
        </div>

        {/* Drawing diagram label spec */}
        <div className="mt-6 p-2 bg-cyan-950/20 border border-cyan-500/20 rounded text-[10px] font-mono text-center text-cyan-400 uppercase tracking-widest font-semibold">
          🧬 PROFILE DESIGNATOR: {current.graphicLabel}
        </div>
      </div>

    </div>
  );
}
