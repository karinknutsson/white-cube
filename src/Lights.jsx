import { useRef, useEffect } from "react";
import { useControls } from "leva";

export default function Lights() {
  const spotLight1 = useRef();
  const target1 = useRef();
  const spotLight2 = useRef();
  const target2 = useRef();

  const { ambientIntensity, sunIntensity, spotIntensity } = useControls(
    "lights",
    {
      ambientIntensity: {
        value: 1,
        min: 0,
        max: 10,
        step: 0.1,
      },
      sunIntensity: {
        value: 0.3,
        min: 0,
        max: 10,
        step: 0.1,
      },
      spotIntensity: {
        value: 30,
        min: 0,
        max: 100,
        step: 1,
      },
    }
  );

  useEffect(() => {
    if (spotLight1.current && target1.current) {
      spotLight1.current.target = target1.current;
    }

    if (spotLight2.current && target2.current) {
      spotLight2.current.target = target2.current;
    }
  }, []);

  return (
    <>
      <ambientLight intensity={ambientIntensity} />

      <directionalLight position={[0, 4, 10]} intensity={sunIntensity} />

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
      />
      <object3D ref={target1} position={[0, 1.2, 0]} />

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
      />

      <object3D ref={target2} position={[0, 1.8, 0]} />
    </>
  );
}
