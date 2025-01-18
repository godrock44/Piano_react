import { useEffect } from 'react';

const MIDIInput = ({ onMidiNote }) => {
  useEffect(() => {
    const handleMIDIMessage = (message) => {
      const [status, midiNote, velocity] = message.data;

      // Handle only note-on messages (status 144) with velocity > 0 to register key press
      if (status === 144 && velocity > 0) {
        onMidiNote(midiNote);
      }
    };

    let midiAccess = null;

    // Request MIDI access
    navigator.requestMIDIAccess().then((access) => {
      midiAccess = access;
      const inputs = Array.from(midiAccess.inputs.values());

      if (inputs.length > 0) {
        inputs.forEach(input => {
          input.onmidimessage = handleMIDIMessage;
        });
      } else {
        console.error('No MIDI input devices found.');
      }
    }).catch((err) => {
      console.error('Failed to get MIDI access:', err);
    });

    // Cleanup function to remove event listeners
    return () => {
      if (midiAccess) {
        for (let input of midiAccess.inputs.values()) {
          input.onmidimessage = null;
        }
      }
    };
  }, [onMidiNote]);

  return null;
};

export default MIDIInput;
