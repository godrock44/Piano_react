import React, { useEffect, useRef, useState } from "react";
import Vex from "vexflow";

const RandomNoteStaff = ({ midiMessages }) => {
  const divRef = useRef(null);
  const [randomNote, setRandomNote] = useState(""); // State for the random note
  const [message, setMessage] = useState(""); // Feedback message

  useEffect(() => {
    const { Renderer, Stave, StaveNote, Formatter } = Vex.Flow;

    // Reference to the rendering div
    const div = divRef.current;
    if (!div) return;

    // Clear previous content
    div.innerHTML = " ";

    // Set up the renderer
    const renderer = new Renderer(div, Renderer.Backends.SVG);
    renderer.resize(500, 200);
    const context = renderer.getContext();

    // Create the stave
    const stave = new Stave(10, 40, 400);
    stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(context).draw();

    // Helper function to generate a random note
    const getRandomNote = () => {
      const noteNames = ["c", "d", "e", "f", "g", "a", "b"];
      const accidentals = ["", "#", "b"];
      const octave = Math.floor(Math.random() * 3) + 3; // Octave between 3 and 5
      const note = noteNames[Math.floor(Math.random() * noteNames.length)];
      const accidental = accidentals[Math.floor(Math.random() * accidentals.length)];
      return accidental ? `${note}${accidental}/${octave}` : `${note}/${octave}`;
    };

    // Generate a random note if not already set
    if (!randomNote) {
      setRandomNote(getRandomNote());
    }

    // Convert MIDI note to VexFlow pitch
    const noteToPitch = (note) => {
      const noteNames = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
      const octave = Math.floor(note / 12) - 1;
      const noteName = noteNames[note % 12];
      return `${noteName[0]}${noteName[1] === "#" ? "#" : ""}/${octave}`;
    };

    // Process MIDI messages
    const notes = midiMessages && midiMessages.length > 0
      ? midiMessages
          .filter((msg) => msg.noteStatus === "Pressed") // Only consider pressed notes
          .map((msg) => {
            const pressedNote = noteToPitch(msg.note);
            if (pressedNote === randomNote) {
              setMessage("Correct!");
              setRandomNote(getRandomNote()); // Generate a new random note
              return null; // No need to display the note if it's correct
            } else {
              setMessage(""); // Clear the feedback message
              return new StaveNote({
                keys: [pressedNote],
                duration: "q",
              }).setStyle({ fillStyle: "red", strokeStyle: "red" }); // Display incorrect note in red
            }
          })
          .filter((note) => note !== null) // Remove null values
      : [
          // Display the random note initially
          new StaveNote({
            keys: [randomNote],
            duration: "q",
          }),
        ];

    // Format and draw the notes
    Formatter.FormatAndDraw(context, stave, notes);
  }, [midiMessages, randomNote]);

  return (
    <div>
      <div ref={divRef}></div>
      <p>{message}</p>
    </div>
  );
};

export default RandomNoteStaff;
