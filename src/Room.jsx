import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

const wallMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" });

export default function Room() {
  const { scene } = useGLTF("./models/basic-space.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.material = wallMaterial;
      }
    });
  }, []);

  return (
    <>
      <primitive object={scene} />
    </>
  );
}
