import React from 'react';

const SvgQuater = ({ x, y, color }) => {
  return (
    <svg
      width="64px"
      height="64px"
      viewBox="-7 0 30 30"
      xmlns="http://www.w3.org/2000/svg"
      fill={color} 
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <path
          d="M539.992,622 C539.031,622 538.984,623.002 538.984,623.002 L538.984,639.363 C536.748,637.715 533.058,637.713 529.788,639.589 C525.725,641.922 523.982,646.27 525.616,649.3 C527.279,652.384 532.097,652.896 536.16,650.563 C539.316,648.751 541.007,645.807 541,643 L541,623 C540.982,622.462 540.537,622 539.992,622"
          transform="translate(-525 -622)"
          fill={color}
        />
      </g>
    </svg>
  );
};

export default SvgQuater;
