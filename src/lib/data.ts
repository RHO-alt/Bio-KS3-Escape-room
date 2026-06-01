/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DataCard, CheckpointLock } from "../types";

export const DATA_CARDS: DataCard[] = [
  { id: 1, title: "Microscope Mechanics", timeTarget: "3 Mins", category: "Microscopy" },
  { id: 2, title: "Magnification Formulas", timeTarget: "4 Mins", category: "Microscopy" },
  { id: 3, title: "Animal Cellular Blueprint", timeTarget: "4 Mins", category: "Cell Structure" },
  { id: 4, title: "Target Identification Matrix", timeTarget: "4 Mins", category: "Cell Structure" },
  { id: 5, title: "Diffusion & System Dynamics", timeTarget: "4 Mins", category: "Transport" },
  { id: 6, title: "Rogue Agents: Unicellular Life", timeTarget: "4 Mins", category: "Transport" },
  { id: 7, title: "Special Operatives: Animal Adapts", timeTarget: "3 Mins", category: "Specialization" },
  { id: 8, title: "Special Operatives: Plant Adapts", timeTarget: "3 Mins", category: "Specialization" }
];

export const CHECKPOINTS: CheckpointLock[] = [
  {
    id: "alpha",
    title: "CHECKPOINT ALPHA",
    timeTarget: "6 MINS",
    core: {
      title: "CORE LOCK",
      description: "State the two parts of the microscope used to MAGNIFY the image. What part makes a fuzzy image CLEARER?",
      placeholder: "Type lens parts and clarity mechanism..."
    },
    tactical: {
      title: "TACTICAL LOCK",
      description: "An operative uses a x5 eyepiece and a x40 objective lens. Calculate the Total Magnification."
    },
    mastery: {
      title: "MASTERY LOCK",
      description: "A specimen has an actual size of 0.05 mm. Under x100 total magnification, calculate the Image Size in millimeters. Convert this final answer into centimeters.",
      placeholder: "Enter calculations..."
    }
  },
  {
    id: "bravo",
    title: "CHECKPOINT BRAVO",
    timeTarget: "6 MINS",
    core: {
      title: "CORE LOCK",
      description: "Identify the 3 sub-cellular structures found in plant cells but NOT in animal cells. Which of these provides rigid support?",
      placeholder: "Check plant-only structures and input supporting component"
    },
    tactical: {
      title: "TACTICAL LOCK",
      description: "An unidentified cell has a membrane, cytoplasm, and ribosomes, but lacks mitochondria and a true nucleus. Identify the cell faction (Animal, Plant, or Bacteria)."
    },
    mastery: {
      title: "MASTERY LOCK",
      description: "A toxin destroys a cell's ribosomes. Explain exactly what function the cell will instantly lose, and why it cannot survive.",
      placeholder: "Type bio-analysis here..."
    }
  },
  {
    id: "charlie",
    title: "CHECKPOINT CHARLIE",
    timeTarget: "6 MINS",
    core: {
      title: "CORE LOCK",
      description: "Define diffusion. State two factors that can increase the rate (speed) of diffusion.",
      placeholder: "Define gradient movement and factors..."
    },
    tactical: {
      title: "TACTICAL LOCK",
      description: "Yeast cells need oxygen to survive. Explain why a yeast cell absorbs oxygen much faster in the summer than in the winter."
    },
    mastery: {
      title: "MASTERY LOCK",
      description: "A student states: 'Yeast cells and Plant cells are identical because they both have cell walls.' Identify the major sub-cellular structure missing in yeast that proves this statement wrong, and state what the yeast cannot do as a result.",
      placeholder: "Validate wall homologies and state missing organs..."
    }
  },
  {
    id: "delta",
    title: "CHECKPOINT DELTA",
    timeTarget: "6 MINS",
    core: {
      title: "CORE LOCK",
      description: "State the function of a Red Blood Cell and explain why it lacks a nucleus.",
      placeholder: "Define transport purpose and structural omission..."
    },
    tactical: {
      title: "TACTICAL LOCK",
      description: "Explain exactly how the physical shape of a Root Hair Cell makes it an expert at diffusion."
    },
    mastery: {
      title: "MASTERY LOCK",
      description: "Skin cells rest silently, while muscle cells constantly contract. Predict which cell type contains more mitochondria and justify your tactical reasoning based on cellular function.",
      placeholder: "Predict cell operative profile and justify metabolic load..."
    }
  }
];
