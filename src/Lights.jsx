import { useRef, useEffect } from "react";

import SpotLight from "./SpotLight";

export default function Lights() {
  const sunLight = useRef();
  const sunLightTarget = useRef();

  const ambientIntensity = 1;
  const sunIntensity = 0.6;
  const spotIntensity = 100;
  const shadowBias = 0.0005;
  const shadowNormalBias = 0.005;

  useEffect(() => {
    if (sunLight.current && sunLightTarget.current)
      sunLight.current.target = sunLightTarget.current;
  }, []);

  return (
    <>
      <ambientLight intensity={ambientIntensity} />

      <directionalLight
        ref={sunLight}
        castShadow
        position={[2, 5, 4]}
        intensity={sunIntensity}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={2}
        shadow-camera-far={20}
        shadow-camera-top={10}
        shadow-camera-right={10}
        shadow-camera-bottom={-10}
        shadow-camera-left={-10}
        shadow-bias={shadowBias}
        shadow-normalBias={shadowNormalBias}
      />
      <object3D ref={sunLightTarget} position={[-0.4, 0.4, 0]} />

      {/* Spotlight on partition front */}
      <SpotLight
        position={[-2, 3.06, 2]}
        targetPosition={[1, 1, 0.2]}
        intensity={spotIntensity}
        angle={0.6}
        rotation={[0, -0.6, 0]}
      />

      {/* Spotlight on partition back */}
      <SpotLight
        position={[1.8, 3.06, -1.4]}
        targetPosition={[-0.6, 1, -0.2]}
        intensity={spotIntensity}
        angle={0.6}
        rotation={[0, Math.PI * 0.9, 0]}
      />

      {/* Spotlight on back wall */}
      <SpotLight
        position={[-3, 3.06, -3]}
        targetPosition={[0, 1.8, -4]}
        intensity={spotIntensity}
        angle={0.6}
        rotation={[0, 0.2, 0]}
      />
    </>
  );
}
