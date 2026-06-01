/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CheckpointLock } from "../types";
import { soundManager } from "../lib/sounds";

interface CheckpointLockViewProps {
  checkpoint: CheckpointLock;
  onCompleted: () => void;
  savedState: any;
  setSavedState: React.Dispatch<React.SetStateAction<any>>;
}

export default function CheckpointLockView({
  checkpoint,
  onCompleted,
  savedState,
  setSavedState
}: CheckpointLockViewProps) {
  const currentKey = checkpoint.id;
  const currentLockState = savedState[currentKey] || {
    coreUnlocked: false,
    tacticalUnlocked: false,
    masteryUnlocked: false,
    completed: false
  };

  // Inputs state
  const [coreText, setCoreText] = useState("");
  const [coreLoading, setCoreLoading] = useState(false);
  const [coreFeedback, setCoreFeedback] = useState("");

  // Checkpoint Alpha Custom States
  const [alphaTacEye, setAlphaTacEye] = useState("");
  const [alphaTacObj, setAlphaTacObj] = useState("");
  const [alphaTacTotal, setAlphaTacTotal] = useState("");
  const [alphaTacLoading, setAlphaTacLoading] = useState(false);
  const [alphaTacFeedback, setAlphaTacFeedback] = useState("");

  const [alphaMastSize, setAlphaMastSize] = useState("");
  const [alphaMastFinal, setAlphaMastFinal] = useState("");
  const [alphaMastLoading, setAlphaMastLoading] = useState(false);
  const [alphaMastFeedback, setAlphaMastFeedback] = useState("");

  // Checkpoint Bravo Custom States
  const [bravoCoreChecked, setBravoCoreChecked] = useState<string[]>([]);
  const [bravoCoreSupport, setBravoCoreSupport] = useState("");
  const [bravoTacSelected, setBravoTacSelected] = useState("");
  const [bravoTacFeedback, setBravoTacFeedback] = useState("");
  
  const [bravoMastText, setBravoMastText] = useState("");
  const [bravoMastLoading, setBravoMastLoading] = useState(false);
  const [bravoMastFeedback, setBravoMastFeedback] = useState("");

  // Checkpoint Charlie Custom States
  const [charlieCoreText, setCharlieCoreText] = useState("");
  const [charlieCoreLoading, setCharlieCoreLoading] = useState(false);
  const [charlieCoreFeedback, setCharlieCoreFeedback] = useState("");

  const [charlieTacText, setCharlieTacText] = useState("");
  const [charlieTacLoading, setCharlieTacLoading] = useState(false);
  const [charlieTacFeedback, setCharlieTacFeedback] = useState("");

  const [charlieMastText, setCharlieMastText] = useState("");
  const [charlieMastLoading, setCharlieMastLoading] = useState(false);
  const [charlieMastFeedback, setCharlieMastFeedback] = useState("");

  // Checkpoint Delta Custom States
  const [deltaCoreText, setDeltaCoreText] = useState("");
  const [deltaCoreLoading, setDeltaCoreLoading] = useState(false);
  const [deltaCoreFeedback, setDeltaCoreFeedback] = useState("");

  const [deltaTacText, setDeltaTacText] = useState("");
  const [deltaTacLoading, setDeltaTacLoading] = useState(false);
  const [deltaTacFeedback, setDeltaTacFeedback] = useState("");

  const [deltaMastText, setDeltaMastText] = useState("");
  const [deltaMastLoading, setDeltaMastLoading] = useState(false);
  const [deltaMastFeedback, setDeltaMastFeedback] = useState("");

  const keypadTap = () => {
    soundManager.keypadTap();
  };

  // Central trigger to update locks
  const updateLock = (lockField: "coreUnlocked" | "tacticalUnlocked" | "masteryUnlocked", isUnlocked: boolean) => {
    const freshVal = {
      ...currentLockState,
      [lockField]: isUnlocked
    };
    
    // Check if entire checkpoint is cleared
    const allCleared = freshVal.coreUnlocked && freshVal.tacticalUnlocked && freshVal.masteryUnlocked;
    freshVal.completed = allCleared;

    setSavedState((prev: any) => ({
      ...prev,
      [currentKey]: freshVal
    }));

    if (allCleared) {
      soundManager.playFinalCompletion();
      onCompleted();
    }
  };

  // Handler for text validations via Gemini/local
  const evaluateTextLock = async (
    lockField: "coreUnlocked" | "masteryUnlocked" | "tacticalUnlocked",
    textInput: string,
    questionContext: string,
    setLoading: (l: boolean) => void,
    setFeedback: (f: string) => void
  ) => {
    if (!textInput.trim()) {
      soundManager.playFailure();
      setFeedback("ERROR: OPERATIVE INPUT LOG EMPTY. ENTER ANALYSIS TO INITIATE DECRYPTION ROUTINE.");
      return;
    }

    setLoading(true);
    setFeedback("DECRYPTING DATA STREAMS... PARSING BIOLOGICAL HOMOLOGY CODES...");
    keypadTap();

    try {
      const resp = await fetch("/api/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkpointId: currentKey,
          lockId: lockField === "coreUnlocked" ? "core" : lockField === "masteryUnlocked" ? "mastery" : "tactical",
          question: questionContext,
          userAnswer: textInput
        })
      });

      const result = await resp.json();
      setLoading(false);

      if (result.isCorrect) {
        soundManager.playSuccess();
        setFeedback(result.feedback);
        updateLock(lockField, true);
      } else {
        soundManager.playFailure();
        setFeedback(result.feedback || "DECRYPTION FAILED: Bio-intel does not satisfy cell command parameters.");
      }
    } catch (e) {
      setLoading(false);
      soundManager.playFailure();
      setFeedback("ERROR: System parsing failure. Server offline. Retry encryption.");
    }
  };

  // CHECKPOINT ALPHA SUBMISSIONS
  const handleAlphaCoreSubmit = () => {
    evaluateTextLock(
      "coreUnlocked",
      coreText,
      checkpoint.core.description,
      setCoreLoading,
      setCoreFeedback
    );
  };

  const handleAlphaTacSubmit = () => {
    keypadTap();
    setAlphaTacLoading(true);
    // Eyepiece = 5, Objective = 40, Total = 200 (or with 'x' / 'x200')
    const correctEye = alphaTacEye.toLowerCase().trim() === "5";
    const correctObj = alphaTacObj.toLowerCase().trim() === "40";
    const correctTotal = ["200", "200x", "x200"].includes(alphaTacTotal.toLowerCase().trim());

    setTimeout(() => {
      setAlphaTacLoading(false);
      if (correctEye && correctObj && correctTotal) {
        soundManager.playSuccess();
        setAlphaTacFeedback("DECRYPTION SUCCESSFUL: Magnification index locked. Operational scale factor: ×200.");
        updateLock("tacticalUnlocked", true);
      } else {
        soundManager.playFailure();
        setAlphaTacFeedback("DECRYPTION FAILED: Lens multiplication indices are inaccurate. Check data card 1 & 2 multiplier ratios.");
      }
    }, 800);
  };

  const handleAlphaMastSubmit = () => {
    keypadTap();
    setAlphaMastLoading(true);
    // Image size in mm = 5, Final answer in cm = 0.5
    const eyeSizeOK = ["5", "5mm", "5 mm"].includes(alphaMastSize.toLowerCase().trim());
    const finalOK = ["0.5", "0.5cm", "0.5 cm"].includes(alphaMastFinal.toLowerCase().trim());

    setTimeout(() => {
      setAlphaMastLoading(false);
      if (eyeSizeOK && finalOK) {
        soundManager.playSuccess();
        setAlphaMastFeedback("DECRYPTION SUCCESSFUL: Micromeasurement scales matched. Final converted value congruent at 0.5 centimeters.");
        updateLock("masteryUnlocked", true);
      } else {
        soundManager.playFailure();
        setAlphaMastFeedback("DECRYPTION FAILED: Dimensional conversion error. Recalculate cell size: (0.05 mm * 100) and convert millimeters directly to centimeters.");
      }
    }, 800);
  };

  // CHECKPOINT BRAVO SUBMISSIONS
  const handleBravoCoreSubmit = () => {
    keypadTap();
    setCoreLoading(true);
    
    // Plant exclusivity check: Needs "cell wall", "chloroplasts", "permanent vacuole".
    const hasWall = bravoCoreChecked.includes("wall");
    const hasChloro = bravoCoreChecked.includes("chloro");
    const hasVac = bravoCoreChecked.includes("vacuole");
    const noMito = !bravoCoreChecked.includes("mito");
    const noRib = !bravoCoreChecked.includes("rib");
    
    const rootSupport = bravoCoreSupport.toLowerCase().trim();
    const correctSupport = rootSupport.includes("wall") || rootSupport.includes("cellwall");

    setTimeout(() => {
      setCoreLoading(false);
      if (hasWall && hasChloro && hasVac && noMito && noRib && correctSupport) {
        soundManager.playSuccess();
        setCoreFeedback("DECRYPTION SUCCESSFUL: Plant exclusives authenticated. Cellulose Cell Wall identified as the primary structural vector.");
        updateLock("coreUnlocked", true);
      } else {
        soundManager.playFailure();
        setCoreFeedback("DECRYPTION FAILED: Incorrect plant exclusionary array. Only three organelles listed inside the targeting criteria matrix are exclusive to plants. Uncheck baseline structures.");
      }
    }, 800);
  };

  const toggleBravoCheckbox = (id: string) => {
    keypadTap();
    setBravoCoreChecked((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBravoTacSubmit = () => {
    keypadTap();
    setBravoTacFeedback("DECRYPTING CELL CORES...");
    
    setTimeout(() => {
      if (bravoTacSelected.toLowerCase().trim() === "bacteria") {
        soundManager.playSuccess();
        setBravoTacFeedback("DECRYPTION SUCCESSFUL: Flagellated primitive organism classified. Faction alignment: BACTERIA AGENT.");
        updateLock("tacticalUnlocked", true);
      } else {
        soundManager.playFailure();
        setBravoTacFeedback("DECRYPTION FAILED: Organism classification mismatch. Ribosomal cell lacking mitochondria represents a simpler evolutionary stage.");
      }
    }, 700);
  };

  const handleBravoMastSubmit = () => {
    evaluateTextLock(
      "masteryUnlocked",
      bravoMastText,
      checkpoint.mastery.description,
      setBravoMastLoading,
      setBravoMastFeedback
    );
  };

  // CHECKPOINT CHARLIE SUBMISSIONS
  const handleCharlieCoreSubmit = () => {
    evaluateTextLock(
      "coreUnlocked",
      charlieCoreText,
      checkpoint.core.description,
      setCharlieCoreLoading,
      setCharlieCoreFeedback
    );
  };

  const handleCharlieTacSubmit = () => {
    evaluateTextLock(
      "tacticalUnlocked",
      charlieTacText,
      checkpoint.tactical.description,
      setCharlieTacLoading,
      setCharlieTacFeedback
    );
  };

  const handleCharlieMastSubmit = () => {
    evaluateTextLock(
      "masteryUnlocked",
      charlieMastText,
      checkpoint.mastery.description,
      setCharlieMastLoading,
      setCharlieMastFeedback
    );
  };

  // CHECKPOINT DELTA SUBMISSIONS
  const handleDeltaCoreSubmit = () => {
    evaluateTextLock(
      "coreUnlocked",
      deltaCoreText,
      checkpoint.core.description,
      setDeltaCoreLoading,
      setDeltaCoreFeedback
    );
  };

  const handleDeltaTacSubmit = () => {
    evaluateTextLock(
      "tacticalUnlocked",
      deltaTacText,
      checkpoint.tactical.description,
      setDeltaTacLoading,
      setDeltaTacFeedback
    );
  };

  const handleDeltaMastSubmit = () => {
    evaluateTextLock(
      "masteryUnlocked",
      deltaMastText,
      checkpoint.mastery.description,
      setDeltaMastLoading,
      setDeltaMastFeedback
    );
  };

  return (
    <div className="space-y-6 animate-fade-in" id="checkpoint-lock-root">
      {/* HUD Header */}
      <div className="bg-black/40 border border-white/5 p-4 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 immersive-shadow-inner">
        <div>
          <span className="text-[10px] font-sans text-amber-500 font-bold uppercase tracking-[0.2em]">{checkpoint.title} DECRYPTION BAY</span>
          <h3 className="text-xl font-serif text-stone-100 font-bold mt-1 tracking-tight uppercase">ACTIVE LOCK BARRIERS</h3>
        </div>
        <div className="flex flex-wrap gap-2.5 font-sans text-[9px] uppercase tracking-wider">
          <span className="px-3 py-1.5 bg-red-950/20 border border-red-900/30 text-red-400 font-bold rounded">TIME OUT TARGET: {checkpoint.timeTarget}</span>
          <span className="px-3 py-1.5 bg-zinc-900 border border-white/5 text-amber-400 font-bold rounded immersive-glow-amber animate-pulse">STATUS: DECRYPTION ACTIVE</span>
        </div>
      </div>

      {/* THREE LOCK MODULES (Core, Tactical, Mastery) */}
      <div className="space-y-6" id="checkpoint-cards-lock-stack">
        
        {/* =============== CORE LOCK MODULE =============== */}
        <div 
          className={`border rounded transition-all duration-300 ${
            currentLockState.coreUnlocked 
              ? "border-green-500/40 bg-zinc-950/30 text-stone-200 immersive-glow-green" 
              : "border-white/5 bg-black/35"
          }`}
          id="core-lock-panel"
        >
          {/* Header Bar */}
          <div className="flex justify-between items-center p-4 border-b border-white/5 bg-black/20">
            <div className="flex items-center space-x-2.5">
              <span className="text-base">{currentLockState.coreUnlocked ? "🔓" : "🔐"}</span>
              <span className={`text-xs font-sans font-bold uppercase tracking-widest ${currentLockState.coreUnlocked ? "text-green-400" : "text-stone-400"}`}>
                {checkpoint.core.title} - CRITICAL SCHEMATICS
              </span>
            </div>
            <span className={`text-[10px] font-sans px-2.5 py-1 rounded font-bold uppercase tracking-wider ${
              currentLockState.coreUnlocked ? "bg-green-500/20 text-green-400 border border-green-500/10" : "bg-red-500/10 text-red-400 border border-red-500/10 animate-pulse"
            }`}>
              {currentLockState.coreUnlocked ? "SECURED" : "LOCKED"}
            </span>
          </div>

          <div className="p-5 space-y-4">
            <p className="text-sm text-stone-300 font-serif leading-relaxed">{checkpoint.core.description}</p>

            {/* Custom Interface depending on checkpoint for Core */}
            {currentHook("core", currentLockState.coreUnlocked)}

            {/* General Feedback Area */}
            {coreFeedback && (
              <div className={`p-4 rounded font-sans text-[10px] uppercase tracking-wider border border-dashed ${
                currentLockState.coreUnlocked ? "bg-green-950/20 border-green-500/30 text-green-400" : "bg-amber-600/5 border-amber-500/30 text-amber-400"
              }`}>
                {coreFeedback}
              </div>
            )}
          </div>
        </div>

        {/* =============== TACTICAL LOCK MODULE =============== */}
        <div 
          className={`border rounded transition-all duration-300 ${
            currentLockState.tacticalUnlocked 
              ? "border-green-500/40 bg-zinc-950/30 text-stone-200 immersive-glow-green" 
              : "border-white/5 bg-black/35"
          }`}
          id="tactical-lock-panel"
        >
          {/* Header Bar */}
          <div className="flex justify-between items-center p-4 border-b border-white/5 bg-black/20">
            <div className="flex items-center space-x-2.5">
              <span className="text-base">{currentLockState.tacticalUnlocked ? "🔓" : "🔐"}</span>
              <span className={`text-xs font-sans font-bold uppercase tracking-widest ${currentLockState.tacticalUnlocked ? "text-green-400" : "text-stone-400"}`}>
                {checkpoint.tactical.title} - METRIC INTEGRITY
              </span>
            </div>
            <span className={`text-[10px] font-sans px-2.5 py-1 rounded font-bold uppercase tracking-wider ${
              currentLockState.tacticalUnlocked ? "bg-green-500/20 text-green-400 border border-green-500/10" : "bg-red-500/10 text-red-400 border border-red-500/10 animate-pulse"
            }`}>
              {currentLockState.tacticalUnlocked ? "SECURED" : "LOCKED"}
            </span>
          </div>

          <div className="p-5 space-y-4">
            <p className="text-sm text-stone-300 font-serif leading-relaxed">{checkpoint.tactical.description}</p>

            {/* Custom Interface depending on checkpoint for Tactical */}
            {currentHook("tactical", currentLockState.tacticalUnlocked)}

            {/* General Feedback Area */}
            {alphaTacFeedback && currentKey === "alpha" && (
              <div className="p-4 bg-black/30 rounded text-[10px] tracking-wider uppercase font-sans border border-white/5 text-stone-300">
                {alphaTacFeedback}
              </div>
            )}
            {bravoTacFeedback && currentKey === "bravo" && (
              <div className="p-4 bg-black/30 rounded text-[10px] tracking-wider uppercase font-sans border border-white/5 text-stone-300">
                {bravoTacFeedback}
              </div>
            )}
            {charlieTacFeedback && currentKey === "charlie" && (
              <div className="p-4 bg-black/30 rounded text-[10px] tracking-wider uppercase font-sans border border-white/5 text-stone-300">
                {charlieTacFeedback}
              </div>
            )}
            {deltaTacFeedback && currentKey === "delta" && (
              <div className="p-4 bg-black/30 rounded text-[10px] tracking-wider uppercase font-sans border border-white/5 text-stone-300">
                {deltaTacFeedback}
              </div>
            )}
          </div>
        </div>

        {/* =============== MASTERY LOCK MODULE =============== */}
        <div 
          className={`border rounded transition-all duration-300 ${
            currentLockState.masteryUnlocked 
              ? "border-green-500/40 bg-zinc-950/30 text-stone-200 immersive-glow-green" 
              : "border-white/5 bg-black/35"
          }`}
          id="mastery-lock-panel"
        >
          {/* Header Bar */}
          <div className="flex justify-between items-center p-4 border-b border-white/5 bg-black/20">
            <div className="flex items-center space-x-2.5">
              <span className="text-base">{currentLockState.masteryUnlocked ? "🔓" : "🔐"}</span>
              <span className={`text-xs font-sans font-bold uppercase tracking-widest ${currentLockState.masteryUnlocked ? "text-green-400" : "text-stone-400"}`}>
                {checkpoint.mastery.title} - HIGHER COGNITION
              </span>
            </div>
            <span className={`text-[10px] font-sans px-2.5 py-1 rounded font-bold uppercase tracking-wider ${
              currentLockState.masteryUnlocked ? "bg-green-500/20 text-green-400 border border-green-500/10" : "bg-red-500/10 text-red-400 border border-red-500/10 animate-pulse"
            }`}>
              {currentLockState.masteryUnlocked ? "SECURED" : "LOCKED"}
            </span>
          </div>

          <div className="p-5 space-y-4">
            <p className="text-sm text-stone-300 font-serif leading-relaxed">{checkpoint.mastery.description}</p>

            {/* Custom Interface depending on checkpoint for Mastery */}
            {currentHook("mastery", currentLockState.masteryUnlocked)}

            {/* General Feedback Area */}
            {alphaMastFeedback && currentKey === "alpha" && (
              <div className="p-4 bg-black/30 rounded text-[10px] tracking-wider uppercase font-sans border border-white/5 text-stone-300">
                {alphaMastFeedback}
              </div>
            )}
            {bravoMastFeedback && currentKey === "bravo" && (
              <div className="p-4 bg-black/30 rounded text-[10px] tracking-wider uppercase font-sans border border-white/5 text-stone-300">
                {bravoMastFeedback}
              </div>
            )}
            {charlieMastFeedback && currentKey === "charlie" && (
              <div className="p-4 bg-black/30 rounded text-[10px] tracking-wider uppercase font-sans border border-white/5 text-stone-300">
                {charlieMastFeedback}
              </div>
            )}
            {deltaMastFeedback && currentKey === "delta" && (
              <div className="p-4 bg-black/30 rounded text-[10px] tracking-wider uppercase font-sans border border-white/5 text-stone-300">
                {deltaMastFeedback}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );

  // Selector dynamic structural rendering hook depending on index configuration
  function currentHook(lockType: "core" | "tactical" | "mastery", unlocked: boolean) {
    if (unlocked) {
      return (
        <div className="p-4 text-center border-2 border-green-500/40 bg-green-500/10 rounded-xl flex items-center justify-center space-x-2.5 font-mono text-xs text-green-400 uppercase font-black">
          <span>✔ ACCESS GRANTED: LOGICAL BOUNDARIES OF CELLULAR BIOLOGY SATISFIED.</span>
        </div>
      );
    }

    if (currentKey === "alpha") {
      if (lockType === "core") {
        return (
          <div className="space-y-3">
            <textarea
              value={coreText}
              onChange={(e) => setCoreText(e.target.value)}
              id="alpha-core-textarea"
              placeholder={checkpoint.core.placeholder}
              rows={3}
              className="w-full text-xs font-mono p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 outline-none text-slate-200"
            />
            <button
              onClick={handleAlphaCoreSubmit}
              id="alpha-core-btn-decrypt"
              disabled={coreLoading}
              className="py-2.5 px-6 font-mono text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 font-bold rounded cursor-pointer transition uppercase"
            >
              {coreLoading ? "DECRYPTING..." : "⚡ RUN DECRYPTION DEPOSIT"}
            </button>
          </div>
        );
      }
      if (lockType === "tactical") {
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center space-x-3 text-xs font-mono text-slate-400" id="alpha-tac-inputs">
              <input
                type="text"
                placeholder="EYEPIECE"
                value={alphaTacEye}
                onChange={(e) => setAlphaTacEye(e.target.value)}
                id="alpha-tac-eye-input"
                className="w-24 text-center p-2 rounded bg-slate-950 border border-slate-800 text-slate-200"
              />
              <span>×</span>
              <input
                type="text"
                placeholder="OBJECTIVE"
                value={alphaTacObj}
                onChange={(e) => setAlphaTacObj(e.target.value)}
                id="alpha-tac-obj-input"
                className="w-28 text-center p-2 rounded bg-slate-950 border border-slate-800 text-slate-200"
              />
              <span>= TOTAL =</span>
              <input
                type="text"
                placeholder="TOTAL POWER"
                value={alphaTacTotal}
                onChange={(e) => setAlphaTacTotal(e.target.value)}
                id="alpha-tac-total-input"
                className="w-28 text-center p-2 rounded bg-slate-950 border border-slate-800 text-slate-200 font-bold text-cyan-300"
              />
            </div>
            <button
              onClick={handleAlphaTacSubmit}
              id="alpha-tac-btn"
              disabled={alphaTacLoading}
              className="py-2 px-5 font-mono text-xs bg-orange-400 hover:bg-orange-300 text-slate-950 font-bold rounded cursor-pointer transition"
            >
              {alphaTacLoading ? "DECRYPTING..." : "⚡ VALIDATE SCALES"}
            </button>
          </div>
        );
      }
      if (lockType === "mastery") {
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono" id="alpha-mast-inputs">
              <div>
                <span className="block text-slate-400 mb-1">IMAGE SIZE (mm):</span>
                <input
                  type="text"
                  placeholder="e.g. 5"
                  value={alphaMastSize}
                  onChange={(e) => setAlphaMastSize(e.target.value)}
                  id="alpha-mast-size-input"
                  className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-slate-200"
                />
              </div>
              <div>
                <span className="block text-slate-400 mb-1">FINAL ANSWER (cm):</span>
                <input
                  type="text"
                  placeholder="e.g. 0.5"
                  value={alphaMastFinal}
                  onChange={(e) => setAlphaMastFinal(e.target.value)}
                  id="alpha-mast-final-input"
                  className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-slate-200 font-bold text-cyan-300"
                />
              </div>
            </div>
            <button
              onClick={handleAlphaMastSubmit}
              id="alpha-mast-btn"
              disabled={alphaMastLoading}
              className="py-2.5 px-6 font-mono text-xs bg-green-400 hover:bg-green-300 text-slate-950 font-bold rounded cursor-pointer transition uppercase"
            >
              {alphaMastLoading ? "DECRYPTING..." : "⚡ RUN MATHEMATICAL VERIFICATION"}
            </button>
          </div>
        );
      }
    }

    if (currentKey === "bravo") {
      if (lockType === "core") {
        const options = [
          { id: "wall", label: "Cell Wall (Rigid cellulose support sheath)" },
          { id: "chloro", label: "Chloroplasts (Photosynthetic chlorophyll solar factories)" },
          { id: "vacuole", label: "Permanent Vacuole (Concentrated cell sap store)" },
          { id: "mito", label: "Mitochondria Double-Membranes" },
          { id: "rib", label: "Ribosomes Translation Units" }
        ];
        return (
          <div className="space-y-4">
            <div>
              <span className="block font-mono text-[10px] text-cyan-400 uppercase font-semibold mb-2">Check exactly three plant-exclusive organelles:</span>
              <div className="space-y-1.5" id="bravo-core-checkboxes">
                {options.map((opt) => (
                  <label key={opt.id} className="flex items-center space-x-2.5 font-mono text-xs cursor-pointer text-slate-350 hover:text-slate-100">
                    <input
                      type="checkbox"
                      checked={bravoCoreChecked.includes(opt.id)}
                      onChange={() => toggleBravoCheckbox(opt.id)}
                      id={`bravo-core-opt-${opt.id}`}
                      className="accent-cyan-500 rounded cursor-pointer"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <span className="block font-mono text-[10px] text-cyan-400 uppercase font-semibold mb-1">Which of these provides rigid support?</span>
              <input
                type="text"
                placeholder="e.g. Cell Wall"
                value={bravoCoreSupport}
                onChange={(e) => setBravoCoreSupport(e.target.value)}
                id="bravo-core-support-input"
                className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono"
              />
            </div>

            <button
              onClick={handleBravoCoreSubmit}
              id="bravo-core-btn"
              disabled={coreLoading}
              className="py-2 px-5 font-mono text-xs bg-cyan-400 text-slate-950 font-bold rounded hover:bg-cyan-300 tracking-wider uppercase cursor-pointer"
            >
              {coreLoading ? "AUTHENTICATING..." : "⚡ SUBMIT MATRICES DATA"}
            </button>
          </div>
        );
      }
      if (lockType === "tactical") {
        return (
          <div className="space-y-4">
            <span className="block font-mono text-[10px] text-orange-400 uppercase font-semibold mb-2">Select Cell Faction Classification:</span>
            <div className="grid grid-cols-3 gap-3" id="bravo-tac-radio-group">
              {["Animal", "Plant", "Bacteria"].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    keypadTap();
                    setBravoTacSelected(f);
                  }}
                  id={`btn-faction-bravo-${f}`}
                  className={`py-3 rounded-lg border text-center font-mono text-xs uppercase cursor-pointer transition ${
                    bravoTacSelected === f
                      ? "border-orange-500 bg-orange-950/20 text-orange-400 font-bold"
                      : "bg-slate-950/40 border-slate-805 border-slate-800 text-slate-500 hover:border-slate-700"
                  }`}
                >
                  {f} Faction
                </button>
              ))}
            </div>
            <button
              onClick={handleBravoTacSubmit}
              id="bravo-tac-btn"
              disabled={!bravoTacSelected}
              className="py-2.5 px-6 font-mono text-xs bg-orange-400 hover:bg-orange-300 text-slate-950 font-bold rounded cursor-pointer transition uppercase"
            >
              ⚡ LOCK DECRYPTION CODE
            </button>
          </div>
        );
      }
      if (lockType === "mastery") {
        return (
          <div className="space-y-3">
            <textarea
              value={bravoMastText}
              onChange={(e) => setBravoMastText(e.target.value)}
              id="bravo-mast-textarea"
              placeholder={checkpoint.mastery.placeholder}
              rows={3}
              className="w-full text-xs font-mono p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 outline-none text-slate-200"
            />
            <button
              onClick={handleBravoMastSubmit}
              id="bravo-mast-btn-decrypt"
              disabled={bravoMastLoading}
              className="py-2.5 px-6 font-mono text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 font-bold rounded cursor-pointer transition uppercase"
            >
              {bravoMastLoading ? "DECRYPTING..." : "⚡ DECRYPT BIOLOGICAL CORES"}
            </button>
          </div>
        );
      }
    }

    if (currentKey === "charlie") {
      const isCore = lockType === "core";
      const isTac = lockType === "tactical";
      const val = isCore ? charlieCoreText : isTac ? charlieTacText : charlieMastText;
      const setVal = isCore ? setCharlieCoreText : isTac ? setCharlieTacText : setCharlieMastText;
      const load = isCore ? charlieCoreLoading : isTac ? charlieTacLoading : charlieMastLoading;
      const setLoad = isCore ? setCharlieCoreLoading : isTac ? setCharlieTacLoading : setCharlieMastLoading;
      const feed = isCore ? charlieCoreFeedback : isTac ? charlieTacFeedback : charlieMastFeedback;
      const setFeed = isCore ? setCharlieCoreFeedback : isTac ? setCharlieTacFeedback : setCharlieMastFeedback;
      const qText = isCore ? checkpoint.core.description : isTac ? checkpoint.tactical.description : checkpoint.mastery.description;

      return (
        <div className="space-y-3">
          <textarea
            value={val}
            onChange={(e) => setVal(e.target.value)}
            id={`charlie-${lockType}-textarea`}
            placeholder={isCore ? checkpoint.core.placeholder : isTac ? "Describe thermal kinetic impacts..." : checkpoint.mastery.placeholder}
            rows={3}
            className="w-full text-xs font-mono p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 outline-none text-slate-200"
          />
          <button
            onClick={() => evaluateTextLock(
              lockType === "core" ? "coreUnlocked" : lockType === "tactical" ? "tacticalUnlocked" : "masteryUnlocked",
              val,
              qText,
              setLoad,
              setFeed
            )}
            id={`charlie-${lockType}-btn`}
            disabled={load}
            className="py-2.5 px-6 font-mono text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 font-bold rounded cursor-pointer transition uppercase"
          >
            {load ? "DECRYPTING..." : "⚡ RUN INTEL PARSING ROUTINE"}
          </button>
          {feed && (
            <div className="p-3 bg-slate-900/40 rounded border border-slate-800 text-[11px] font-mono text-slate-300 uppercase">
              {feed}
            </div>
          )}
        </div>
      );
    }

    if (currentKey === "delta") {
      const isCore = lockType === "core";
      const isTac = lockType === "tactical";
      const val = isCore ? deltaCoreText : isTac ? deltaTacText : deltaMastText;
      const setVal = isCore ? setDeltaCoreText : isTac ? setDeltaTacText : setDeltaMastText;
      const load = isCore ? deltaCoreLoading : isTac ? deltaTacLoading : deltaMastLoading;
      const setLoad = isCore ? setDeltaCoreLoading : isTac ? setDeltaTacLoading : setDeltaMastLoading;
      const feed = isCore ? deltaCoreFeedback : isTac ? deltaTacFeedback : deltaMastFeedback;
      const setFeed = isCore ? setDeltaCoreFeedback : isTac ? setDeltaTacFeedback : setDeltaMastFeedback;
      const qText = isCore ? checkpoint.core.description : isTac ? checkpoint.tactical.description : checkpoint.mastery.description;

      return (
        <div className="space-y-3">
          <textarea
            value={val}
            onChange={(e) => setVal(e.target.value)}
            id={`delta-${lockType}-textarea`}
            placeholder={isCore ? checkpoint.core.placeholder : isTac ? "Describe root projections and diffusion gradients..." : checkpoint.mastery.placeholder}
            rows={3}
            className="w-full text-xs font-mono p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 outline-none text-slate-200"
          />
          <button
            onClick={() => evaluateTextLock(
              lockType === "core" ? "coreUnlocked" : lockType === "tactical" ? "tacticalUnlocked" : "masteryUnlocked",
              val,
              qText,
              setLoad,
              setFeed
            )}
            id={`delta-${lockType}-btn`}
            disabled={load}
            className="py-2.5 px-6 font-mono text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 font-bold rounded cursor-pointer transition uppercase"
          >
            {load ? "DECRYPTING..." : "⚡ EXECUTE DECRYPTION CODE"}
          </button>
          {feed && (
            <div className="p-3 bg-slate-900/40 rounded border border-slate-800 text-[11px] font-mono text-slate-300 uppercase">
              {feed}
            </div>
          )}
        </div>
      );
    }

    return null;
  }
}
