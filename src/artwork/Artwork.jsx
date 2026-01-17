import CanvasMesh from "./CanvasMesh";
import WallLabel from "./WallLabel";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef } from "react";

export default function Artwork({
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

  return (
    <>
      <RigidBody
        position={position}
        rotation={rotation}
        ref={artworkRef}
        type="kinematicPosition"
        colliders={false}
        onIntersectionEnter={onEnterGrabArea}
        onIntersectionExit={onLeaveGrabArea}
      >
        <>
          {/* Colliders */}
          <CuboidCollider
            args={[size[0] * 0.5, size[1] * 0.5, size[2] * 0.5]}
          />
          <CuboidCollider
            args={[size[0] * 0.5, size[1] * 0.5, 0.2]}
            position={[0, 0, 0.6]}
            sensor
          />

          {/* Meshes */}
          {type === "canvas" && <CanvasMesh path={path} size={size} />}
          <WallLabel
            size={[0.2, 0.15, 0.004]}
            // position={[0.1 - size[0] * 0.5, -(size[1] * 0.5 + 0.2), 0]}
            position={[-(0.2 + size[0] * 0.5), 0.075 - size[1] * 0.5, 0.1]}
            title={title}
            artist={artist}
            year={year}
          />
        </>
      </RigidBody>
    </>
  );
}
