/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Synthesizer for Retro Sci-Fi HUD Sounds
let audioCtx: AudioContext | null = null;
let humOscillator: OscillatorNode | null = null;
let humGain: GainNode | null = null;
let isMutedGlobal = false;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

export const soundManager = {
  setMute(mute: boolean) {
    isMutedGlobal = mute;
    if (mute) {
      this.stopAmbientHum();
    } else {
      this.startAmbientHum();
    }
  },

  toggleMute() {
    isMutedGlobal = !isMutedGlobal;
    this.setMute(isMutedGlobal);
    return isMutedGlobal;
  },

  getIsMuted() {
    return isMutedGlobal;
  },

  // Synthesize custom retro sci-fi beeps & loops
  playClick() {
    if (isMutedGlobal) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, audioCtx.currentTime); 
      osc.frequency.exponentialRampToValueAtTime(1500, audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      console.warn("Audio Context beep block:", e);
    }
  },

  keypadTap() {
    if (isMutedGlobal) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(1100, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.03);
    } catch (e) {}
  },

  playSuccess() {
    if (isMutedGlobal) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      // Synthesize a major chord arpeggio beep
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioCtx!.createOscillator();
        const gain = audioCtx!.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.06, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.15);

        osc.connect(gain);
        gain.connect(audioCtx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.15);
      });
    } catch (e) {}
  },

  playFailure() {
    if (isMutedGlobal) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(150, now);
      osc1.frequency.linearRampToValueAtTime(100, now + 0.35);

      osc2.type = "square";
      osc2.frequency.setValueAtTime(147, now);
      osc2.frequency.linearRampToValueAtTime(97, now + 0.35);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start();
      osc1.stop(now + 0.4);
      osc2.start();
      osc2.stop(now + 0.4);
    } catch (e) {}
  },

  playFinalCompletion() {
    if (isMutedGlobal) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const chords = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
      chords.forEach((freq, idx) => {
        const osc = audioCtx!.createOscillator();
        const gain = audioCtx!.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.07, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.4);

        osc.connect(gain);
        gain.connect(audioCtx!.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.4);
      });
    } catch (e) {}
  },

  startAmbientHum() {
    if (isMutedGlobal) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (humOscillator) return; // Already running

      const now = audioCtx.currentTime;
      humOscillator = audioCtx.createOscillator();
      humGain = audioCtx.createGain();

      // Deep cyber ambient hum (60Hz power frequency + minor harmonics)
      humOscillator.type = "triangle";
      humOscillator.frequency.setValueAtTime(55, now);

      humGain.gain.setValueAtTime(0, now);
      humGain.gain.linearRampToValueAtTime(0.015, now + 2.0); // Gentle fade in

      humOscillator.connect(humGain);
      humGain.connect(audioCtx.destination);

      humOscillator.start();
    } catch (e) {}
  },

  stopAmbientHum() {
    try {
      if (humGain && audioCtx) {
        humGain.gain.setValueAtTime(humGain.gain.value, audioCtx.currentTime);
        humGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
        const refOsc = humOscillator;
        setTimeout(() => {
          try {
            refOsc?.stop();
          } catch (e) {}
        }, 500);
      }
      humOscillator = null;
      humGain = null;
    } catch (e) {}
  }
};
