import CanvasMesh from "./CanvasMesh";
import ArtworkInfoMesh from "./ArtworkInfoMesh";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef, useEffect } from "react";
import useGallery from "../stores/useGallery.js";
import { useFrame } from "@react-three/fiber";

export default function Artwork({
  id,
  position,
  rotation,
  type,
  path,
  size,
  title,
  artist,
  year,
  onEnterGrabArea,
  onLeaveGrabArea,
}) {
  const artworkRef = useRef();
  const grabbedWorkId = useGallery((state) => state.grabbedWorkId);

  function onIntersection() {
    if (grabbedWorkId !== null) return;

    onEnterGrabArea();
  }

  function onIntersectionExit() {
    onLeaveGrabArea();
  }

  return (
    <>
      <RigidBody
        position={position}
        rotation={rotation}
        ref={artworkRef}
        type="kinematicPosition"
        colliders={false}
        onIntersectionEnter={onIntersection}
        onIntersectionExit={onIntersectionExit}
      >
        <>
          {/* Colliders */}
          <CuboidCollider
            args={[size[0] * 0.5, size[1] * 0.5, size[2] * 0.5]}
          />
          <CuboidCollider
            args={[size[0] * 0.5, size[1] * 0.5, 0.2]}
            position={[0, 0, 0.5]}
            sensor
          />

          {/* Meshes */}
          {type === "canvas" && <CanvasMesh path={path} size={size} />}
          <ArtworkInfoMesh title={title} artist={artist} year={year} />
        </>
      </RigidBody>
    </>
  );
}
