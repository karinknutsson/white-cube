import { useRef } from "react";
import { SpotLightHelper } from "three";
import { useHelper, useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

const lampMaterial = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  // wireframe: true,
});

export default function SpotLight({
  position,
  targetPosition,
  intensity,
  dispersionAngle,
  rotation,
}) {
  const spotLight = useRef();
  const spotLightTarget = useRef();

  useHelper(spotLight, SpotLightHelper, "cyan");

  const { scene: sceneBase } = useGLTF(
    "./models/spotlight-model-flexi-base.glb",
  );
  const { scene: sceneLamp } = useGLTF(
    "./models/spotlight-model-flexi-lamp.glb",
  );

  const topPosition = new THREE.Vector3(position[0], position[1], position[2]);
  const lampRotation = [1, 0, 0];

  // const topPosition = new THREE.Vector3(position[0], position[1], position[2]);
  // const angle = Math.PI;
  // const distance = 4;
  // const theta = -Math.PI / 5;

  // const targetPosition = new THREE.Vector3(
  //   topPosition.x + Math.sin(angle) * distance,
  //   topPosition.y + Math.sin(theta) * distance,
  //   topPosition.z + Math.cos(angle) * distance,
  // );

  useEffect(() => {
    sceneBase.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.material = lampMaterial;
      }
    });

    sceneLamp.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.material = lampMaterial;
      }
    });

    if (spotLight.current && spotLightTarget.current)
      spotLight.current.target = spotLightTarget.current;

    // const direction = targetPosition.clone().sub(topPosition).normalize();
    // const quaternion = new THREE.Quaternion();
    // quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
    // spotLight.current.quaternion.copy(quaternion);

    // const euler = new THREE.Euler().setFromQuaternion(quaternion);
    // console.log(euler.x, euler.y, euler.z);
  }, []);

  return (
    <>
      <group position={topPosition} rotation={rotation}>
        <spotLight
          ref={spotLight}
          // position={[0.01, -0.1, -0.012]}
          // position={topPosition}
          position={[0, -0.1, -0.04]}
          angle={dispersionAngle}
          penumbra={1}
          intensity={intensity}
          castShadow
          color="#ffffee"
          decay={2}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <primitive object={sceneBase.clone()} position={[0, 0, 0]} scale={1} />

        <primitive
          object={sceneLamp.clone()}
          position={[0, 0, 0]}
          scale={1}
          rotation={lampRotation}
        />
      </group>

      <object3D ref={spotLightTarget} position={targetPosition} />
    </>
  );
}
