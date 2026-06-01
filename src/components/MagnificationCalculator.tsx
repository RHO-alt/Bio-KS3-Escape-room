/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { FormulaState } from "../types";
import { soundManager } from "../lib/sounds";

export default function MagnificationCalculator() {
  const [state, setState] = useState<FormulaState>({
    selectedTerm: "image",
    eyepieceFactor: 10,
    objectiveFactor: 40,
    conversionValueCm: 5
  });

  const [calcInputs, setCalcInputs] = useState({
    actualSize: "0.1",
    magnification: "400",
    imageSizeInMm: "40"
  });

  const getFormulaText = () => {
    switch (state.selectedTerm) {
      case "image":
        return {
          title: "IMAGE SIZE (I)",
          form: "I = A × M",
          desc: "The size of the specimen as seen down the microscope eyepiece. Calculate by multiplying Actual Size by Magnification factor."
        };
      case "actual":
        return {
          title: "ACTUAL SIZE (A)",
          form: "A = I ÷ M",
          desc: "The real biological size of the specimen under natural conditions. Calculate by dividing Image Size by Magnification multiplier."
        };
      case "magnification":
        return {
          title: "MAGNIFICATION (M)",
          form: "M = I ÷ A",
          desc: "The ratio of an object's image size to its real size. Calculate by dividing Image Size by Actual Size."
        };
      default:
        return {
          title: "MAGNIFICATION TRIANGLE (I-A-M)",
          form: "Click elements to load calculations",
          desc: "Master the core formula to quickly calculate dimensions under high magnification targets."
        };
    }
  };

  const handleTermClick = (term: "image" | "actual" | "magnification") => {
    soundManager.playClick();
    setState((prev) => ({ ...prev, selectedTerm: term }));
  };

  const handleEyepieceChange = (val: number) => {
    soundManager.keypadTap();
    setState((prev) => ({ ...prev, eyepieceFactor: val }));
  };

  const handleObjectiveChange = (val: number) => {
    soundManager.keypadTap();
    setState((prev) => ({ ...prev, objectiveFactor: val }));
  };

  const formulaInfo = getFormulaText();
  const calculatedTotal = state.eyepieceFactor * state.objectiveFactor;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="magnification-calculator-root">
      
      {/* Top Left: Interactive Triangle (GCSE/GCSE-A standard visualization) */}
      <div className="lg:col-span-6 bg-slate-950/40 border border-slate-800 p-6 rounded-xl flex flex-col justify-between" id="magnification-triangle-panel">
        <div>
          <div className="border-b border-cyan-950/40 pb-2 mb-4">
            <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">DATA CARD 02 - PART 1</span>
            <h4 className="text-sm font-sans font-medium text-slate-300 uppercase mt-0.5">Tactical Triangle (I-A-M)</h4>
          </div>

          {/* Interactive Triangle Graphic */}
          <div className="flex flex-col items-center justify-center p-4 relative" id="interactive-triangle">
            <svg viewBox="0 0 300 240" className="w-56 h-auto drop-shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              {/* Outer lines of the triangle */}
              <polygon
                points="150,20 280,220 20,220"
                fill="none"
                stroke="#1e293b"
                strokeWidth="4"
              />
              
              {/* Internal Horizontal Divider */}
              <line x1="85" y1="120" x2="215" y2="120" stroke="#1e293b" strokeWidth="4" />
              {/* Internal Vertical Divider */}
              <line x1="150" y1="120" x2="150" y2="220" stroke="#1e293b" strokeWidth="4" />

              {/* Triangle parts (clickable zones) */}
              {/* "I" Element */}
              <path
                d="M150,25 L210,115 L90,115 Z"
                className={`cursor-pointer transition duration-300 ${
                  state.selectedTerm === "image"
                    ? "fill-cyan-500/15 stroke-cyan-400 stroke-[3]"
                    : "fill-slate-900/60 stroke-slate-800 stroke-[1.5] hover:fill-cyan-950/30 hover:stroke-cyan-500"
                }`}
                onClick={() => handleTermClick("image")}
              />
              <text
                x="150"
                y="85"
                textAnchor="middle"
                className={`font-sans font-bold text-3xl select-none cursor-pointer tracking-tight ${
                  state.selectedTerm === "image" ? "fill-cyan-300" : "fill-slate-500"
                }`}
                onClick={() => handleTermClick("image")}
              >
                I
              </text>

              {/* "A" Element */}
              <path
                d="M25,215 L85,125 L145,125 L145,215 Z"
                className={`cursor-pointer transition duration-300 ${
                  state.selectedTerm === "actual"
                    ? "fill-cyan-500/15 stroke-cyan-400 stroke-[3]"
                    : "fill-slate-900/60 stroke-slate-800 stroke-[1.5] hover:fill-cyan-950/30 hover:stroke-cyan-500"
                }`}
                onClick={() => handleTermClick("actual")}
              />
              <text
                x="85"
                y="185"
                textAnchor="middle"
                className={`font-sans font-bold text-3xl select-none cursor-pointer tracking-tight ${
                  state.selectedTerm === "actual" ? "fill-cyan-300" : "fill-slate-500"
                }`}
                onClick={() => handleTermClick("actual")}
              >
                A
              </text>

              {/* "M" Element */}
              <path
                d="M275,215 L215,125 L155,125 L155,215 Z"
                className={`cursor-pointer transition duration-300 ${
                  state.selectedTerm === "magnification"
                    ? "fill-cyan-500/15 stroke-cyan-400 stroke-[3]"
                    : "fill-slate-900/60 stroke-slate-800 stroke-[1.5] hover:fill-cyan-950/30 hover:stroke-cyan-500"
                }`}
                onClick={() => handleTermClick("magnification")}
              />
              <text
                x="215"
                y="185"
                textAnchor="middle"
                className={`font-sans font-bold text-3xl select-none cursor-pointer tracking-tight ${
                  state.selectedTerm === "magnification" ? "fill-cyan-300" : "fill-slate-500"
                }`}
                onClick={() => handleTermClick("magnification")}
              >
                M
              </text>
            </svg>

            {/* Micro division indicators */}
            <div className="absolute top-1/2 left-3 font-mono text-[9px] text-slate-600">÷ DIVIDE</div>
            <div className="absolute top-1/2 right-3 font-mono text-[9px] text-slate-600">÷ DIVIDE</div>
            <div className="absolute bottom-2 font-mono text-[9px] text-slate-600">× MULTIPLY</div>
          </div>

          {/* Details view for selected Term */}
          <div className="mt-4 p-4 bg-cyan-950/15 border border-cyan-800/30 rounded-lg" id="formula-detail">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-mono text-cyan-400 font-bold">{formulaInfo.title}</span>
              <span className="text-sm font-mono text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">{formulaInfo.form}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{formulaInfo.desc}</p>
          </div>
        </div>

        {/* Dynamic calculation proof */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs font-mono text-slate-400">
          <span>Active Equation:</span>
          <span>{state.selectedTerm === "image" ? "Image Size = Actual × Magnification" : state.selectedTerm === "actual" ? "Actual Size = Image ÷ Magnification" : "Magnification = Image ÷ Actual"}</span>
        </div>
      </div>

      {/* Top Right: Total Power multiplication selector (screenshot Page 3) */}
      <div className="lg:col-span-6 bg-slate-950/40 border border-slate-800 p-6 rounded-xl flex flex-col justify-between" id="magnification-power-panel">
        <div>
          <div className="border-b border-cyan-950/40 pb-2 mb-4">
            <span className="text-xs font-mono text-orange-400 font-semibold uppercase tracking-wider">DATA CARD 02 - PART 2</span>
            <h4 className="text-sm font-sans font-medium text-slate-300 uppercase mt-0.5">Total Power Override</h4>
          </div>

          <div className="space-y-4">
            {/* Eyepiece factors selection */}
            <div>
              <span className="block text-xs font-mono text-slate-400 uppercase mb-2">Eyepiece Lens Multiplier (Ocular)</span>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((factor) => (
                  <button
                    key={factor}
                    onClick={() => handleEyepieceChange(factor)}
                    id={`btn-eyepiece-${factor}`}
                    className={`py-2 text-xs font-mono rounded border transition ${
                      state.eyepieceFactor === factor
                        ? "bg-orange-500 text-slate-950 border-orange-400 font-bold shadow"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:border-orange-500/40"
                    }`}
                  >
                    ×{factor} Lens
                  </button>
                ))}
              </div>
            </div>

            {/* Objective lens factor selection */}
            <div>
              <span className="block text-xs font-mono text-slate-400 uppercase mb-2">Objective Lens Magnifier</span>
              <div className="grid grid-cols-3 gap-2">
                {[4, 10, 40, 50].map((factor) => (
                  <button
                    key={factor}
                    onClick={() => handleObjectiveChange(factor)}
                    id={`btn-objective-${factor}`}
                    className={`py-2 text-xs font-mono rounded border transition ${
                      state.objectiveFactor === factor
                        ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:border-cyan-500/40"
                    }`}
                  >
                    ×{factor} Nosepiece
                  </button>
                ))}
              </div>
            </div>

            {/* Total calculation layout (glowing right panel) */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between mt-4">
              <div className="font-mono text-xs">
                <span className="text-slate-400 uppercase block leading-tight">Total Override Equation:</span>
                <span className="text-orange-400 font-bold">×{state.eyepieceFactor} Ocular</span>
                <span className="text-slate-500 mx-1">×</span>
                <span className="text-cyan-400 font-bold">×{state.objectiveFactor} Objective</span>
              </div>

              <div className="bg-cyan-950/20 px-4 py-2 border border-cyan-500/40 rounded text-right">
                <span className="text-[10px] font-mono text-cyan-400 uppercase block tracking-wider font-semibold">Total Magnification</span>
                <span className="text-2xl font-mono text-cyan-300 font-extrabold tracking-tight">×{calculatedTotal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning caution box */}
        <div className="mt-4 p-2 bg-slate-900/30 border border-slate-800/80 rounded text-[10px] text-slate-500 font-mono leading-tight">
          Total magnification is the mathematical product of the eyepiece magnification power multiplied by the objective lens power currently rotated into place.
        </div>
      </div>

      {/* Bottom: Interactive conversion ruler (screenshot Page 3) */}
      <div className="lg:col-span-12 bg-slate-950/40 border border-slate-800 p-6 rounded-xl" id="conversion-ruler-panel">
        <div className="border-b border-cyan-950/40 pb-2 mb-4">
          <span className="text-xs font-mono text-green-400 font-bold uppercase tracking-wider">DATA CARD 02 - PART 3</span>
          <h4 className="text-sm font-sans font-medium text-slate-300 uppercase mt-0.5 font-semibold">Conversion Scale (Centimeters to Millimeters)</h4>
        </div>

        <div className="space-y-6">
          {/* Tactical Conversion Rule Graphic */}
          <div className="relative p-2 bg-slate-900/45 border border-slate-800/80 rounded-lg overflow-hidden py-6">
            <div className="grid grid-cols-11 gap-0 text-center relative pointer-events-none">
              
              {/* CM Scale (Top) */}
              <div className="col-span-11 flex justify-between px-4 font-mono text-[9px] text-cyan-400 border-b border-cyan-900/40 pb-4 relative">
                {Array.from({ length: 11 }).map((_, j) => (
                  <div key={`cm-${j}`} className="flex flex-col items-center">
                    <span className="h-2.5 w-[1px] bg-cyan-500/80 mb-1"></span>
                    <span>{j} cm</span>
                  </div>
                ))}
                
                {/* Glow Cursor */}
                <div
                  className="absolute bottom-[-1px] h-[3px] bg-cyan-400 shadow-lg shadow-cyan-300 transition-all duration-200"
                  style={{
                    left: `${4 + (state.conversionValueCm * 9.2)}%`,
                    width: "20px"
                  }}
                />
              </div>

              {/* MM Scale (Bottom) */}
              <div className="col-span-11 flex justify-between px-4 font-mono text-[9px] text-green-400 pt-3 relative">
                {Array.from({ length: 11 }).map((_, j) => (
                  <div key={`mm-${j}`} className="flex flex-col items-center">
                    <span>{j * 10} mm</span>
                    <span className="h-2.5 w-[1px] bg-green-500/80 mt-1"></span>
                  </div>
                ))}
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Slider control */}
            <div className="md:col-span-7">
              <label className="block text-xs font-mono text-slate-400 uppercase mb-2">INTERACTIVE SCALE CONVERTER SLIDER: {state.conversionValueCm} cm</label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={state.conversionValueCm}
                onChange={(e) => {
                  soundManager.keypadTap();
                  setState((prev) => ({ ...prev, conversionValueCm: Number(e.target.value) }));
                }}
                id="conversion-slider"
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-500 lg:accent-green-500/90 hover:accent-green-400"
              />
            </div>

            {/* Output proof box */}
            <div className="md:col-span-5 bg-green-950/15 border border-green-800/40 rounded-lg p-3 text-center text-xs font-mono">
              <span className="text-slate-400 block mb-1">TACTICAL CONVERSION: cm to mm</span>
              <span className="text-slate-300 font-bold bg-green-500/10 px-2 py-1 rounded">
                MULTIPLY BY 10 → <strong className="text-green-300 font-extrabold text-sm">{state.conversionValueCm} cm</strong> = <strong className="text-green-400 font-extrabold text-sm">{state.conversionValueCm * 10} mm</strong>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
