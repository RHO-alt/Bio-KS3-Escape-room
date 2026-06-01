/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { soundManager } from "../lib/sounds";

export default function TargetMatrix() {
  const [activeFaction, setActiveFaction] = useState<"animal" | "plant" | "bacteria">("plant");

  const comparisonData = [
    {
      feature: "Baseline Structures",
      sub: "(Membrane, Cytoplasm, Ribosomes, Genetic Material)",
      animal: { present: true, notes: "Fully integrated" },
      plant: { present: true, notes: "Fully integrated" },
      bacteria: { present: true, notes: "Loose DNA molecule" }
    },
    {
      feature: "Mitochondria Powerhouses",
      sub: "(Respiration and ATP engine)",
      animal: { present: true, notes: "Abundant" },
      plant: { present: true, notes: "Present" },
      bacteria: { present: false, notes: "No mitochondria" }
    },
    {
      feature: "True Cell Nucleus",
      sub: "(Membrane-bound command core)",
      animal: { present: true, notes: "Present" },
      plant: { present: true, notes: "Present" },
      bacteria: { present: false, notes: "Loose raw loop of DNA" }
    },
    {
      feature: "Plant Exclusives",
      sub: "(Cell Wall, Chloroplasts, Vacuole)",
      animal: { present: false, notes: "No walls or plastids" },
      plant: { present: true, notes: "Essential exclusives!" },
      bacteria: { present: false, notes: "Has Cell Wall (murein) but no chloroplasts" }
    },
    {
      feature: "Bacteria Exclusives",
      sub: "(Slime Capsule, flagellum propeller)",
      animal: { present: false, notes: "None" },
      plant: { present: false, notes: "None" },
      bacteria: { present: true, notes: "Tough sheath capsule & tail" }
    }
  ];

  const factionDetails = {
    animal: {
      name: "ANIMAL MODEL",
      icon: "🧬",
      color: "border-cyan-500 text-cyan-400 bg-cyan-950/25",
      description: "Simple, flexible structural perimeter with mitochondria, ribosomes, and DNA housed inside a defensive true nucleus command center."
    },
    plant: {
      name: "PLANT MODEL",
      icon: "🍀",
      color: "border-green-500 text-green-400 bg-green-950/25",
      description: "Reinforced model equipped with custom machinery: thick rigid Cellulose Cell Walls, photosynthetic Chloroplast solar trap, and a permanent sap Vacuole."
    },
    bacteria: {
      name: "BACTERIA AGENT",
      icon: "👾",
      color: "border-orange-500 text-orange-400 bg-orange-950/25",
      description: "Primitive single-cell rogue agent. Dispenses with nucleus and mitochondria entirely; relies on a free-floating genetic loop, tough Slime Capsule, and a whip-like Flagellum propeller."
    }
  };

  const handleFactionChange = (faction: "animal" | "plant" | "bacteria") => {
    soundManager.playClick();
    setActiveFaction(faction);
  };

  return (
    <div className="flex flex-col space-y-6" id="target-matrix-root">
      {/* Upper selector buttons */}
      <div className="grid grid-cols-3 gap-3" id="matrix-tabs">
        {(["animal", "plant", "bacteria"] as const).map((fact) => (
          <button
            key={fact}
            onClick={() => handleFactionChange(fact)}
            id={`btn-faction-tab-${fact}`}
            className={`py-3 px-4 rounded-xl border text-center transition ${
              activeFaction === fact
                ? `${factionDetails[fact].color} border-2 font-bold shadow-[0_0_15px_rgba(34,197,94,0.15)]`
                : "bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700"
            }`}
          >
            <span className="text-xl block mb-1">{factionDetails[fact].icon}</span>
            <span className="text-xs font-mono uppercase tracking-widest">{factionDetails[fact].name}</span>
          </button>
        ))}
      </div>

      {/* Grid Table */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-xl overflow-hidden" id="matrix-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto" id="matrix-table">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="p-4 w-[40%]">Sub-Cellular Target Criteria</th>
                <th className="p-4 text-center">ANIMAL CELL</th>
                <th className="p-4 text-center">PLANT CELL</th>
                <th className="p-4 text-center whitespace-nowrap">BACTERIA CELL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {comparisonData.map((row) => (
                <tr
                  key={row.feature}
                  className={`transition hover:bg-slate-900/20 ${
                    row.feature.toLowerCase().includes(activeFaction) ? "bg-cyan-950/5" : ""
                  }`}
                >
                  <td className="p-4">
                    <span className="font-heading font-medium text-slate-200 block">{row.feature}</span>
                    <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{row.sub}</span>
                  </td>
                  
                  {/* Animal Cell Output Column */}
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`text-[15px] font-bold ${row.animal.present ? "text-cyan-400" : "text-slate-600"}`}>
                        {row.animal.present ? "✔ YES" : "✖ NO"}
                      </span>
                      <span className="text-[8px] font-mono text-slate-500 mt-0.5">{row.animal.notes}</span>
                    </div>
                  </td>

                  {/* Plant Cell Output Column */}
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`text-[15px] font-bold ${row.plant.present ? "text-green-400" : "text-slate-600"}`}>
                        {row.plant.present ? "✔ YES" : "✖ NO"}
                      </span>
                      <span className="text-[8px] font-mono text-slate-500 mt-0.5">{row.plant.notes}</span>
                    </div>
                  </td>

                  {/* Bacteria Agent Output Column */}
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center font-mono">
                      <span className={`text-[14px] font-bold ${row.bacteria.present ? "text-orange-400" : "text-slate-600"}`}>
                        {row.bacteria.present ? "✔ YES" : "✖ NO"}
                      </span>
                      <span className="text-[8px] font-mono text-slate-500 mt-0.5 uppercase">{row.bacteria.notes}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Faction Readout Summary card */}
      <div className={`p-4 rounded-xl border-2 transition duration-300 ${factionDetails[activeFaction].color}`} id="faction-matrix-summary">
        <h5 className="font-mono text-xs font-bold uppercase tracking-wider mb-1 flex items-center space-x-2">
          <span>{factionDetails[activeFaction].icon}</span>
          <span>{factionDetails[activeFaction].name} BIO-ENGINE MODULE</span>
        </h5>
        <p className="text-xs leading-relaxed text-slate-300 font-sans">
          {factionDetails[activeFaction].description}
        </p>
      </div>
    </div>
  );
}
