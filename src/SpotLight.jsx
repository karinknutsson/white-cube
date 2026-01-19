import { SpotLightHelper } from "three";
import { useHelper, useGLTF, shaderMaterial } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
import lightSourceVertexShader from "./shaders/light-source/vertex.glsl";
import lightSourceFragmentShader from "./shaders/light-source/fragment.glsl";

const lampMaterial = new THREE.MeshStandardMaterial({
  color: "#ffffff",
});

const LightDiscMaterial = shaderMaterial(
  {},
  lightSourceVertexShader,
  lightSourceFragmentShader,
);

extend({ LightDiscMaterial });

export default function SpotLight({
  position,
  targetPosition,
  intensity,
  dispersionAngle,
}) {
  const spotLightRef = useRef();
  const spotLightTargetRef = useRef();
  const lampRef = useRef();
  const lightDiscRef = useRef();

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

    if (lampRef.current && lightDiscRef.current) {
      lampRef.current.add(lightDiscRef.current);
      lightDiscRef.current.position.set(0, 0, 0.11);
    }

    const positionVector = new THREE.Vector3(...position);
    const targetPositionVector = new THREE.Vector3(...targetPosition);
    const spotLightWorldPosition = new THREE.Vector3();
    spotLightRef.current.getWorldPosition(spotLightWorldPosition);

    const direction = new THREE.Vector3()
      .subVectors(targetPositionVector, spotLightWorldPosition)
      .normalize();

    const distance = direction.length();
    const group = spotLightRef.current.parent;

    const spotLightStep = 0.08;
    const newSpotLightPosition = positionVector
      .clone()
      .add(direction.clone().multiplyScalar(Math.min(spotLightStep, distance)));
    group.worldToLocal(newSpotLightPosition);
    spotLightRef.current.position.copy(newSpotLightPosition);

    lampRef.current.lookAt(targetPositionVector);
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

        <mesh ref={lightDiscRef}>
          <ringGeometry args={[0, 0.04, 32]} />
          <lightDiscMaterial
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      <object3D ref={spotLightTargetRef} position={targetPosition} />
    </>
  );
}
