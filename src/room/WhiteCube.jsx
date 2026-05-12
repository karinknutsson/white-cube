import { RigidBody } from "@react-three/rapier";

export default function WhiteCube() {
  return (
    <RigidBody type="fixed">
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
  );
}
