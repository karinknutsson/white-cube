import { SpotLightHelper } from "three";
import { useHelper, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const lampMaterial = new THREE.MeshStandardMaterial({
  color: "#ffffff",
});

export default function SpotLight({
  position,
  targetPosition,
  intensity,
  dispersionAngle,
}) {
  const spotLightRef = useRef();
  const spotLightTargetRef = useRef();
  const lampRef = useRef();
  const lampRingRef = useRef();

  useHelper(spotLightRef, SpotLightHelper, "cyan");

  const { scene: sceneBase } = useGLTF(
    "./models/spotlight-model-flexi-base.glb",
  );
  const { scene: sceneLamp } = useGLTF(
    "./models/spotlight-model-flexi-lamp.glb",
  );

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

  useEffect(() => {
    if (
      !spotLightRef.current ||
      !spotLightTargetRef.current ||
      !lampRef.current
    )
      return;
    spotLightRef.current.target = spotLightTargetRef.current;

    const positionVector = new THREE.Vector3(...position);
    const targetPositionVector = new THREE.Vector3(...targetPosition);
    const spotLightWorldPosition = new THREE.Vector3();
    spotLightRef.current.getWorldPosition(spotLightWorldPosition);

    const direction = new THREE.Vector3()
      .subVectors(targetPositionVector, spotLightWorldPosition)
      .normalize();

    const distance = direction.length();
    const step = 0.02;

    const newWorldPosition = positionVector
      .clone()
      .add(direction.multiplyScalar(Math.min(step, distance)));
    const group = spotLightRef.current.parent;
    group.worldToLocal(newWorldPosition);
    spotLightRef.current.position.copy(newWorldPosition);

    lampRef.current.lookAt(targetPositionVector);
    lampRingRef.current.lookAt(targetPositionVector);
  }, [position, targetPosition]);

  return (
    <>
      <group position={position}>
        <spotLight
          ref={spotLightRef}
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

        <mesh ref={lampRingRef} rotation={[Math.PI * 0.5, 0, 0]}>
          <ringGeometry args={[0, 0.1, 16]} />
          <meshStandardMaterial color={"#ff0000"} />
        </mesh>
      </group>

      <object3D ref={spotLightTargetRef} position={targetPosition} />
    </>
  );
}
