import { RigidBody } from "@react-three/rapier";

export default function GlassSphere({ size, position }) {
  return (
    <RigidBody type="fixed" colliders="ball" position={position}>
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
