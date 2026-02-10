import { useGLTF, shaderMaterial } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
import lightSourceVertexShader from "./shaders/light-source/vertex.glsl";
import lightSourceFragmentShader from "./shaders/light-source/fragment.glsl";

/**
 * Material
 */
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

  // Load spotlight model parts
  const { scene: sceneBase } = useGLTF(
    "./models/spotlight-model-flexi-base.glb",
  );
  const { scene: sceneLamp } = useGLTF(
    "./models/spotlight-model-flexi-lamp.glb",
  );

  /**
   * Set up materials and shadows on mount
   */
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

  /**
   *  Update spotlight position and lamp orientation when position or targetPosition changes
   */
  useEffect(() => {
    if (
      !spotLightRef.current ||
      !spotLightTargetRef.current ||
      !lampRef.current
    )
      return;

    // Set spotlight target
    spotLightRef.current.target = spotLightTargetRef.current;

    // Parent the light disc to the lamp for correct positioning
    if (lampRef.current && lightDiscRef.current) {
      lampRef.current.add(lightDiscRef.current);
      lightDiscRef.current.position.set(0, 0, 0.11);
    }

    // Calculate direction from spotlight to target and update spotlight position and lamp orientation
    const positionVector = new THREE.Vector3(...position);
    const targetPositionVector = new THREE.Vector3(...targetPosition);
    const spotLightWorldPosition = new THREE.Vector3();
    spotLightRef.current.getWorldPosition(spotLightWorldPosition);

    // Calculate direction and distance to target
    const direction = new THREE.Vector3()
      .subVectors(targetPositionVector, spotLightWorldPosition)
      .normalize();
    const distance = direction.length();

    // Move spotlight towards target
    const spotLightStep = 0.07;
    const newSpotLightPosition = positionVector
      .clone()
      .add(direction.clone().multiplyScalar(Math.min(spotLightStep, distance)));
    const group = spotLightRef.current.parent;
    group.worldToLocal(newSpotLightPosition);
    spotLightRef.current.position.copy(newSpotLightPosition);

    // Orient lamp to look at target
    lampRef.current.lookAt(targetPositionVector);
  }, [position, targetPosition]);

  return (
    <>
      <group position={position}>
        {/* Spotlight */}
        <spotLight
          ref={spotLightRef}
          angle={dispersionAngle}
          penumbra={1}
          intensity={intensity}
          castShadow
          color="#ffffee"
          decay={2}
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
        />

        {/* Lamp meshes */}
        <primitive object={sceneBase.clone()} />
        <primitive ref={lampRef} object={sceneLamp.clone()} />

        {/* Light disc to visually represent the light source, parented to the lamp for correct positioning */}
        <mesh ref={lightDiscRef}>
          <ringGeometry args={[0, 0.04, 32]} />
          <lightDiscMaterial
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Target object for the spotlight to look at */}
      <object3D ref={spotLightTargetRef} position={targetPosition} />
    </>
  );
}
