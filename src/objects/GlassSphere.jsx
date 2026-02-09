import { RigidBody, BallCollider } from "@react-three/rapier";

export default function GlassSphere({
  size,
  position,
  onEnterGrabArea,
  onLeaveGrabArea,
}) {
  return (
    <RigidBody
      type="dynamic"
      colliders={false}
      position={position}
      onIntersectionEnter={onEnterGrabArea}
      onIntersectionExit={onLeaveGrabArea}
    >
      {/* Colliders */}
      <BallCollider args={[size]} />
      <BallCollider args={[0.5]} sensor />

      {/* Sphere mesh */}
      <mesh name="glassSphere">
        <octahedronGeometry args={[size, 64]} />
        <meshPhysicalMaterial
          color="#796cd9"
          roughness={0}
          metalness={0.5}
          transmission={1}
          transparent
          thickness={0.5}
          ior={2.5}
          iridescence={1}
        />
      </mesh>
    </RigidBody>
  );
}
