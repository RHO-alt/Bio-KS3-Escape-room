/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { MicroscopeState } from "../types";
import { soundManager } from "../lib/sounds";

export default function MicroscopeViewer() {
  const [state, setState] = useState<MicroscopeState>({
    magnificationMode: "lowest",
    focusValue: 20,
    isLightOn: true,
    activePath: null
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Redraw the simulated cellular specimen onto the canvas with current blur and zoom levels
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = "#0c1720";
    ctx.fillRect(0, 0, width, height);

    // Apply focusing blur filter
    const blurAmount = Math.abs(state.focusValue - 85) / 5;
    ctx.filter = state.isLightOn ? `blur(${blurAmount}px)` : "blur(18px) grayscale(100%)";

    // Ambient circular grid
    ctx.strokeStyle = "rgba(0, 240, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, width * 0.35, 0, Math.PI * 2);
    ctx.stroke();

    for (let r = 20; r < width * 0.45; r += 40) {
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0, 240, 255, 0.05)";
      ctx.stroke();
    }

    // Crosshairs
    ctx.strokeStyle = "rgba(0, 240, 255, 0.3)";
    ctx.beginPath();
    ctx.moveTo(width / 2, 10);
    ctx.lineTo(width / 2, height - 10);
    ctx.moveTo(10, height / 2);
    ctx.lineTo(width - 10, height / 2);
    ctx.stroke();

    // Specimen Cells
    // Draw cells inside the lens
    if (state.isLightOn) {
      // Choose base size by magnification mode
      const scale = state.magnificationMode === "lowest" ? 0.35 : state.magnificationMode === "medium" ? 0.8 : 1.7;
      const cellColor = "rgba(0, 240, 255, 0.75)";
      const nucleusColor = "rgba(0, 255, 102, 0.8)";

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(scale, scale);

      // Draw middle main cell
      ctx.fillStyle = "rgba(0, 240, 255, 0.08)";
      ctx.strokeStyle = cellColor;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.ellipse(0, 0, 50, 40, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Nucleus
      ctx.fillStyle = "rgba(0, 255, 102, 0.15)";
      ctx.strokeStyle = nucleusColor;
      ctx.beginPath();
      ctx.arc(10, -5, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Vacuoles and mitochondria inside
      ctx.fillStyle = "rgba(255, 123, 0, 0.4)";
      ctx.beginPath();
      ctx.ellipse(-25, 10, 8, 4, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw secondary neighboring cells for low magnification
      if (state.magnificationMode === "lowest") {
        ctx.beginPath();
        ctx.ellipse(-85, -60, 45, 35, 0, 0, Math.PI * 2);
        ctx.ellipse(85, 55, 45, 35, Math.PI / 4, 0, Math.PI * 2);
        ctx.ellipse(-70, 75, 40, 35, -Math.PI / 3, 0, Math.PI * 2);
        ctx.ellipse(80, -70, 45, 35, Math.PI / 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Reset filters
    ctx.filter = "none";

    // Overlay scan lines
    ctx.fillStyle = "rgba(0, 240, 255, 0.02)";
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 1);
    }

    // Outer vignette ring
    const gradient = ctx.createRadialGradient(width / 2, height / 2, width * 0.38, width / 2, height / 2, width * 0.5);
    gradient.addColorStop(0, "rgba(6, 18, 26, 0)");
    gradient.addColorStop(1, "rgba(6, 18, 26, 0.95)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Frame
    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, width * 0.46, 0, Math.PI * 2);
    ctx.stroke();

  }, [state]);

  const handleFocusChange = (val: number) => {
    setState((prev) => ({ ...prev, focusValue: val }));
    if (Math.abs(val - 85) < 3) {
      soundManager.playSuccess();
    } else if (val % 8 === 0) {
      soundManager.keypadTap();
    }
  };

  const setMagnification = (mode: "lowest" | "medium" | "highest") => {
    soundManager.playClick();
    setState((prev) => ({ ...prev, magnificationMode: mode }));
  };

  const toggleLight = () => {
    soundManager.playClick();
    setState((prev) => ({ ...prev, isLightOn: !prev.isLightOn }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="microscope-viewer-root">
      {/* Specimen HUD Lens (Left) */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center bg-cyan-950/15 border border-cyan-500/30 p-6 rounded-xl relative overflow-hidden" id="specimen-hud-panel">
        <div className="absolute top-3 left-4 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="text-xs font-mono text-cyan-400 tracking-wider font-semibold">HUD RESOLUTION LENS</span>
        </div>

        <div className="relative mt-4">
          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            id="lens-canvas"
            className="rounded-full shadow-2xl shadow-cyan-900/35 bg-slate-950"
          />
          {/* Target details inside lens */}
          <div className="absolute bottom-6 right-8 text-right bg-slate-950/80 p-2 border border-cyan-800/60 rounded font-mono text-[10px] text-cyan-300">
            <p>SCALE: {state.magnificationMode === "lowest" ? "x40" : state.magnificationMode === "medium" ? "x100" : "x400"}</p>
            <p>FOCUS: {state.focusValue}%</p>
            <p className={Math.abs(state.focusValue - 85) < 5 ? "text-green-400 font-bold" : "text-amber-500 font-bold"}>
              {Math.abs(state.focusValue - 85) < 5 ? "STATUS: SHARP" : "STATUS: FUZZY"}
            </p>
          </div>
        </div>

        {/* Light switch bar */}
        <div className="mt-6 flex space-x-4 items-center">
          <span className="text-xs font-mono text-slate-400">MIRROR LIGHT SOURCE:</span>
          <button
            onClick={toggleLight}
            id="btn-toggle-light"
            className={`px-4 py-1.5 font-mono text-xs rounded transition uppercase border font-semibold ${
              state.isLightOn
                ? "bg-green-500/20 text-green-400 border-green-500"
                : "bg-slate-800 text-slate-500 border-slate-700"
            }`}
          >
            {state.isLightOn ? "● ACTIVE (ILLUMINATING)" : "○ OFFLINE (DARK)"}
          </button>
        </div>
      </div>

      {/* Cyber Controls (Right) */}
      <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/40 border border-slate-800 p-6 rounded-xl" id="microscope-controls-panel">
        <div>
          <div className="border-b border-cyan-900/40 pb-3 mb-4">
            <span className="text-xs font-mono text-orange-400 uppercase tracking-widest font-semibold">DATA CARD 01</span>
            <h3 className="text-lg font-sans font-medium text-slate-200 uppercase tracking-tight mt-1">Microscope Mechanics</h3>
          </div>

          <div className="space-y-5">
            {/* Path 1 Info */}
            <div
              className={`p-3 rounded-lg border transition ${
                state.activePath === "magnify"
                  ? "bg-cyan-950/25 border-cyan-500 text-cyan-200"
                  : "bg-slate-900/30 border-slate-800/80 text-slate-400"
              }`}
              onMouseEnter={() => setState((prev) => ({ ...prev, activePath: "magnify" }))}
              onMouseLeave={() => setState((prev) => ({ ...prev, activePath: null }))}
            >
              <div className="flex items-center space-x-2 text-cyan-400 font-semibold mb-1">
                <span className="text-[10px] font-mono border border-cyan-500 px-1 rounded">PATH 1</span>
                <span className="text-xs tracking-wider font-mono">MAGNIFY</span>
              </div>
              <p className="text-xs leading-relaxed">
                Makes the image physically <strong className="text-cyan-300">BIGGER</strong>. Controlled by swapping objective lenses or adjusting eyepieces.
              </p>
            </div>

            {/* Path 2 Info */}
            <div
              className={`p-3 rounded-lg border transition ${
                state.activePath === "focus"
                  ? "bg-orange-950/25 border-orange-500 text-orange-200"
                  : "bg-slate-900/30 border-slate-800/80 text-slate-400"
              }`}
              onMouseEnter={() => setState((prev) => ({ ...prev, activePath: "focus" }))}
              onMouseLeave={() => setState((prev) => ({ ...prev, activePath: null }))}
            >
              <div className="flex items-center space-x-2 text-orange-400 font-semibold mb-1">
                <span className="text-[10px] font-mono border border-orange-500 px-1 rounded">PATH 2</span>
                <span className="text-xs tracking-wider font-mono">FOCUS</span>
              </div>
              <p className="text-xs leading-relaxed">
                Makes the image <strong className="text-orange-300">CLEARER and SHARPER</strong>. Coarse and fine knobs adjust the height of the slide stage.
              </p>
            </div>

            {/* Magnification Controls */}
            <div className="pt-2">
              <label className="block text-xs font-mono text-cyan-400 uppercase mb-2">OBJECTIVE REVOLVING NOSEPIECE</label>
              <div className="grid grid-cols-3 gap-2" id="objective-btn-group">
                {(["lowest", "medium", "highest"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setMagnification(mode)}
                    id={`btn-mag-${mode}`}
                    className={`py-2 text-[10px] font-mono font-bold rounded border uppercase transition ${
                      state.magnificationMode === mode
                        ? "bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold shadow-md shadow-cyan-950"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:border-cyan-800 hover:text-cyan-300"
                    }`}
                  >
                    {mode === "lowest" ? "LENS x4 (40x)" : mode === "medium" ? "LENS x10 (100x)" : "LENS x40 (400x)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Focus Adjustment */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-mono text-orange-400 uppercase">FINE FOCUS CONTROL PINION</label>
                <span className="text-xs font-mono text-orange-300 font-bold">{state.focusValue}% Focus</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={state.focusValue}
                onChange={(e) => handleFocusChange(Number(e.target.value))}
                id="focus-slider"
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500 lg:accent-orange-500/90 hover:accent-orange-400"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                <span>0% (BLURRY)</span>
                <span>85% OPTIMAL RESOLUTION</span>
                <span>100% (BLURRY)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Protocol alert box */}
        <div className="mt-6 p-2.5 bg-amber-950/20 border border-amber-500/30 rounded text-[10px] text-amber-300 font-mono leading-tight flex items-center space-x-2">
          <span>⚠️</span>
          <span>
            <strong>PROTOCOL alert:</strong> Always start on the lowest power objective lens before increasing magnification, or you risk cracking the slide glass stage.
          </span>
        </div>
      </div>
    </div>
  );
}
