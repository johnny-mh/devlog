import React from 'react'

interface SpinnerProps {
  className?: string
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 30 30"
      xmlSpace="preserve"
      style={{ fill: '#333' }}
      className={className}
      width={30}
    >
      <circle transform="translate(8 0)" cx="0" cy="16" r="0">
        <animate
          attributeName="r"
          values="0; 4; 0; 0"
          dur="1.2s"
          repeatCount="indefinite"
          begin="0"
          keyTimes="0;0.2;0.7;1"
          keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
          calcMode="spline"
        ></animate>
      </circle>
      <circle transform="translate(16 0)" cx="0" cy="16" r="0">
        <animate
          attributeName="r"
          values="0; 4; 0; 0"
          dur="1.2s"
          repeatCount="indefinite"
          begin="0.3"
          keyTimes="0;0.2;0.7;1"
          keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
          calcMode="spline"
        ></animate>
      </circle>
      <circle transform="translate(24 0)" cx="0" cy="16" r="0">
        <animate
          attributeName="r"
          values="0; 4; 0; 0"
          dur="1.2s"
          repeatCount="indefinite"
          begin="0.6"
          keyTimes="0;0.2;0.7;1"
          keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
          calcMode="spline"
        ></animate>
      </circle>
    </svg>
  )
}

export default Spinner
