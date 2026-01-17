import { useRef } from "react";
import { SpotLightHelper } from "three";
import { useHelper } from "@react-three/drei";

export default function SpotLight({
  position,
  targetPosition,
  intensity,
  angle,
}) {
  const spotLight = useRef();
  const spotLightTarget = useRef();
  const spotLightHelper = useRef();

  useHelper(spotLight, SpotLightHelper, "cyan");

  return (
    <>
      <spotLight
        ref={spotLight}
        position={position}
        angle={angle}
        penumbra={1}
        intensity={intensity}
        castShadow
        color="#ffffee"
        decay={2}
        onUpdate={(self) => self.lookAt(0, 0, 4)}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <object3D ref={spotLightTarget} position={[0, 1.2, 0]} />
    </>
  );
}
