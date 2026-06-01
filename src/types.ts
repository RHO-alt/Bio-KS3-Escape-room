/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MicroscopeState {
  magnificationMode: "lowest" | "medium" | "highest";
  focusValue: number; // 0 (completely blurred) to 100 (in focus)
  isLightOn: boolean;
  activePath: "magnify" | "focus" | null;
}

export interface FormulaState {
  selectedTerm: "image" | "actual" | "magnification" | null;
  eyepieceFactor: number;
  objectiveFactor: number;
  conversionValueCm: number;
}

export interface CellModelWidgetState {
  selectedOrganelle: string | null;
}

export interface DiffusionWidgetState {
  temperatureSetting: number; // 18, 20, 27, 32
  surfaceAreaSetting: "flat" | "folded";
}

export interface LockState {
  coreAnswer: string;
  coreUnlocked: boolean;
  coreFeedback: string;
  coreIsLoading: boolean;

  tacticalInputs: Record<string, string>;
  tacticalUnlocked: boolean;
  tacticalFeedback: string;
  tacticalIsLoading: boolean;

  masteryAnswer: string;
  masteryUnlocked: boolean;
  masteryFeedback: string;
  masteryIsLoading: boolean;

  checkpointCompleted: boolean;
}

export interface CheckpointLock {
  id: string; // "alpha", "bravo", "charlie", "delta"
  title: string;
  timeTarget: string;
  core: {
    title: string;
    description: string;
    placeholder: string;
  };
  tactical: {
    title: string;
    description: string;
  };
  mastery: {
    title: string;
    description: string;
    placeholder: string;
  };
}

export interface DataCard {
  id: number;
  title: string;
  timeTarget: string;
  category: string;
}
