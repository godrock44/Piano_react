import React, { useEffect, useRef } from "react";
import Vex from "vexflow";
import PianoKeyMapper from "./keyMapping"

const MusicStaff = ({ midiMessages }) => {
  const divRef = useRef(null);

  useEffect(() => {
    if (!divRef.current || midiMessages.length === 0) return;

    const { Renderer, Stave, StaveNote, Formatter } = Vex.Flow;
    const div = divRef.current;

    // Set up the renderer
    const renderer = new Renderer(div, Renderer.Backends.SVG);
    renderer.resize(500, 200);
    const context = renderer.getContext();

    // Create the stave
    const stave = new Stave(10, 40, 400);
    stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(context).draw();

    // Helper function to convert MIDI note to VexFlow pitch
    const midiNoteToPitch = (note) => {
        const noteNames = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
        const octave = Math.floor(note / 12) - 1; // Calculate the octave
        const noteName = noteNames[note % 12]; // Get the note name (e.g., c, d#, etc.)
        return `${noteName}/${octave}`; // Return the pitch string in the format 'c/4'
    };

    // Group messages into chords by timestamp
    const groupedMessages = midiMessages.reduce((acc, msg) => {
      if (msg.noteStatus === "Pressed") {
        const timestampKey = Math.floor(msg.timestamp / 50); // Group by 50 ms intervals
        acc[timestampKey] = acc[timestampKey] || [];
        acc[timestampKey].push(midiNoteToPitch(msg.note));
      }
      return acc;
    }, {});

    // Create VexFlow notes from grouped messages
    const notes = Object.values(groupedMessages).map((keys) => 
      new StaveNote({
        keys,
        duration: "q", // Quarter note
      })
    );

    // Format and draw the notes
    Formatter.FormatAndDraw(context, stave, notes);
  }, [midiMessages]);

  return <div ref={divRef}></div>;
};

export default MusicStaff;
