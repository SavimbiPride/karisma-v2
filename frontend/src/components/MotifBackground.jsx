import React from "react";

import motifImage from "../assets/image 6.png";

export default function MotifBackground({ className }) {
  return (
    <img src={motifImage} alt="" className={className} aria-hidden="true" />
  );
}
