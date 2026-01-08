import { useGLTF, CubeCamera, Environment } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import { useControls } from "leva";

const roomMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" });

export default function Room() {
  const { scene } = useGLTF("./models/basic-space-32.glb");

  const { color } = useControls({
    color: {
      value: "#ffffff",
    },
  });

  roomMaterial.color = new THREE.Color(color);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = roomMaterial;
      }
    });
  }, []);

  return (
    <>
      <CubeCamera resolution={256}>
        {(texture) => <Environment map={texture} />}
      </CubeCamera>
      <group rotation={[0, -Math.PI * 0.5, 0]}>
        <primitive object={scene} />
      </group>
      <mesh position={[0, 1, 1]}>
        <octahedronGeometry args={[1, 50]} />
        <meshStandardMaterial color="grey" roughness={0} metalness={1} />
      </mesh>
    </>
  );
}
