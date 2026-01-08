import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

const wallMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" });

export default function Room() {
  const { scene } = useGLTF("./models/basic-space-32.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = wallMaterial;
      }
    });
  }, []);

  return (
    <group rotation={[0, -Math.PI * 0.5, 0]}>
      <primitive object={scene} />
    </group>
  );
}
