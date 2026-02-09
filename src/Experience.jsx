import Lights from "./Lights.jsx";
import Gallery from "./room/Gallery.jsx";
import { Perf } from "r3f-perf";
import { Physics } from "@react-three/rapier";
import Player from "./Player.jsx";
import { Environment } from "@react-three/drei";
import { useEffect } from "react";
import { infoTextContent } from "./data/infoTextContent.js";

export default function Experience() {
  const perfVisible = true;

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
      {perfVisible && <Perf position="top-left" />}

      <Lights />

      <Physics debug>
        {/* <Physics> */}
        <Environment files="./hdr/qwantani_dusk_2_puresky_1k.hdr" background />

        <Gallery />

        <Player />
      </Physics>
    </>
  );
}
