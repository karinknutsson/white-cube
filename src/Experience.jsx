import Lights from "./Lights.jsx";
import Gallery from "./room/Gallery.jsx";
import { Perf } from "r3f-perf";
import { Physics } from "@react-three/rapier";
import Player from "./Player.jsx";
import { Environment } from "@react-three/drei";
import { useEffect } from "react";
import { infoTextContent } from "./data/infoTextContent.js";

export default function Experience() {
  // Uncomment to keep track of performance
  // const perfVisible = true;

  // Set room dimensions
  const roomWidth = 7;
  const roomHeight = 3.2;
  const roomDepth = 9;
  const wallThickness = 0.1;

  // Add info text to the page on mount
  useEffect(() => {
    const infoText = document.querySelector(".info-content");
    if (infoText) {
      infoTextContent.forEach((text) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        infoText.appendChild(paragraph);
      });
    }
  }, []);

  return (
    <>
      {/* Uncomment to keep track of performance */}
      {/* {perfVisible && <Perf position="top-left" />} */}

      <Lights />

      {/* Uncomment for debug mode physics */}
      <Physics debug>
        {/* <Physics> */}
        {/* Environment map */}
        <Environment files="./hdr/qwantani_dusk_2_puresky_1k.hdr" background />

        {/* Gallery */}
        <Gallery
          roomWidth={roomWidth}
          roomHeight={roomHeight}
          roomDepth={roomDepth}
          wallThickness={wallThickness}
        />

        {/* Player*/}
        <Player roomHeight={roomHeight} wallThickness={wallThickness} />
      </Physics>
    </>
  );
}
