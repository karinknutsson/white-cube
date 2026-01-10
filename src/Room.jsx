import { useGLTF, CubeCamera, Environment } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import { useControls } from "leva";
import { RigidBody } from "@react-three/rapier";

const roomMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" });
const windowMaterial = new THREE.MeshPhysicalMaterial({
  color: "#ffffff",
  roughness: 0,
  transmission: 1,
  thickness: 0.03,
  transparent: true,
});

export default function Room() {
  const { scene: roomScene } = useGLTF("./models/basic-space-7x9.glb");
  const { scene: windowScene } = useGLTF("./models/window-7.glb");

  const { color, roughness } = useControls("material", {
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
    roomScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = roomMaterial;
      }
    });

    windowScene.traverse((child) => {
      if (child.isMesh) {
        child.material = windowMaterial;
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
              {/* <RigidBody type="dynamic" colliders="ball" restitution={1}>
                <mesh position={[0, 3, 3]}>
                  <octahedronGeometry args={[0.5, 50]} />
                  <meshStandardMaterial
                    color="grey"
                    roughness={0}
                    metalness={1}
                  />
                </mesh>
              </RigidBody> */}
            </>
          );
        }}
      </CubeCamera>

      {/* Room mesh */}
      <RigidBody type="fixed" colliders="trimesh">
        <group rotation={[0, -Math.PI * 0.5, 0]}>
          <primitive object={roomScene} />
        </group>
      </RigidBody>

      {/* Window mesh */}
      <RigidBody type="fixed" colliders="trimesh">
        <group rotation={[0, -Math.PI * 0.5, 0]}>
          <primitive object={windowScene} />
        </group>
      </RigidBody>
    </>
  );
}
