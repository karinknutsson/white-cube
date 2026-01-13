import CanvasMesh from "./CanvasMesh";
import ArtworkInfoMesh from "./ArtworkInfoMesh";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef } from "react";
import useGallery from "../stores/useGallery.js";

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
      {id !== grabbedWorkId && (
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
