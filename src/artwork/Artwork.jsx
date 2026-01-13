import CanvasMesh from "./CanvasMesh";
import ArtworkInfoMesh from "./ArtworkInfoMesh";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import useGallery from "../stores/useGallery.js";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";

export default function Artwork({
  position,
  rotation,
  type,
  path,
  size,
  title,
  artist,
  year,
}) {
  const artworkRef = useRef();
  const insideGrabArea = useRef(false);

  const [isGrabbed, setIsGrabbed] = useState(false);
  const grabMode = useGallery((state) => state.grabMode);
  const setGrabMode = useGallery((state) => state.setGrabMode);

  // useEffect(() => {
  //   const handleMouseDown = () => {
  //     if (!useGallery.getState().grabMode && !insideGrabArea.current) return;

  //     if (!isGrabbed) {
  //       handleGrab();
  //     } else {
  //       handleDrop();
  //     }
  //   };

  //   window.addEventListener("mousedown", handleMouseDown);

  //   return () => {
  //     window.removeEventListener("mousedown", handleMouseDown);
  //   };
  // }, [isGrabbed]);

  // function handleDrop() {
  //   gsap.to("#grabbed-artwork-container", { duration: 0.5, opacity: 0 });
  //   setGrabMode(false);
  //   setIsGrabbed(false);
  // }

  // function handleGrab() {
  //   onIntersectionExit();
  //   setGrabMode(true);
  //   setIsGrabbed(true);

  //   const image = document.getElementById("grabbed-image");
  //   image.src = path;
  //   gsap.to("#grabbed-artwork-container", { duration: 0.5, opacity: 0.6 });
  // }

  function onIntersection() {
    if (grabMode || isGrabbed) return;

    gsap.to(".grab-icon-container", { duration: 0.1, opacity: 1 });
    insideGrabArea.current = true;
  }

  function onIntersectionExit() {
    if (grabMode || isGrabbed) return;

    gsap.to(".grab-icon-container", { duration: 0.1, opacity: 0 });
    insideGrabArea.current = false;
  }

  return (
    <>
      {!isGrabbed && (
        <RigidBody
          position={position}
          rotation={rotation}
          ref={artworkRef}
          type="kinematicPosition"
          colliders={false}
          onIntersectionEnter={onIntersection}
          onIntersectionExit={onIntersectionExit}
        >
          {/* Colliders */}
          <CuboidCollider
            args={[size[0] * 0.5, size[1] * 0.5, size[2] * 0.5]}
          />
          <CuboidCollider args={[size[0] * 0.5, size[1] * 0.5, 0.6]} sensor />

          {/* Meshes */}
          {type === "canvas" && <CanvasMesh path={path} size={size} />}
          <ArtworkInfoMesh title={title} artist={artist} year={year} />
        </RigidBody>
      )}
    </>
  );
}
