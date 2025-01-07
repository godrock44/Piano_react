import React, { useEffect } from "react";
import * as Tone from "tone";

const TonePlayer = () => {
  // Initialize a PolySynth for multiple notes
  const synth = new Tone.PolySynth(Tone.Synth).toDestination();

  useEffect(() => {
    // Start the audio context
    Tone.start().then(() => {
      console.log("Audio context started");
    }).catch((error) => {
      console.error("Audio context failed to start", error);
    });
  }, []);

  const playNote = (midiNote) => {
    // Convert MIDI note to frequency and play
    const toneNote = Tone.Frequency(midiNote, "midi").toNote();
    synth.triggerAttackRelease(toneNote, "4n");
  };

  return { playNote };
};

export default TonePlayer;
