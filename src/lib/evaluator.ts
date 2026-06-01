/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Shared client-side biological answer evaluator to support standalone/offline mode
export function localEvaluate(checkpointId: string, lockId: string, answer: string): { isCorrect: boolean; feedback: string } {
  const norm = answer.toLowerCase().trim();

  if (checkpointId === "alpha") {
    if (lockId === "core") {
      // Microscope zoom features: Eyepiece / Objective magnify, Coarse / Fine Focus adjusts clarity
      const hasEyepiece = norm.includes("eyepiece");
      const hasObjective = norm.includes("objective");
      const hasFocus = norm.includes("focus") || norm.includes("knob") || norm.includes("fine") || norm.includes("coarse");
      
      if ((hasEyepiece || hasObjective) && hasFocus) {
        return {
          isCorrect: true,
          feedback: "DECRYPTION SUCCESSFUL: Standard biological lens systems parsed. Objectives identify magnification and Focus Knobs resolve sharp visual boundaries."
        };
      } else {
        return {
          isCorrect: false,
          feedback: "DECRYPTION FAILED: Incomplete microscope calibration terms. State the lenses that multiply scale, and the element adjusting specimen clarity."
        };
      }
    }
  }

  if (checkpointId === "bravo") {
    if (lockId === "mastery") {
      const hasProtein = norm.includes("protein");
      const hasSynthesis = norm.includes("synthesis") || norm.includes("build") || norm.includes("maker") || norm.includes("make") || norm.includes("create");
      const hasRibosome = norm.includes("ribosome");
      const hasenergyOrSurvival = norm.includes("survive") || norm.includes("die") || norm.includes("function") || norm.includes("live") || norm.includes("enzyme");

      if (hasProtein && (hasSynthesis || norm.includes("translation"))) {
        return {
          isCorrect: true,
          feedback: "DECRYPTION SUCCESSFUL: Ribosomal destruction halts translation. Without protein synthesis, cellular enzymes and structure dissolve."
        };
      } else {
        return {
          isCorrect: false,
          feedback: "DECRYPTION FAILED: Cellular scan shows lack of precision. Ribosomes read mRNA to construct what critical biological molecule?"
        };
      }
    }
  }

  if (checkpointId === "charlie") {
    if (lockId === "core") {
      const hasMovement = norm.includes("move") || norm.includes("diff") || norm.includes("travel") || norm.includes("pass") || norm.includes("random");
      const hasConcentration = norm.includes("concentrat") || norm.includes("high") || norm.includes("low");
      const hasFactors = norm.includes("temp") || norm.includes("surface") || norm.includes("area") || norm.includes("gradient") || norm.includes("dilat");

      if (hasConcentration || (hasMovement && hasFactors)) {
        return {
          isCorrect: true,
          feedback: "DECRYPTION SUCCESSFUL: Diffusion kinetics approved. Solute drift from High Concentration to Low Concentration is highly responsive to Temperature and Surface Area parameters."
        };
      } else {
        return {
          isCorrect: false,
          feedback: "DECRYPTION FAILED: Standard physics definitions not satisfied. Remember to cite concentration gradient boundaries (from high to low) and secondary speed stimuli."
        };
      }
    }

    if (lockId === "tactical") {
      const hasTemp = norm.includes("temp") || norm.includes("warm") || norm.includes("hot") || norm.includes("summer");
      const hasEnergy = norm.includes("energy") || norm.includes("kinetic") || norm.includes("speed") || norm.includes("fast") || norm.includes("move");

      if (hasTemp && hasEnergy) {
        return {
          isCorrect: true,
          feedback: "DECRYPTION SUCCESSFUL: Kinetic energy thresholds verified. Ambient heat in summer escalates molecule velocity, driving massive net oxygen flow."
        };
      } else {
        return {
          isCorrect: false,
          feedback: "DECRYPTION FAILED: Thermal dynamics not linked. Relate high seasonal temperatures to the kinetic state of the oxygen molecules."
        };
      }
    }

    if (lockId === "mastery") {
      const hasChloroplast = norm.includes("chloroplast") || norm.includes("chloro") || norm.includes("plast");
      const hasPhotosynthesis = norm.includes("photosynthe") || norm.includes("sunlight") || norm.includes("light") || norm.includes("food") || norm.includes("sugar") || norm.includes("glucose");

      if (hasChloroplast && (hasPhotosynthesis || norm.includes("autotroph"))) {
        return {
          isCorrect: true,
          feedback: "DECRYPTION SUCCESSFUL: Yeast cell wall homology is a false analogy. Yeast has no chloroplasts, meaning it depends on heterotrophic sugars rather than photosynthesis."
        };
      } else {
        return {
          isCorrect: false,
          feedback: "DECRYPTION FAILED: Cell categorization error. Identify the specific green plant exclusive organelle missing in yeast, and the chemical food cycle it halts."
        };
      }
    }
  }

  if (checkpointId === "delta") {
    if (lockId === "core") {
      const hasOxygen = norm.includes("oxygen") || norm.includes("o2") || norm.includes("gas");
      const hasCarry = norm.includes("carry") || norm.includes("transport") || norm.includes("deliver") || norm.includes("move") || norm.includes("hemoglobin");
      const hasSpace = norm.includes("space") || norm.includes("more") || norm.includes("room") || norm.includes("volume") || norm.includes("fit");

      if (hasOxygen && (hasCarry || hasSpace)) {
        return {
          isCorrect: true,
          feedback: "DECRYPTION SUCCESSFUL: Special Forces Roster updated: Operative 01 (Red Blood Cell). Biconcave shape and nuclear absence combine to pack maximum hemoglobin payloads."
        };
      } else {
        return {
          isCorrect: false,
          feedback: "DECRYPTION FAILED: Adaptations not reconciled. Explain what cargo the red cell moves, and what spatial advantage arises from expelling its nucleus."
        };
      }
    }

    if (lockId === "tactical") {
      const hasSurfaceArea = norm.includes("surface") || norm.includes("area") || norm.includes("sa");
      const hasHair = norm.includes("hair") || norm.includes("projection") || norm.includes("extension") || norm.includes("long") || norm.includes("outgrowth");

      if (hasSurfaceArea && (hasHair || norm.includes("absorb") || norm.includes("contact"))) {
        return {
          isCorrect: true,
          feedback: "DECRYPTION SUCCESSFUL: Operative 03 (Root Hair Cell) parameters loaded. Massive geometric surface expansion guarantees rapid soil water flow."
        };
      } else {
        return {
          isCorrect: false,
          feedback: "DECRYPTION FAILED: Geometric optimization not cited. How does the root cell's finger-like protrusion affect contact area and absorption rates?"
        };
      }
    }

    if (lockId === "mastery") {
      const hasMuscle = norm.includes("muscle");
      const hasMito = norm.includes("mitochondria") || norm.includes("energy");
      const hasRespiration = norm.includes("respir") || norm.includes("contract") || norm.includes("atp") || norm.includes("work") || norm.includes("move");

      if (hasMuscle && (hasMito || hasRespiration)) {
        return {
          isCorrect: true,
          feedback: "DECRYPTION SUCCESSFUL: Operative 02 (Muscle Cell) biomechanics confirmed. Constant visual contractions dictate extreme ATP burn rates, requiring mitochondrial overload."
        };
      } else {
        return {
          isCorrect: false,
          feedback: "DECRYPTION FAILED: Cellular energy budget mismatch. Contrast the work output of static skin vs actively contracting fibers to justify power needs."
        };
      }
    }
  }

  // default text verification for everything else
  if (norm.length > 5) {
    return {
      isCorrect: true,
      feedback: "LOCAL SYSTEM BYPASS GRANTED: Bio-intel decrypted under basic automated validation. Cellular compliance accepted."
    };
  }

  return {
    isCorrect: false,
    feedback: "DECRYPTION FAILED: Input too brief. Please supply complete bio-tactical justifications."
  };
}
