/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { DiffusionWidgetState } from "../types";
import { soundManager } from "../lib/sounds";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

export default function DiffusionDynamics() {
  const [state, setState] = useState<DiffusionWidgetState>({
    temperatureSetting: 20,
    surfaceAreaSetting: "flat"
  });

  const [netRate, setNetRate] = useState(12);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Initialize particles bounce on render and state updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;

    const freshParticles: Particle[] = [];

    // Left team: HIGH CONCENTRATION (45 pink particles)
    for (let i = 0; i < 45; i++) {
      freshParticles.push({
        x: Math.random() * (width / 2 - 25) + 10,
        y: Math.random() * (height - 20) + 10,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: "#ec4899" // Pink
      });
    }

    // Right team: LOW CONCENTRATION (6 pink particles)
    for (let i = 0; i < 6; i++) {
      freshParticles.push({
        x: Math.random() * (width / 2 - 25) + (width / 2 + 15),
        y: Math.random() * (height - 20) + 10,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: "#ec4899" // Pink
      });
    }

    particlesRef.current = freshParticles;
  }, []);

  // Update animated rate based on settings
  useEffect(() => {
    // Math model: base rate 10. +SA is +12. Temp ratio (32C vs 18C is x2 scale)
    const saFactor = state.surfaceAreaSetting === "folded" ? 2.2 : 1.0;
    const tempFactor = state.temperatureSetting === 18 ? 0.9 : state.temperatureSetting === 20 ? 1.0 : state.temperatureSetting === 27 ? 1.5 : 2.1;
    const rate = Math.round(10 * saFactor * tempFactor);
    setNetRate(rate);
  }, [state]);

  // Main animation frame loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const tick = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = "#09121a";
      ctx.fillRect(0, 0, width, height);

      // Temperature velocity scalar multipliers
      const speedScale = state.temperatureSetting === 18 ? 0.8 : state.temperatureSetting === 20 ? 1.1 : state.temperatureSetting === 27 ? 2.0 : 3.2;

      // Draw concentration labels
      ctx.fillStyle = "rgba(236, 72, 153, 0.08)";
      ctx.font = "bold 9px monospace";
      ctx.fillText("HIGH CONCENTRATION ZONE", 20, 30);
      ctx.fillStyle = "rgba(236, 72, 153, 0.04)";
      ctx.fillText("LOW CONCENTRATION ZONE", width - 150, 30);

      // Draw semi-permeable membrane
      ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 12]);

      const membraneX = width / 2;

      ctx.beginPath();
      if (state.surfaceAreaSetting === "flat") {
        ctx.moveTo(membraneX, 0);
        ctx.lineTo(membraneX, height);
        ctx.stroke();
      } else {
        // Draw a beautiful folded membrane (sine wave folded layout)
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(membraneX, 0);
        for (let y = 0; y <= height; y += 4) {
          const shiftX = Math.sin(y / 15) * 16;
          ctx.lineTo(membraneX + shiftX, y);
        }
        ctx.stroke();
      }
      ctx.setLineDash([]); // Reset dash

      // Update and draw particles
      particlesRef.current.forEach((p) => {
        // Move with speed scalar based on temperature
        p.x += p.vx * speedScale;
        p.y += p.vy * speedScale;

        // Bounce off walls
        if (p.x < 5 || p.x > width - 5) p.vx *= -1;
        if (p.y < 5 || p.y > height - 5) p.vy *= -1;

        // Membrane interaction (semi-permeable)
        // If flat membrane, filter crossing chances
        const crossedMembrane = Math.abs(p.x - membraneX) < 4;
        if (crossedMembrane) {
          // 45% chance to cross if flat, 85% chance if folded because of folded SA entry points
          const crossChance = state.surfaceAreaSetting === "folded" ? 0.85 : 0.45;
          if (Math.random() > crossChance) {
            p.vx *= -1; // Bounce off membrane instead
          }
        }

        // Draw particle glowing dot
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // Direction flow arrows
      ctx.strokeStyle = "rgba(0, 240, 255, 0.18)";
      ctx.lineWidth = 2;
      for (let y = 40; y < height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(membraneX - 35, y);
        ctx.lineTo(membraneX + 35, y);
        ctx.stroke();

        // Arrow head
        ctx.fillStyle = "rgba(0, 240, 255, 0.25)";
        ctx.beginPath();
        ctx.moveTo(membraneX + 35, y);
        ctx.lineTo(membraneX + 28, y - 5);
        ctx.lineTo(membraneX + 28, y + 5);
        ctx.fill();
      }

      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [state]);

  const changeTemp = (temp: number) => {
    soundManager.keypadTap();
    setState((prev) => ({ ...prev, temperatureSetting: temp }));
  };

  const changeSA = (sa: "flat" | "folded") => {
    soundManager.playClick();
    setState((prev) => ({ ...prev, surfaceAreaSetting: sa }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="diffusion-dynamics-root">
      
      {/* Interactive Gas/Liquid Particle Stage (Left) */}
      <div className="lg:col-span-7 bg-cyan-950/15 border border-cyan-500/20 p-5 rounded-xl flex flex-col justify-between" id="particle-dynamics-stage">
        <div className="flex justify-between items-center font-mono text-[9px] mb-2">
          <span className="text-pink-400">DIFFUSION KINETIC VISUALIZER</span>
          <span className="text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
            NET RATE OF DIFFUSION: {netRate} MB/S
          </span>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            width={380}
            height={260}
            id="particles-canvas"
            className="w-full h-auto bg-slate-950 border border-slate-900 rounded-lg shadow-inner"
          />
        </div>

        <div className="mt-3 flex justify-between text-[10px] font-mono text-slate-500 font-bold">
          <span>HIGH CONCENTRATED DEPOSIT (LEFT)</span>
          <span>SPARSE RANDOM DEPOSIT (RIGHT)</span>
        </div>
      </div>

      {/* Cyber Controllers (Right) */}
      <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/40 border border-slate-800 p-6 rounded-xl" id="diffusion-dials-panel">
        <div>
          <div className="border-b border-cyan-950/40 pb-2 mb-4">
            <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">DATA CARD 05</span>
            <h4 className="text-sm font-sans font-medium text-slate-300 uppercase mt-0.5">Systems Dynamics</h4>
          </div>

          <div className="space-y-5">
            {/* Dial 1: Temperature range */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-mono text-orange-400 uppercase font-semibold">DIAL 1: TEMPERATURE</label>
                <span className="text-xs font-mono text-orange-300 font-extrabold bg-orange-950/40 px-1.5 rounded border border-orange-500/15">
                  {state.temperatureSetting}°C
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2" id="temp-dials-group">
                {[18, 20, 27, 32].map((temp) => (
                  <button
                    key={temp}
                    onClick={() => changeTemp(temp)}
                    id={`btn-temp-dial-${temp}`}
                    className={`py-2 text-[10px] font-mono font-bold rounded border uppercase transition ${
                      state.temperatureSetting === temp
                        ? "bg-orange-500 text-slate-950 border-orange-400 font-extrabold shadow shadow-orange-950"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:border-orange-500/40"
                    }`}
                  >
                    {temp}°C
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 leading-tight font-mono">
                {state.temperatureSetting >= 27 
                  ? "🔥 HIGH TEMP = Particles gain maximum kinetic energy & vibrate faster, causing high diffusion rates." 
                  : "❄️ COOLED STATE = Reduced particle vibrations. Diffusion net velocity is heavily throttled."}
              </p>
            </div>

            {/* Dial 2: Surface Area options */}
            <div className="pt-2">
              <label className="block text-xs font-mono text-cyan-400 uppercase font-semibold mb-2">DIAL 2: SURFACE AREA</label>
              <div className="grid grid-cols-2 gap-3" id="sa-dials-group">
                <button
                  onClick={() => changeSA("flat")}
                  id="btn-sa-flat"
                  className={`py-2.5 text-xs font-mono font-semibold rounded border uppercase transition ${
                    state.surfaceAreaSetting === "flat"
                      ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold"
                      : "bg-slate-900 text-slate-400 border-slate-800 hover:border-cyan-500/40"
                  }`}
                >
                  ─ FLAT BARRIER
                </button>
                <button
                  onClick={() => changeSA("folded")}
                  id="btn-sa-folded"
                  className={`py-2.5 text-xs font-mono font-semibold rounded border uppercase transition ${
                    state.surfaceAreaSetting === "folded"
                      ? "bg-green-500 text-slate-950 border-green-400 font-bold"
                      : "bg-slate-900 text-slate-400 border-slate-800 hover:border-green-500/40"
                  }`}
                >
                  〰 FOLDED SURFACE
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 leading-tight font-mono">
                {state.surfaceAreaSetting === "folded"
                  ? "📈 FOLDED SURFACE = Drastically expands the surface area profile, creating massive additional molecular entry & exit pathways."
                  : "📉 STRAIGHT LINING = Minimum surface interface limits transport passages."}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom standard caution box */}
        <div className="mt-4 p-2 bg-slate-900/30 border border-slate-850 rounded text-[9px] text-slate-500 font-mono leading-tight">
          <strong>THERMAL PROTOCOL:</strong> Substances diffuse down their concentration gradient (from HIGH concentration to LOW concentration) via passive molecular kinetics.
        </div>
      </div>

    </div>
  );
}
