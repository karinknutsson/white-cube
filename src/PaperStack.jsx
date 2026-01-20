import { useGLTF, Text } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

const paperMaterial = new THREE.MeshStandardMaterial({
  color: "#f5f4f2",
});

export default function PaperStack({ position, rotation }) {
  const { scene } = useGLTF("./models/paper-stack.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = paperMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  });

  return <primitive rotation={rotation} position={position} object={scene} />;
}
