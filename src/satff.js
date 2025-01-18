import React from "react";
import SvgTrebleclef from "./icons/Trebleclef"; 
import { getNotePosition } from "./yposition";  
import SvgQuater from "./icons/Quater";
const Staff = ({ notes }) => {
  return (
    <div>
      <svg
        className="staff"
        xmlns="http://www.w3.org/2000/svg"
        width="400"
        height="300"
      >
        
        <line x1="10" y1="40" x2="95%" y2="40" stroke="black" strokeWidth="1" />
        <line x1="10" y1="60" x2="95%" y2="60" stroke="black" strokeWidth="1" />
        <line x1="10" y1="80" x2="95%" y2="80" stroke="black" strokeWidth="1" />
        <line x1="10" y1="100" x2="95%" y2="100" stroke="black" strokeWidth="1" />
        <line x1="10" y1="120" x2="95%" y2="120" stroke="black" strokeWidth="1" />

        
        <SvgTrebleclef x="" y="" width="110" height="150" fill="black" />

        
        {notes.map((noteObj, index) => {
          const notePositionY = getNotePosition(noteObj.note);  
          return (
            <SvgQuater
              key={`${noteObj.note}-${index}`}
              x={noteObj.xPosition}
              y={notePositionY}
              
              
            />
          );
        })}
      </svg>
    </div>
  );
};

export default Staff;
