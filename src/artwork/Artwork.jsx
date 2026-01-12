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
  let insideGrabArea = false;

  const [grabMode, setGrabMode] = useState(false);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (!insideGrabArea) return;

      handleGrab();
    };

    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  function handleGrab() {
    setGrabMode(true);
    onIntersectionExit();

    const image = document.getElementById("grabbed-image");
    image.src = path;
    gsap.to("#grabbed-artwork-container", { duration: 0.5, opacity: 0.6 });
  }

  function onIntersection() {
    if (grabMode) return;

    gsap.to(".grab-icon-container", { duration: 0.1, opacity: 1 });
    insideGrabArea = true;
  }

  function onIntersectionExit() {
    gsap.to(".grab-icon-container", { duration: 0.1, opacity: 0 });
    insideGrabArea = false;
  }

  return (
    <>
      {!grabMode && (
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
