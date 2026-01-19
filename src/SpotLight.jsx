import { SpotLightHelper } from "three";
import { useHelper, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
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
  const spotLightRef = useRef();
  const spotLightTargetRef = useRef();
  const lampRef = useRef();

  useHelper(spotLightRef, SpotLightHelper, "cyan");

  const { scene: sceneBase } = useGLTF(
    "./models/spotlight-model-flexi-base.glb",
  );
  const { scene: sceneLamp } = useGLTF(
    "./models/spotlight-model-flexi-lamp.glb",
  );

  useEffect(() => {
    if (!lampRef.current || !position || !targetPosition) return;

    const positionVector = new THREE.Vector3(...position);
    const targetPositionVector = new THREE.Vector3(...targetPosition);

    const direction = new THREE.Vector3()
      .subVectors(targetPositionVector, positionVector)
      .normalize();

    const lampForward = new THREE.Vector3(0, -1, 0);
    const quaternion = new THREE.Quaternion();

    if (lampForward.clone().dot(direction) < -0.9999) {
      quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    } else {
      quaternion.setFromUnitVectors(lampForward, direction);
    }

    lampRef.current.quaternion.copy(quaternion);

    if (spotLightRef.current && spotLightTargetRef.current) {
      spotLightRef.current.target = spotLightTargetRef.current;

      const currentPosition = new THREE.Vector3(0, 0, 0);
      const distance = direction.length();
      const step = 0.1;
      const newPosition = currentPosition
        .clone()
        .add(direction.multiplyScalar(Math.min(step, distance)));

      spotLightRef.current.position.copy(newPosition);
    }
  }, [position, targetPosition]);

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
  }, []);

  return (
    <>
      <group position={position} rotation={rotation}>
        <spotLight
          ref={spotLightRef}
          // position={[0, -0.1, -0.04]}
          position={[0, 0, 0]}
          angle={dispersionAngle}
          penumbra={1}
          intensity={intensity}
          castShadow
          color="#ffffee"
          decay={2}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <primitive object={sceneBase.clone()} />

        <primitive ref={lampRef} object={sceneLamp.clone()} />
      </group>

      <object3D ref={spotLightTargetRef} position={targetPosition} />

      <mesh position={targetPosition}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshNormalMaterial />
      </mesh>
    </>
  );
}
