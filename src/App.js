import React, { useState, useEffect } from "react";
import PianoKeyMapper from './keyMapping.js'
import MusicStaff from "./Stave.js";

function MIDIKeyPressListener() {
  const [midiMessages, setMidiMessages] = useState([]);
  const [status, setStatus] = useState("Waiting for MIDI device...");

  useEffect(() => {
    
    if (!navigator.requestMIDIAccess) {
      setStatus("Web MIDI API not supported in this browser");
      return;
    }

    // Request MIDI access
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

      const messageDetails = {
        note,
        velocity,
        noteStatus,
        timestamp,
      };

      setMidiMessages((prevMessages) => [...prevMessages, messageDetails]);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>MIDI Key Press Listener</h1>
      <p>{status}</p>
      {midiMessages.length > 0 ? (
        <ul>
          {midiMessages.map((msg, index) => (
            <li key={index}>
            Note: <PianoKeyMapper note={msg.note} isSharp={true} /> ({msg.note}), Status: {msg.noteStatus}, Velocity: {msg.velocity}, Time: {msg.timestamp.toFixed()}
            </li>
          
          ))}
        </ul>
      ) : (
        <p>No keys pressed yet</p>
      )}
      <MusicStaff />
    </div>
  );
}

export default MIDIKeyPressListener;
