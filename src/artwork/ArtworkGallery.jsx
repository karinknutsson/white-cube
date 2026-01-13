import { useEffect } from "react";
import useGallery from "../stores/useGallery.js";
import * as data from "./data/exampleArtworks.js";
import Artwork from "./artwork/Artwork.jsx";
import * as positionsData from "./data/positions.js";

export default function ArtworkGallery() {
  const grabbedWorkIndex = useGallery((state) => state.grabbedWorkIndex);
  const setGrabbedWorkIndex = useGallery((state) => state.setGrabbedWorkIndex);

  useEffect(() => {
    const handleMouseDown = () => {
      if (!useGallery.getState().grabMode && !insideGrabArea.current) return;

      if (!isGrabbed) {
        handleGrab();
      } else {
        handleDrop();
      }
    };

    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  function handleDrop() {
    gsap.to("#grabbed-artwork-container", { duration: 0.5, opacity: 0 });
    setGrabMode(false);
    // setIsGrabbed(false);
  }

  function handleGrab() {
    onIntersectionExit();
    setGrabMode(true);
    // setIsGrabbed(true);

    const image = document.getElementById("grabbed-image");
    image.src = path;
    gsap.to("#grabbed-artwork-container", { duration: 0.5, opacity: 0.6 });
  }

  return (
    <>
      {data.data.map((work) => {
        if (!work.position) return null;

        return (
          <Artwork
            key={work.title}
            position={
              positionsData.positions[work.position.wall][
                work.position.wallPosition
              ]
            }
            rotation={positionsData.positions[work.position.wall].rotation}
            type="canvas"
            path={work.path}
            size={work.size}
            artist={work.artist}
            title={work.title}
            year={work.year}
          ></Artwork>
        );
      })}
    </>
  );
}
