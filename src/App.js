import React, { useState, useEffect } from "react";
import generateNotation from "./keyMapping.js";
import MusicStaff from "./staff.js";
import TonePlayer from "./pianoTune.js";
import RandomMapper  from "./randomMapper.js";
import Staff from "./satff.js";
import staffGame from "./pianogame.js"
import PianoGame from "./pianogame.js";
import VexFlowExample from "./Vexflowcomponents/vexflow.js";



function MIDIKeyPressListener() {
  const [midiMessages, setMidiMessages] = useState([]);
  const [status, setStatus] = useState("Waiting for MIDI device...");
  const [currentMessage, setCurrentMessage]= useState(null);
  const [isSharp, setIsSharp] = useState(true); 
  const tonePlayer = TonePlayer();
  

  const sharpNotation = generateNotation(true); 
  const flatNotation = generateNotation(false); 
  
  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      setStatus("Web MIDI API not supported in this browser");
      return;
    }

    navigator.requestMIDIAccess()
      .then((midiAccess) => {
        setStatus("MIDI access granted");
        const inputs = Array.from(midiAccess.inputs.values());

        if (inputs.length === 0) {
          setStatus("No MIDI devices found");
          return;
        }

        inputs.forEach((input) => {
          input.onmidimessage = handleMIDIMessage;
          console.log(`Listening to messages from ${input.name}`);
        });
      })
      .catch(() => {
        setStatus("Failed to access MIDI. Please check permissions.");
      });

    return () => {
      navigator.requestMIDIAccess().then((midiAccess) => {
        midiAccess.inputs.forEach((input) => {
          input.onmidimessage = null;
        });
      });
    };
  }, []);
  
  const handleMIDIMessage = (message) => {
    const [command, note, velocity] = message.data;
    const timestamp = message.timeStamp;

    if (command === 144 || command === 128) {
      const isNoteOn = command === 144 && velocity > 0;
      const noteStatus = isNoteOn ? "Pressed" : "Released";
      const notationMap = generateNotation(isSharp);
      console.log("Generated Notation Map:", notationMap);

      if (isNoteOn) {
        tonePlayer.playNote(note);
      };
      // Get the notation based on the user's choice (sharp or flat)
     
      const messageDetails = { note,
         velocity,
         noteStatus,
         timestamp,
         notation:notationMap[note]  };
      setCurrentMessage(messageDetails);
      setMidiMessages((prevMessages) => [...prevMessages, messageDetails]);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>MIDI Key Press Listener</h1>
      <p>{status}</p>

      {/* Allow the user to select sharp or flat */}
      <div>
        <label>
          <input
            type="radio"
            name="notation"
            checked={isSharp}
            onChange={() => setIsSharp(true)}
          />
          Sharp Notation
        </label>
        <label>
          <input
            type="radio"
            name="notation"
            checked={!isSharp}
            onChange={() => setIsSharp(false)}
          />
          Flat Notation
        </label>
      </div>
      
      {currentMessage && (
        <div>
        <br/>
          <strong>Current Message:</strong>
          <p>
            Note: {currentMessage.notation} ({currentMessage.note}),
            Status: {currentMessage.noteStatus},
            Velocity: {currentMessage.velocity},
            Time: {currentMessage.timestamp.toFixed()}
          </p>
        </div>
        )}
      {/* Display the musical staff */}
      {/* <MusicStaff midiMessages={midiMessages} /> */}
     {/* <RandomMapper/> */}
     
     <PianoGame/>
    <VexFlowExample/>
    
     
    </div>
  );
}

export default MIDIKeyPressListener;
