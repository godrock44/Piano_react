import React, { useState, useEffect } from "react";
import MIDIInput from "./notelistner.js";
import Staff from './satff';  


const pianoNotes = {
  60: 'C4',
  61: 'C#4',
  62: 'D4',
  63: 'D#4',
  64: 'E4',
  65: 'F4',
  66: 'F#4',
  67: 'G4',
  68: 'G#4',
  69: 'A4',
  70: 'A#4',
  71: 'B4',
  72: 'C5',
  73: 'C#5',
  74: 'D5',
  75: 'D#5',
  76: 'E5',
  77: 'F5',
  78: 'F#5',
  79: 'G5',
  80: 'G#5',
  81: 'A5',
  82: 'A#5',
};

const PianoGame = () => {
  const [currentNote, setCurrentNote] = useState(null);
  const [playedNotes, setPlayedNotes] = useState([]); 
  const [noteMessage, setNoteMessage] = useState('');
  const [XPosition, setXPosition] = useState(100); 
  
  const createNoteObject = (midiNote, xPos , color) => ({
    note: midiNote,
    noteName: pianoNotes[midiNote],
    xPosition: xPos,
    color : color,

  });

  const generateRandomNote = () => {
    const notes = Object.keys(pianoNotes);
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    setCurrentNote(randomNote);
    setNoteMessage('');
  };

  const handleMidiNote = (midiNote) => {
    const isCorrect = midiNote === Number(currentNote)
    const color = isCorrect ? 'green' : 'red'
      
      setPlayedNotes(prev => [
        ...prev, 
        createNoteObject(currentNote, XPosition, color)
      ]);

      if (isCorrect){
        setXPosition(prevXPosition => prevXPosition+50);
        setNoteMessage('Correct! Moving to the next note...');
        generateRandomNote();
      }else {
      setNoteMessage('Please try again');
    };
  };

  useEffect(() => {
    generateRandomNote();
  }, []);

  return (
    <div>
      <MIDIInput onMidiNote={handleMidiNote} />
      
      <div>
        <p>{noteMessage}</p>
        <p>Current Note to Play: {pianoNotes[currentNote]}</p>
      </div>

      
      <Staff notes={[...playedNotes, createNoteObject(currentNote, XPosition ,'black')]} />

      <button onClick={generateRandomNote}>Generate New Note</button>

    </div>
  );
};

export default PianoGame;
