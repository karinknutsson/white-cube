import { useGLTF, CubeCamera, Environment } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import { useControls } from "leva";
import { RigidBody } from "@react-three/rapier";

const roomMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" });

export default function Room() {
  const { scene } = useGLTF("./models/basic-space-7x9.glb");

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
              <RigidBody type="dynamic" colliders="ball" restitution={1}>
                <mesh position={[0, 3, 1]}>
                  <octahedronGeometry args={[0.5, 50]} />
                  <meshStandardMaterial
                    color="grey"
                    roughness={0}
                    metalness={1}
                  />
                </mesh>
              </RigidBody>
            </>
          );
        }}
      </CubeCamera>

      {/* Room mesh */}
      <RigidBody type="fixed" colliders="trimesh">
        <group rotation={[0, -Math.PI * 0.5, 0]}>
          <primitive object={scene} />
        </group>
      </RigidBody>
    </>
  );
}
