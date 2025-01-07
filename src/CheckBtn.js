import React, {useState} from "react";

export const CheckBtn = () => {
    const [btnData, setbtnData] = useState(" ");

    const handleSharp = (e) =>{

    }

    return(
        <>
        <button>

        </button>
        </>
    );
}



{/* {midiMessages.length > 0 ? (
        <p>
          {midiMessages.map((msg, index) => (
            <p key={index}>
            Note: <PianoKeyMapper note={msg.note} isSharp={true} /> ({msg.note}), Status: {msg.noteStatus}, Velocity: {msg.velocity}, Time: {msg.timestamp.toFixed()}
            </p>
          ))}
        </p>
      ) : (
        <p>No keys pressed yet</p>
      )} */}