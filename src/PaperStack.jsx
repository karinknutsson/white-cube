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

  return (
    <>
      <group
        position={[position[0], position[1] + 0.0257, position[2]]}
        // rotation={[-Math.PI * 0.5, rotation[1] + 0.0257, rotation[2]]}
        rotation={[Math.PI * 0.5, Math.PI, rotation[1]]}
      >
        <Text
          font="./fonts/IBMPlexSans-SemiBold.woff"
          position={[-0.046, 0, 0.18]}
          fontSize={0.02}
          color="black"
          anchorX="left"
          anchorY="top"
        >
          Title
        </Text>

        <Text
          font="./fonts/IBMPlexSans-Regular.woff"
          position={[-0.06, 0, 0.12]}
          fontSize={0.006}
          color="black"
          anchorX="left"
          anchorY="top"
          maxWidth={0.15}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>
      </group>
      <primitive rotation={rotation} position={position} object={scene} />
    </>
  );
}
