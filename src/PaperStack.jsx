import { Text } from "@react-three/drei";
import * as THREE from "three";

const boxGeometry = new THREE.BoxGeometry(0.21, 0.297, 0.001);
const paperMaterial = new THREE.MeshStandardMaterial({
  color: "#ffffff",
});

export function PaperSheet({ position, rotation }) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      geometry={boxGeometry}
      material={paperMaterial}
      receiveShadow
      castShadow
    />
  );
}

export default function PaperStack() {
  return (
    <>
      {[...Array(20)].map((_, index) => (
        <PaperSheet
          key={index}
          position={[0, index * 0.0014, 0]}
          rotation={[Math.PI * 0.5, Math.random() * 0.001, 0]}
        />
      ))}
    </>
  );
}
