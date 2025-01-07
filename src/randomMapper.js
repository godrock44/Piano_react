import React, { useState, useEffect } from "react";
import generateNotation from "./keyMapping";

const notesMap = generateNotation();

const RandomMapper = () => {
  const [displayedNote, setDisplayedNote] = useState(null);
  const [message, setMessage] = useState("Press the correct key");
  const [correct, setCorrect] = useState(false);

  const generateRandomNote = () => {
    const notes = Object.keys(notesMap);
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    setDisplayedNote(randomNote);
  };

  useEffect(() => {
    generateRandomNote();

    const handleMIDIMessage = (message) => {
      const [status, note] = message.data;
      if (status === 144) {
        if (note === parseInt(displayedNote)) {
          setMessage("Correct!");
          setCorrect(true);
        } else {
          setMessage("Incorrect! Try again.");
        }
      }
    };

    let midiAccess = null;

    navigator.requestMIDIAccess().then((access) => {
      midiAccess = access;
      const inputs = Array.from(midiAccess.inputs.values());

      if (inputs.length > 0) {
        const input = inputs[0];
        input.onmidimessage = handleMIDIMessage;
      } else {
        console.error("No MIDI input devices found.");
      }
    }).catch((err) => {
      console.error("Failed to get MIDI access:", err);
    });

    return () => {
      if (midiAccess) {
        for (let input of midiAccess.inputs.values()) {
          input.onmidimessage = null;
        }
      }
    };
  }, [displayedNote]);

  useEffect(() => {
    if (correct) {
      setTimeout(() => {
        setCorrect(false);
        generateRandomNote();
        setMessage("Press the correct key");
      }, 3000);
    }
  }, [correct]);

  return (
    <div>
      <h1>RandomMapper</h1>
      <p>{message}</p>
      <p>{notesMap[displayedNote]}</p>
    </div>
  );
};

export default RandomMapper;
