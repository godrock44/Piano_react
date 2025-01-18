 export const getNotePosition = (note) => {
    const notePositions = {
      60: 120, // c4
      61: 120, // C#4
      62: 110, // d4
      63: 110, // D#4
      64: 100, // e4
      65: 90,  // f4
      66: 90,  // F#4
      67: 80,  // g4
      68: 80,  // G#4
      69: 70,  // a4
      70: 70,  // A#4
      71: 60,  // b4
      72: 50,  // c5
      73: 50,  // C#5
      74: 40,  // d5
      75: 40,  // D#5
      76: 30,  // e5
      77: 20,  // f5
      78: 20,//'F#5',
      79: 10,//'G5',
      80: 10,//'G#5
      81: 8,//'A5',
      82: 8,//'A#5',
      // 83:-10,// 'B5',
      // 84:-20//c6
    };
    return notePositions[note];
};