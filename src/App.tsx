/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { soundManager } from "./lib/sounds";
import { DATA_CARDS, CHECKPOINTS } from "./lib/data";
import DossierBriefing from "./components/DossierBriefing";
import MicroscopeViewer from "./components/MicroscopeViewer";
import MagnificationCalculator from "./components/MagnificationCalculator";
import AnimalCellModel from "./components/AnimalCellModel";
import TargetMatrix from "./components/TargetMatrix";
import DiffusionDynamics from "./components/DiffusionDynamics";
import RogueAgents from "./components/RogueAgents";
import SpecialForces from "./components/SpecialForces";
import CheckpointLockView from "./components/CheckpointLockView";
import FinalExtraction from "./components/FinalExtraction";
import DebriefingView from "./components/DebriefingView";

export default function App() {
  // Game life cycle states
  const [stage, setStage] = useState<"briefing" | "play" | "completed">("briefing");
  const [activeChannel, setActiveChannel] = useState<"datacards" | "checkpoints" | "extraction">("datacards");
  const [activeCardId, setActiveCardId] = useState<number>(1);
  const [activeCheckpointId, setActiveCheckpointId] = useState<string>("alpha");
  const [operativeName, setOperativeName] = useState<string>("");
  const [timerSeconds, setTimerSeconds] = useState<number>(3600); // 60:00:00 (60 minutes)
  const [isMuted, setIsMuted] = useState<boolean>(true); // Deafult muted initially
  
  // Progression checkpoint saves
  const [checkpointSaves, setCheckpointSaves] = useState<any>({
    alpha: { coreUnlocked: false, tacticalUnlocked: false, masteryUnlocked: false, completed: false },
    bravo: { coreUnlocked: false, tacticalUnlocked: false, masteryUnlocked: false, completed: false },
    charlie: { coreUnlocked: false, tacticalUnlocked: false, masteryUnlocked: false, completed: false },
    delta: { coreUnlocked: false, tacticalUnlocked: false, masteryUnlocked: false, completed: false }
  });

  // Track state in localStorage to prevent loss on reload
  useEffect(() => {
    try {
      const cached = localStorage.getItem("biology_tactical_bootcamp_state");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.operativeName) setOperativeName(parsed.operativeName);
        if (parsed.checkpointSaves) setCheckpointSaves(parsed.checkpointSaves);
        if (parsed.timerSeconds) setTimerSeconds(parsed.timerSeconds);
        if (parsed.stage) setStage(parsed.stage);
        if (parsed.activeChannel) setActiveChannel(parsed.activeChannel);
        if (parsed.activeCardId) setActiveCardId(parsed.activeCardId);
        if (parsed.activeCheckpointId) setActiveCheckpointId(parsed.activeCheckpointId);
      }
    } catch (e) {
      console.warn("Storage restore blocked", e);
    }
  }, []);

  // Save changes to cache
  const triggerCacheSave = (updatedTimer?: number, updatedStage?: string, updatedSaves?: any) => {
    try {
      const stateToSave = {
        operativeName,
        checkpointSaves: updatedSaves || checkpointSaves,
        timerSeconds: updatedTimer !== undefined ? updatedTimer : timerSeconds,
        stage: updatedStage || stage,
        activeChannel,
        activeCardId,
        activeCheckpointId
      };
      localStorage.setItem("biology_tactical_bootcamp_state", JSON.stringify(stateToSave));
    } catch (err) {}
  };

  // Timer loop
  useEffect(() => {
    if (stage !== "play") return;
    
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStage("completed");
          return 0;
        }
        const nextTime = prev - 1;
        // Periodic check caching
        if (nextTime % 5 === 0) {
          triggerCacheSave(nextTime);
        }
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stage, operativeName, checkpointSaves, activeChannel, activeCardId, activeCheckpointId]);

  // Handle soundtrack toggle
  const handleToggleMute = () => {
    const nextMute = soundManager.toggleMute();
    setIsMuted(nextMute);
  };

  // Start sequence trigger
  const handleStartCommand = (name: string) => {
    setOperativeName(name);
    setTimerSeconds(3600);
    setStage("play");
    setActiveChannel("datacards");
    setActiveCardId(1);
    setActiveCheckpointId("alpha");
    
    // Initialize sound and hum
    soundManager.setMute(false);
    setIsMuted(false);
    soundManager.startAmbientHum();
    soundManager.playSuccess();

    // Cache initial play state
    try {
      localStorage.setItem("biology_tactical_bootcamp_state", JSON.stringify({
        operativeName: name,
        checkpointSaves: {
          alpha: { coreUnlocked: false, tacticalUnlocked: false, masteryUnlocked: false, completed: false },
          bravo: { coreUnlocked: false, tacticalUnlocked: false, masteryUnlocked: false, completed: false },
          charlie: { coreUnlocked: false, tacticalUnlocked: false, masteryUnlocked: false, completed: false },
          delta: { coreUnlocked: false, tacticalUnlocked: false, masteryUnlocked: false, completed: false }
        },
        timerSeconds: 3600,
        stage: "play",
        activeChannel: "datacards",
        activeCardId: 1,
        activeCheckpointId: "alpha"
      }));
    } catch (e) {}
  };

  // Reset/Restart triggers
  const handleRestartBootcamp = () => {
    // Reset saves and return to cover
    const freshSaves = {
      alpha: { coreUnlocked: false, tacticalUnlocked: false, masteryUnlocked: false, completed: false },
      bravo: { coreUnlocked: false, tacticalUnlocked: false, masteryUnlocked: false, completed: false },
      charlie: { coreUnlocked: false, tacticalUnlocked: false, masteryUnlocked: false, completed: false },
      delta: { coreUnlocked: false, tacticalUnlocked: false, masteryUnlocked: false, completed: false }
    };
    setCheckpointSaves(freshSaves);
    setStage("briefing");
    setTimerSeconds(3600);
    soundManager.stopAmbientHum();
    try {
      localStorage.removeItem("biology_tactical_bootcamp_state");
    } catch (e) {}
  };

  // Extraction trigger
  const handleExtractionSuccess = () => {
    setStage("completed");
    triggerCacheSave(timerSeconds, "completed");
  };

  // Human readable countdown timer strings: 60:00:00
  const getTimerString = () => {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    const formattedSecs = secs < 10 ? `0${secs}` : secs;
    return `${formattedMins}:${formattedSecs}:00`;
  };

  // Calculate elapsed session time for debriefing
  const getTimeElapsedString = () => {
    const baseTotal = 3600;
    const elapsed = baseTotal - timerSeconds;
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return `${mins} minutes and ${secs} seconds`;
  };

  // Evaluate locked conditions
  const isCheckpointUnlocked = (id: string) => {
    if (id === "alpha") return true; // Alpha is always free
    if (id === "bravo") return checkpointSaves.alpha.completed;
    if (id === "charlie") return checkpointSaves.bravo.completed;
    if (id === "delta") return checkpointSaves.charlie.completed;
    return false;
  };

  const isExtractionUnlocked = () => {
    return checkpointSaves.delta.completed;
  };

  const activeCheckpoint = CHECKPOINTS.find((c) => c.id === activeCheckpointId) || CHECKPOINTS[0];

  return (
    <div className="min-h-screen immersive-radial text-stone-200 flex flex-col font-serif relative antialiased" id="bootcamp-application-root">
      
      {/* HUD Ambient terminal grid scan filter */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none z-50 opacity-15" />

      {/* Top Nav Header Bar - Screenshot Page 1 Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-md py-4 px-4 sm:px-6 relative z-40" id="tactical-hud-header">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo Brand Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-3 h-3 rounded-full bg-amber-500 immersive-glow-amber animate-pulse" />
            <div>
              <h1 className="text-xs font-sans font-bold tracking-[0.3em] text-stone-300 uppercase leading-none">
                OPERATION MICRO-HUD
              </h1>
              <p className="text-[9px] font-sans text-stone-500 uppercase tracking-[0.2em] mt-1.5">
                OBSERVATION POST // CELL MATRIX SECURE LINK
              </p>
            </div>
          </div>

          {/* Real-time Ticking Countdown (Screenshot Page 1 Top right) */}
          {stage === "play" && (
            <div className="flex items-center space-x-6" id="header-interactive-dashboard">
              {/* Countdown panel */}
              <div className="bg-black/35 border border-white/5 px-4 h-10 flex flex-col justify-center rounded text-right immersive-shadow-inner">
                <span className="text-[8px] font-sans text-amber-500/80 block tracking-[0.2em] uppercase font-bold leading-none mb-0.5">
                  TIME REMAINING
                </span>
                <span className="text-lg font-mono text-white tracking-[0.2em] font-extrabold leading-none animate-pulse">
                  {getTimerString()}
                </span>
              </div>

              {/* Callsign profile */}
              <div className="hidden sm:block text-right text-[10px] font-sans tracking-[0.1em]">
                <span className="text-stone-500 block">IDENTITY CODES:</span>
                <span className="text-stone-300 font-bold uppercase">{operativeName}</span>
              </div>
            </div>
          )}

          {/* Sound, Restart and Menu helpers */}
          <div className="flex items-center space-x-2.5">
            {/* Soundtrack hum slider toggle */}
            <button
              onClick={handleToggleMute}
              id="btn-toggle-hud-sounds"
              title="Toggle retro cyber soundscape"
              className={`px-3.5 py-1.5 rounded border text-[9px] font-sans uppercase tracking-[0.15em] transition cursor-pointer ${
                isMuted
                  ? "bg-stone-900 border-stone-800 text-stone-500 hover:text-stone-300"
                  : "bg-amber-600/10 border-amber-500/30 text-amber-400 immersive-glow-amber"
              }`}
            >
              {isMuted ? "🔇 HUD AUDIO OFF" : "🔊 HUD AUDIO ACTIVE"}
            </button>

            {stage === "play" && (
              <button
                onClick={handleRestartBootcamp}
                id="btn-abort-hud"
                className="px-3 py-1.5 border border-red-950/40 bg-red-950/15 text-red-550 hover:bg-red-900/30 rounded text-[9px] font-sans tracking-[0.15em] hover:text-red-400 font-bold uppercase transition"
              >
                ABORT SEQUENCE
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Container Stage Body */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 relative z-30" id="bootcamp-viewport">
        {stage === "briefing" ? (
          <DossierBriefing onStartCommand={handleStartCommand} />
        ) : stage === "completed" ? (
          <DebriefingView 
            onRestart={handleRestartBootcamp} 
            operativeName={operativeName} 
            timeTakenStr={getTimeElapsedString()} 
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start" id="active-gameplay-layout">
            
            {/* LEFT COLUMN: Sidebar Navigation Controller */}
            <div className="xl:col-span-3 space-y-6" id="hud-sidebar-navigation">
              
              {/* Category switches (Play Data Cards vs Checkpoints locks) */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded border border-white/5" id="switch-channels">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setActiveChannel("datacards");
                  }}
                  id="btn-channel-datacards"
                  className={`py-2 text-[10px] font-sans rounded font-bold uppercase tracking-[0.15em] transition cursor-pointer ${
                    activeChannel === "datacards"
                      ? "bg-amber-500 text-black font-extrabold immersive-glow-amber"
                      : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
                  }`}
                >
                  📝 Read dossier
                </button>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setActiveChannel("checkpoints");
                  }}
                  id="btn-channel-checkpoints"
                  className={`py-2 text-[10px] font-sans rounded font-bold uppercase tracking-[0.15em] transition cursor-pointer ${
                    activeChannel === "checkpoints"
                      ? "bg-amber-500 text-black font-extrabold immersive-glow-amber"
                      : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
                  }`}
                >
                  🔐 DECRYPT LOCKS
                </button>
              </div>

              {/* Data Cards dossier navigation roster */}
              {activeChannel === "datacards" && (
                <div className="space-y-2 bg-black/20 border border-white/5 p-4 rounded-xl" id="datacards-list-scroller">
                  <span className="block text-[10px] font-sans text-amber-500/80 font-bold uppercase tracking-[0.2em] px-1 mb-2">
                    CLASSIFIED DATA SHEETS
                  </span>
                  
                  {DATA_CARDS.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => {
                        soundManager.playClick();
                        setActiveCardId(card.id);
                      }}
                      id={`btn-card-sidebar-${card.id}`}
                      className={`w-full p-3 rounded border transition flex items-center justify-between text-left cursor-pointer ${
                        activeCardId === card.id
                          ? "bg-stone-900 border-amber-500/30 text-amber-500 font-bold shadow-inner"
                          : "bg-zinc-950/20 border-zinc-900/60 text-stone-400 hover:border-stone-800 hover:text-stone-200"
                      }`}
                    >
                      <div>
                        <span className="text-[9px] block text-stone-500 uppercase tracking-widest font-sans font-semibold">DATA CARD 0{card.id}</span>
                        <span className="block mt-0.5 tracking-tight font-serif text-xs truncate max-w-[170px] uppercase font-semibold text-stone-200">
                          {card.title}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-stone-500 whitespace-nowrap">
                        {card.timeTarget}
                      </span>
                    </button>
                  ))}
                  
                  {/* final extra path toggle */}
                  <button
                    onClick={() => {
                      if (isExtractionUnlocked()) {
                        soundManager.playClick();
                        setActiveChannel("extraction");
                      } else {
                        soundManager.playFailure();
                      }
                    }}
                    id="btn-sidebar-final"
                    className={`w-full p-3 rounded font-sans text-[10px] uppercase tracking-[0.15em] border transition font-black text-center ${
                      isExtractionUnlocked()
                        ? activeChannel === "extraction"
                          ? "bg-red-950/30 border-red-900/50 text-red-500"
                          : "bg-amber-600/20 text-amber-500 border-amber-600/30 animate-pulse cursor-pointer"
                        : "bg-stone-950/50 border-dashed border-stone-900 text-stone-600 cursor-not-allowed"
                    }`}
                  >
                    {isExtractionUnlocked() ? "📡 INITIATE FINAL EXTRACTION" : "🔒 LEVEL 5 EXTRACTION LOCKED"}
                  </button>
                </div>
              )}

              {/* Checkpoints decryption bay navigation roster */}
              {activeChannel === "checkpoints" && (
                <div className="space-y-2 bg-black/20 border border-white/5 p-4 rounded-xl" id="checkpoints-list-scroller">
                  <span className="block text-[10px] font-sans text-amber-500/80 font-bold uppercase tracking-[0.2em] px-1 mb-2">
                    TACTICAL LOCK SECURE BAYS
                  </span>

                  {CHECKPOINTS.map((cp) => {
                    const isUnlocked = isCheckpointUnlocked(cp.id);
                    const saves = checkpointSaves[cp.id] || { completed: false };

                    return (
                      <button
                        key={cp.id}
                        disabled={!isUnlocked}
                        onClick={() => {
                          if (isUnlocked) {
                            soundManager.playClick();
                            setActiveCheckpointId(cp.id);
                          }
                        }}
                        id={`btn-checkpoint-sidebar-${cp.id}`}
                        className={`w-full p-3 rounded text-left border transition ${
                          !isUnlocked
                            ? "bg-stone-950/50 border-stone-900 text-stone-600/80 cursor-not-allowed"
                            : activeCheckpointId === cp.id
                            ? "bg-stone-900 border-amber-500/30 text-amber-500 font-bold shadow-inner"
                            : "bg-zinc-950/20 border-zinc-900/60 text-stone-400 hover:border-stone-800 hover:text-stone-200 cursor-pointer"
                        }`}
                      >
                        <div className="flex justify-between items-center font-sans tracking-wide">
                          <span className="text-[10px] uppercase font-bold text-stone-200">{cp.title}</span>
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                            saves.completed ? "bg-green-500/20 text-green-400 border border-green-500/25" : isUnlocked ? "bg-red-500/10 text-red-400 border border-red-500/25 animate-pulse" : "bg-stone-900 text-stone-500 border border-stone-850"
                          }`}>
                            {saves.completed ? "SECURED" : isUnlocked ? "ACTIVE" : "LOCKED"}
                          </span>
                        </div>

                        <span className="block mt-1 tracking-tight text-xs capitalize text-stone-400 font-serif">
                          {cp.id === "alpha" ? "Microscopy check" : cp.id === "bravo" ? "Cell Matrix check" : cp.id === "charlie" ? "Diffusion dynamics" : "Genetic adaptation"}
                        </span>
                      </button>
                    );
                  })}
                  
                  {/* final extra path toggle duplicate */}
                  <button
                    onClick={() => {
                      if (isExtractionUnlocked()) {
                        soundManager.playClick();
                        setActiveChannel("extraction");
                      } else {
                        soundManager.playFailure();
                      }
                    }}
                    id="btn-sidebar-final-2"
                    className={`w-full p-3 rounded font-sans text-[10px] uppercase tracking-[0.15em] border transition font-black text-center mt-2 ${
                      isExtractionUnlocked()
                        ? activeChannel === "extraction"
                          ? "bg-red-950/30 border-red-900/50 text-red-500"
                          : "bg-amber-600/20 text-amber-500 border-amber-600/30 animate-pulse cursor-pointer"
                        : "bg-stone-950/50 border-dashed border-stone-900 text-stone-600 cursor-not-allowed"
                    }`}
                  >
                    {isExtractionUnlocked() ? "📡 INITIATE FINAL EXTRACTION" : "🔒 LEVEL 5 EXTRACTION LOCKED"}
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Real-time interactive focus module screen */}
            <div className="xl:col-span-9" id="active-viewport-content-panel">
              {activeChannel === "datacards" && (
                <div id="datacards-router-outlet">
                  {activeCardId === 1 && <MicroscopeViewer />}
                  {activeCardId === 2 && <MagnificationCalculator />}
                  {activeCardId === 3 && <AnimalCellModel />}
                  {activeCardId === 4 && <TargetMatrix />}
                  {activeCardId === 5 && <DiffusionDynamics />}
                  {activeCardId === 6 && <RogueAgents />}
                  {activeCardId === 7 && <SpecialForces />}
                  {activeCardId === 8 && <SpecialForces />}
                </div>
              )}

              {activeChannel === "checkpoints" && (
                <div id="checkpoints-router-outlet">
                  <CheckpointLockView
                    checkpoint={activeCheckpoint}
                    onCompleted={() => {
                      // Trigger saving state and potential side checks
                      triggerCacheSave();
                    }}
                    savedState={checkpointSaves}
                    setSavedState={(val: any) => {
                      setCheckpointSaves(val);
                      triggerCacheSave(undefined, undefined, typeof val === 'function' ? val(checkpointSaves) : val);
                    }}
                  />
                </div>
              )}

              {activeChannel === "extraction" && (
                <div id="extraction-router-outlet">
                  <FinalExtraction onExtractionComplete={handleExtractionSuccess} />
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      {/* Persistent footer label */}
      <footer className="py-4 border-t border-slate-900 text-center font-mono text-[9px] text-slate-600 bg-slate-950/20 relative z-20" id="bootcamp-footer">
        SECURITY HANDSHAKE INTAKE APPARATUS: ACTIVE DIODE STREAM // CRAFTED UNDER USC SPECIFICATIONS CODES.
      </footer>
    </div>
  );
}
