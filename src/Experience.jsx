import Lights from "./Lights.jsx";
import Gallery from "./room/Gallery.jsx";
// import { Perf } from "r3f-perf";
import { Physics } from "@react-three/rapier";
import Player from "./Player.jsx";
import { Environment } from "@react-three/drei";
import { useEffect } from "react";
import { infoTextContent } from "./data/infoTextContent.js";
import useGallery from "./stores/useGallery.js";
import WhiteCube from "./room/WhiteCube.jsx";

export default function Experience() {
  // Uncomment to keep track of performance
  // const perfVisible = false;

  const showGallery = useGallery((state) => state.showGallery);
  const roomWidth = useGallery((state) => state.roomWidth);
  const roomHeight = useGallery((state) => state.roomHeight);
  const roomDepth = useGallery((state) => state.roomDepth);
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

  // Fetch gallery on mount
  useEffect(() => {
    const galleryId = "10e359de-280e-4afe-8033-d84d04f0cd5b";
    useGallery.getState().fetchGallery(galleryId);
  }, []);

  return (
    <>
      {/* Uncomment to keep track of performance */}
      {/* {perfVisible && <Perf position="top-left" />} */}

      {showGallery && <Lights />}

      {/* Uncomment for debug mode physics */}
      {/* <Physics debug> */}
      <Physics>
        {/* Environment map */}
        <Environment files="./hdr/qwantani_dusk_2_puresky_1k.hdr" background />

        {/* white cube */}
        <WhiteCube />

        {/* Gallery */}
        {showGallery && (
          <Gallery
            roomWidth={roomWidth}
            roomHeight={roomHeight}
            roomDepth={roomDepth}
            wallThickness={wallThickness}
          />
        )}

        {/* Player*/}
        {showGallery && (
          <Player roomHeight={roomHeight} wallThickness={wallThickness} />
        )}
      </Physics>
    </>
  );
}
