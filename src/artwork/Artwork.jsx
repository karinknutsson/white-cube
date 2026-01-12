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
  const grabOffset = useRef(new THREE.Vector3());

  const [grabMode, setGrabMode] = useState(false);

  function handleGrab() {
    const playerRef = useGallery.getState().playerRef.playerRef;

    if (!playerRef.current || !artworkRef.current) return;

    const playerPosition = playerRef.current.translation();
    const artworkPosition = artworkRef.current.translation();

    grabOffset.current.set(
      artworkPosition.x - (playerPosition.x + 0.5),
      artworkPosition.y - playerPosition.y,
      artworkPosition.z - (playerPosition.z + 0.5)
    );

    setGrabMode(true);
    onIntersectionExit();
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!insideGrabArea) return;

      if (e.code === "Enter") handleGrab();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useFrame((state) => {
    const playerRef = useGallery.getState().playerRef.playerRef;

    if (!grabMode || !playerRef.current || !artworkRef.current) return;

    const playerPosition = playerRef.current.translation();
    const rotatedOffset = grabOffset.current.clone();

    rotatedOffset.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      state.camera.rotation.y
    );

    const targetPosition = new THREE.Vector3(
      playerPosition.x + rotatedOffset.x,
      playerPosition.y + rotatedOffset.y,
      playerPosition.z + rotatedOffset.z
    );

    artworkRef.current.setNextKinematicTranslation(
      new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z)
    );

    const cameraRotation = state.camera.rotation;
    artworkRef.current.setNextKinematicRotation(
      new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, cameraRotation.y, 0)
      )
    );
  });

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
      {/* Body */}
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
        <CuboidCollider args={[size[0] * 0.5, size[1] * 0.5, size[2] * 0.5]} />
        <CuboidCollider args={[size[0] * 0.5, size[1] * 0.5, 0.6]} sensor />

        {type === "canvas" && <CanvasMesh path={path} size={size} />}
        <ArtworkInfoMesh title={title} artist={artist} year={year} />
      </RigidBody>
    </>
  );
}
