import { useRef, useEffect } from "react";
// import { useControls } from "leva";
import { BakeShadows } from "@react-three/drei";
import { CameraHelper } from "three";
import { useHelper } from "@react-three/drei";
import { SpotLightHelper } from "three";
import SpotLight from "./SpotLight";

export default function Lights() {
  const sunLight = useRef();
  const sunLightTarget = useRef();

  const ambientIntensity = 2;
  const sunIntensity = 1;
  const spotIntensity = 100;
  const shadowBias = 0.0005;
  const shadowNormalBias = 0.005;

  useHelper(spotLight1, SpotLightHelper, "cyan");

  // const {
  //   ambientIntensity,
  //   sunIntensity,
  //   spotIntensity,
  //   shadowBias,
  //   shadowNormalBias,
  // } = useControls("lights", {
  //   ambientIntensity: {
  //     value: 2,
  //     min: 0,
  //     max: 10,
  //     step: 0.1,
  //   },
  //   sunIntensity: {
  //     value: 1,
  //     min: 0,
  //     max: 10,
  //     step: 0.1,
  //   },
  //   spotIntensity: {
  //     value: 30,
  //     min: 0,
  //     max: 100,
  //     step: 1,
  //   },
  //   shadowBias: {
  //     value: 0.0005,
  //     min: -0.01,
  //     max: 0.01,
  //     step: 0.0001,
  //   },
  //   shadowNormalBias: {
  //     value: 0.005,
  //     min: 0,
  //     max: 1,
  //     step: 0.01,
  //   },
  // });

  useEffect(() => {
    if (sunLight.current && sunLightTarget.current)
      sunLight.current.target = sunLightTarget.current;

    if (spotLight1.current && spotLight1Target.current)
      spotLight1.current.target = spotLight1Target.current;

    // if (spotLight1.current) {
    //   spotLight1Helper.current = new CameraHelper(
    //     spotLight1.current.shadow.camera,
    //   );
    //   spotLight1.current.add(spotLight1Helper.current);
    // }

    if (spotLight2.current && spotLight2Target.current)
      spotLight2.current.target = spotLight2Target.current;
  }, []);

  return (
    <>
      <BakeShadows />

      {/* <SoftShadows size={10} samples={50} focus={0} /> */}

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

      <spotLight
        ref={spotLight1}
        position={[-2, 3.06, 3]}
        angle={0.6}
        penumbra={1}
        intensity={spotIntensity}
        castShadow
        color="#ffffee"
        decay={2}
        onUpdate={(self) => self.lookAt(0, 0, 4)}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <object3D ref={spotLight1Target} position={[0, 1.2, 0]} />

      <spotLight
        ref={spotLight2}
        position={[0, 3.06, -3]}
        angle={0.6}
        penumbra={1}
        intensity={spotIntensity}
        castShadow
        color="#ffffee"
        decay={2}
        onUpdate={(self) => self.lookAt(0, 0, 4)}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <object3D ref={spotLight2Target} position={[0, 1.8, 0]} />
    </>
  );
}
