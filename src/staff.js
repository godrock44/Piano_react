import React, { useEffect, useRef, useState } from "react";
import Vex from "vexflow";
import "./staff.css";


const MusicStaff = ({ midiMessages }) => {
  const divRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    canvasWidth: window.innerWidth,
    canvasHeight: window.innerHeight,
    scaleFactor: 1,
    notesPerStave: 20,
  });

  
  useEffect(() => {
    const updateDimensions = () => {
      const scaleFactor = window.innerWidth < 600 ? 1 : window.innerWidth < 1024 ? 1.2 : 1.6;
      const notesPerStave = Math.floor(window.innerWidth / 100);

      setDimensions({
        canvasWidth: window.innerWidth,
        canvasHeight: window.innerHeight,
        scaleFactor,
        notesPerStave,
      });
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions(); 

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

 
  useEffect(() => {
    if (!divRef.current || midiMessages.length === 0) return;

    const { Renderer, Stave, StaveNote, Formatter } = Vex.Flow;
    const div = divRef.current;

    // Clear previous rendering
    div.innerHTML = "";

    // Set up the renderer
    const renderer = new Renderer(div, Renderer.Backends.SVG);
    renderer.resize(dimensions.canvasWidth, dimensions.canvasHeight);
    const context = renderer.getContext();
    context.scale(dimensions.scaleFactor, dimensions.scaleFactor);

    // Helper function to convert MIDI note to VexFlow pitch
    const midiNoteToPitch = (note) => {
      const noteNames = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
      const octave = Math.floor(note / 12) - 1; 
      const noteName = noteNames[note % 12]; 
      return `${noteName}/${octave}`; 
    };

    // Group messages into chords by timestamp
    const groupedMessages = midiMessages.reduce((acc, msg) => {
      if (msg.noteStatus === "Pressed") {
        const timestampKey = Math.floor(msg.timestamp / 50); 
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

    // Divide notes into chunks for each stave
    const notesPerStave = dimensions.notesPerStave;
    const staveChunks = [];
    for (let i = 0; i < notes.length; i += notesPerStave) {
      staveChunks.push(notes.slice(i, i + notesPerStave));
    }

    let currentY = 60; 
    const staveWidth = 900; 
    const staveHeight = 220;
    const maxStaves = Math.floor(dimensions.canvasHeight / (staveHeight * dimensions.scaleFactor));

    // Draw staves and notes
    staveChunks.forEach((chunk, index) => {
      if (index >= maxStaves) return; 

      const stave = new Stave(10, currentY, staveWidth);
      stave.addClef("treble").addTimeSignature("4/4");
      stave.setContext(context).draw();

      Formatter.FormatAndDraw(context, stave, chunk);

      currentY += staveHeight; 
    });
  }, [midiMessages, dimensions]); 

  return <div ref={divRef} className="staff-container"></div>;
};

export default MusicStaff;
