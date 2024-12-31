import React, { useEffect, useRef } from 'react';
import Vex from 'vexflow';

const MusicStaff = () => {
    const divRef = useRef(null);

    useEffect(() => {
        const { Renderer, Stave } = Vex.Flow;

        // Get the div container
        const div = divRef.current;

        // Create a new renderer using SVG
        const renderer = new Renderer(div, Renderer.Backends.SVG);

        // Set the size of the renderer
        renderer.resize(500, 500);

        // Get the rendering context
        const context = renderer.getContext();

        // Create a stave
        const stave = new Stave(10, 40, 400);

        // Add a clef and time signature
        stave.addClef("treble").addTimeSignature("4/4");

        // Render the stave
        stave.setContext(context).draw();
    }, []);

    return <div id="output" ref={divRef}></div>;
};

export default MusicStaff;
