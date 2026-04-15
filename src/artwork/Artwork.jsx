import CanvasMesh from "./CanvasMesh";
import WallLabel from "./WallLabel";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef, useEffect } from "react";
import { wallLabelSizes } from "../data/wallLabelSizes";

export default function Artwork({
  position,
  type,
  path,
  size,
  id,
  title,
  artist,
  year,
  onEnterGrabArea,
  onLeaveGrabArea,
  addRaycastTarget,
  removeRaycastTarget,
}) {
  const artworkRef = useRef();

  useEffect(() => {
    if (artworkRef.current) {
      addRaycastTarget(artworkRef.current);
    }

    return () => {
      if (artworkRef.current) {
        removeRaycastTarget(artworkRef.current);
      }
    };
  }, [addRaycastTarget, removeRaycastTarget]);

  return (
    <>
      <RigidBody
        position={position}
        // ref={artworkRef}
        type="kinematicPosition"
        colliders={false}
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
            onIntersectionEnter={onEnterGrabArea}
            onIntersectionExit={onLeaveGrabArea}
          />

          {/* Meshes */}
          {type === "canvas" && (
            <CanvasMesh ref={artworkRef} path={path} size={size} id={id} />
          )}
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
