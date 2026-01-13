import { useRef, useState } from "react";
import useGallery from "../stores/useGallery.js";
import * as artworkData from "../data/exampleArtworks.js";
import Artwork from "./Artwork.jsx";
import * as positionsData from "../data/positions.js";
import gsap from "gsap";

export default function ArtworkGallery() {
  const grabAreaId = useRef(null);
  const grabbedWorkId = useGallery((state) => state.grabbedWorkId);
  const setGrabbedWorkId = useGallery((state) => state.setGrabbedWorkId);

  function handleGrab() {
    gsap.to(".grab-icon-container", { duration: 0.1, opacity: 0 });
    setGrabbedWorkId(grabAreaId.current);
    const image = document.getElementById("grabbed-image");
    const work = artworkData.works.filter((w) => w.id === grabAreaId.current);
    image.src = work[0].path ?? "";
    gsap.to("#grabbed-artwork-container", { duration: 0.5, opacity: 0.6 });
  }

  function handleDrop() {
    gsap.to("#grabbed-artwork-container", { duration: 0.5, opacity: 0 });
  }

  function handleMouseDown() {
    if (!grabbedWorkId) {
      handleGrab();
    } else {
      handleDrop();
    }
  }

  function handleEnterGrabArea(id) {
    grabAreaId.current = id;
    window.addEventListener("mousedown", handleMouseDown);
    gsap.to(".grab-icon-container", { duration: 0.1, opacity: 1 });
  }

  function handleLeaveGrabArea() {
    grabAreaId.current = null;
    window.removeEventListener("mousedown", handleMouseDown);
    gsap.to(".grab-icon-container", { duration: 0.1, opacity: 0 });
  }

  return (
    <>
      {artworkData.works.map((work) => {
        if (!work.position) return null;

        return (
          <Artwork
            key={work.id}
            id={work.id}
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
            onEnterGrabArea={() => handleEnterGrabArea(work.id)}
            onLeaveGrabArea={() => handleLeaveGrabArea()}
          ></Artwork>
        );
      })}
    </>
  );
}
