import React from "react";

export default function LogoBackground() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="213" height="89" fill="none">
      <g filter="url(#a)">
        <path fill="#FFC300" d="M0 4h187c12.15 0 22 9.85 22 22v59H0V4Z" />
      </g>
      <defs>
        <filter
          id="a"
          width="217"
          height="89"
          x="-4"
          y="0"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_869_826"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_869_826"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
