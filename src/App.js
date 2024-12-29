import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [midiAccess, setMidiAccess] = useState(null);
  const [midiInput, setMidiInput] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('No device connected');

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then(access => {
          setMidiAccess(access);
          setupMIDI(access);
          access.onstatechange = handleStateChange;
        })
        .catch(error => {
          console.error('MIDI access denied:', error);
          setConnectionStatus('Failed to access MIDI. Please check permissions.');
        });
    } else {
      setConnectionStatus('Web MIDI API not supported in this browser');
    }
  }, []);

  const setupMIDI = (access) => {
    const inputs = Array.from(access.inputs.values());
    if (inputs.length > 0) {
      setMidiInput(inputs[0]); // Use the first MIDI input device
      setConnectionStatus(`Connected to ${inputs[0].name}`);
    } else {
      setConnectionStatus('No MIDI input devices found');
    }
  };

  const handleStateChange = (event) => {
    const device = event.port;
    if (device.type === 'input' && device.state === 'connected') {
      setConnectionStatus(`Connected to ${device.name}`);
    } else if (device.state === 'disconnected') {
      setConnectionStatus('Device disconnected');
    }
  };

  return (
    <div className="App">
      <h1>MIDI Connection Status</h1>
      <p>{connectionStatus}</p>
    </div>
  );
}

export default App;
