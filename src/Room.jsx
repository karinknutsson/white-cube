import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import { useControls } from "leva";

const wallMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" });

export default function Room() {
  const { scene } = useGLTF("./models/basic-space-32.glb");

  const { color } = useControls({
    color: {
      value: "#ffffff",
    },
  });

  wallMaterial.color = new THREE.Color(color);

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
