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
  angle,
  rotation,
}) {
  const spotLight = useRef();
  const spotLightTarget = useRef();
  const spotLightHelper = useRef();

  useHelper(spotLight, SpotLightHelper, "cyan");

  const { scene } = useGLTF("./models/spotlight-model.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.material = lampMaterial;
      }
    });

    if (spotLight.current && spotLightTarget.current)
      spotLight.current.target = spotLightTarget.current;
  }, []);

  return (
    <>
      <group position={position}>
        <spotLight
          ref={spotLight}
          position={[0.04, -0.12, -0.07]}
          angle={angle}
          penumbra={1}
          intensity={intensity}
          castShadow
          color="#ffffee"
          decay={2}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <primitive
          object={scene}
          position={[0, 0, 0]}
          rotation={rotation}
          scale={1}
        />
      </group>

      <object3D ref={spotLightTarget} position={targetPosition} />
    </>
  );
}
