import { useGLTF, CubeCamera, Environment } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import { useControls } from "leva";
import { roughness } from "three/tsl";

const roomMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" });

export default function Room() {
  const { scene } = useGLTF("./models/basic-space-32.glb");

  const { color, roughness, metalness } = useControls("material", {
    color: {
      value: "#ffffff",
    },
    roughness: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
  });

  roomMaterial.color = new THREE.Color(color);
  roomMaterial.roughness = roughness;

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
      {/* Environment map */}
      <CubeCamera resolution={256}>
        {(texture) => {
          return (
            <>
              {" "}
              <Environment map={texture} />
              {/* Metallic sphere for testing */}
              <mesh position={[0, 1, 1]}>
                <octahedronGeometry args={[0.5, 50]} />
                <meshStandardMaterial
                  color="grey"
                  roughness={0}
                  metalness={1}
                />
              </mesh>
            </>
          );
        }}
      </CubeCamera>

      {/* Room mesh */}
      <group rotation={[0, -Math.PI * 0.5, 0]}>
        <primitive object={scene} />
      </group>
    </>
  );
}
