import { RigidBody, BallCollider } from "@react-three/rapier";

export default function GlassSphere({ size, position }) {
  return (
    <RigidBody type="dynamic" colliders={false} position={position}>
      <BallCollider args={[size]} />
      <BallCollider args={[0.5]} sensor />
      <mesh>
        <octahedronGeometry args={[size, 64]} />
        {/* <meshStandardMaterial color="white" roughness={0} metalness={0} /> */}
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
