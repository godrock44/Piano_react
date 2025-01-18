import React, { useEffect, useRef, useState } from "react";
import { Vex } from "vexflow";

const VF = Vex.Flow;

const VexFlowExample = () => {
  const cursorRef = useRef(null);
  const vexFlowContainer = useRef(null);
  const [currentBeat, setCurrentBeat] = useState(0);
  const notesArray = useRef([]);
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120); 

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);

    const renderVexFlow = () => {
      vexFlowContainer.current.innerHTML = "";

      const vf = new VF.Factory({
        renderer: { elementId: vexFlowContainer.current.id, width: size.width, height: size.height / 2 },
      });

      const score = vf.EasyScore();
      const system = vf.System({ width: size.width - 10, spaceBetweenStaves: 10 });

      const trebleNotes = (score.notes('C#5/q, B4, A4, G4', {stem: 'up'}));
      const bassNotes = (score.notes('C#1/q, B2/r, A2/r, B2/r', { stem: 'up' }));
                          
      system.addStave({
        voices: [score.voice(trebleNotes)],
      })
      .addClef('treble')
      .addTimeSignature('4/4');

      system.addStave({
        voices: [score.voice(bassNotes)],
      })
      .addClef('bass')
      .addTimeSignature('4/4');

      system.addConnector();

      vf.draw();

      
      const positions = [];
      [...trebleNotes, ...bassNotes].forEach((note) => {
        const boundingBox = note.getBoundingBox();
        if (boundingBox) {
          positions.push(boundingBox.getX());
        }
      });
      positions.sort((a, b)=> a - b);
      notesArray.current = positions;
    };

    renderVexFlow();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [size]);

  useEffect(() => {
    let interval;

    if (isPlaying) {
      const timePerBeat = (60 / tempo) * 1000; 

      interval = setInterval(() => {
        const noteX = notesArray.current[currentBeat];
        cursorRef.current.style.transform = `translateX(${noteX}px)`;

        setCurrentBeat((prev) => (prev + 1) % notesArray.current.length); 
      }, timePerBeat);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [currentBeat, isPlaying, tempo]);

  const togglePlayback = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleTempoChange = (event) => {
    setTempo(event.target.value);
  };

  return (
    <div className="vexflow-container" style={{ height: size.height / 2 + 'px', position: 'relative' }}>
      <div id="vexflow" ref={vexFlowContainer} />
      <div
        ref={cursorRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '30px',
          height: '90%',
          backgroundColor: "lightblue",
          opacity:"0.5",
          transform: 'translateX(0)',
          transition: 'transform 0.5s linear',
        }}
      />
      <button onClick={togglePlayback} style={{ position: 'absolute', bottom: 10, left: 10 }}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <div style={{ position: 'absolute', bottom: 10, left: 100 }}>
        <label htmlFor="tempo">Tempo (BPM):</label>
        <input
          type="number"
          id="tempo"
          value={tempo}
          onChange={handleTempoChange}
          min="40"
          max="240"
        />
      </div>
    </div>
  );
};

export default VexFlowExample;
