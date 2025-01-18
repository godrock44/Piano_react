import React, { useState, useEffect } from "react";
import PianoKeyMapper from './keyMapping.js'
import MusicStaff from './staff.js'
import RandomNoteStaff from './RandomNote.js'

function MIDIKeyPressListener() {
  const [midiMessages, setMidiMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [isSharp, setIsSharp]= useState(true);
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
      setCurrentMessage(messageDetails);
      setMidiMessages((prevMessages) => [...prevMessages, messageDetails]);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>MIDI Key Press Listener</h1>
      <RandomNoteStaff/>
      <MusicStaff midiMessages = {midiMessages} />
      <p>{status}</p>

      {currentMessage && (
        <div style={{ marginBottom: "20px" }}>
          <strong>Current Message:</strong>

          <label style={{marginRight:'10px'}}>
            <input
              type="checkbox"
              checked = {isSharp}
              onChange={() => setIsSharp(true)}
            />
            Sharp Notation
          </label>

          <label style={{marginRight:'10px'}}>
            <input
              type="checkbox"
              checked = {!isSharp}
              onChange={() => setIsSharp(false)}
            />
            Flat Notation
          </label>

          <p>
            {isSharp ? (
              <p>
                Note: <PianoKeyMapper note={currentMessage.note} isSharp={true} /> ({currentMessage.note}),
                Status: {currentMessage.noteStatus}, Velocity: {currentMessage.velocity}, 
                Time: {currentMessage.timestamp.toFixed()}
              </p>) : 
              <p>
                Note: <PianoKeyMapper note={currentMessage.note} isSharp={false} /> ({currentMessage.note}),
                Status: {currentMessage.noteStatus}, Velocity: {currentMessage.velocity}, 
                Time: {currentMessage.timestamp.toFixed()}
              </p>}
          </p>
        </div>
      )}  
    </div>
  );
}

export default MIDIKeyPressListener;

