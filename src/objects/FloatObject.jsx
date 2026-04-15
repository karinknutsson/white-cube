import { RigidBody, BallCollider } from "@react-three/rapier";
import { useEffect, useRef } from "react";

export default function FloatObject({
  size,
  position,
  onEnterGrabArea,
  onLeaveGrabArea,
  addRaycastTarget,
  removeRaycastTarget,
}) {
  const meshRef = useRef();

  // Handle intersection enter event to check if player is in grab area
  function handleIntersectionEnter(e) {
    if (e.colliderObject.parent.name === "player") {
      onEnterGrabArea();
    }
  }

  // Add raycast target on mount and remove on unmount
  useEffect(() => {
    if (meshRef.current) {
      addRaycastTarget(meshRef.current);
    }

    return () => {
      if (meshRef.current) {
        removeRaycastTarget(meshRef.current);
      }
    };
  }, [addRaycastTarget, removeRaycastTarget]);

  return (
    <RigidBody
      type="dynamic"
      colliders={false}
      position={position}
      rotation={[Math.PI * 0.5, 0.3, 0]}
      mass={1}
    >
      {/* Colliders */}
      <BallCollider args={[size * 2]} />
      <BallCollider
        args={[0.5]}
        sensor
        onIntersectionEnter={handleIntersectionEnter}
        onIntersectionExit={onLeaveGrabArea}
      />

      {/* Torus knot mesh */}
      <mesh>
        <torusKnotGeometry args={[size, size * 0.8, 64, 12]} />
        <meshPhysicalMaterial
          color="#796cd9"
          roughness={0}
          metalness={0.5}
          transmission={1}
          transparent
          thickness={0.5}
          ior={2.5}
          iridescence={1}
          dithering={true}
          precision="mediump"
          envMapIntensity={1}
        />
      </mesh>

      {/* Invisible mesh for raycaster */}
      <mesh ref={meshRef} name="floatObject">
        <sphereGeometry args={[0.5]} /> <meshBasicMaterial visible={false} />
      </mesh>
    </RigidBody>
  );
}
