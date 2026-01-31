import { RigidBody } from "@react-three/rapier";

export default function GlassSphere({ position }) {
  return (
    <RigidBody type="fixed" colliders="ball" position={position}>
      <mesh>
        <octahedronGeometry args={[1, 64]} />
        <meshNormalMaterial />
      </mesh>{" "}
    </RigidBody>
  );
}
