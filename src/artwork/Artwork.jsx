import { distance } from "three/tsl";
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

  const wallLabelSizes = {
    width: 0.2,
    height: 0.15,
    depth: 0.004,
    distanceFromArtwork: 0.1,
  };

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
            size={[
              wallLabelSizes.width,
              wallLabelSizes.height,
              wallLabelSizes.depth,
            ]}
            position={[
              -(wallLabelSizes.width + size[0] * 0.5),
              (wallLabelSizes.height - size[1]) * 0.5,
              0,
            ]}
            title={title}
            artist={artist}
            year={year}
          />
        </>
      </RigidBody>
    </>
  );
}
