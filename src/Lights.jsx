import { Environment } from "@react-three/drei";
import { useRef, useEffect } from "react";

export default function Lights() {
  const spotLight1 = useRef();
  const target1 = useRef();
  const spotLight2 = useRef();
  const target2 = useRef();

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
      <directionalLight position={[0, 4, 10]} intensity={1} />

      {/* <Environment>
        <mesh
          position={[0, 2, 0]}
          scale={[1, 1, 1]}
          onUpdate={(self) => self.lookAt(0, 0, 0)}
        >
          <planeGeometry />
          <meshBasicMaterial color={[200, 200, 200]} toneMapped={false} />
        </mesh>
      </Environment> */}

      {/* <rectAreaLight
        position={[1, 3.8, 0]}
        scale={[0.1, 0.001, 0.1]}
        rotation={[-Math.PI * 0.5, 0, 0]}
      /> */}
      {/* <pointLight position={[0, 3.1, 2]} intensity={5} decay={10} /> */}

      <spotLight
        ref={spotLight1}
        position={[-2, 3.06, 3]}
        angle={0.6}
        penumbra={1}
        intensity={100}
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
        intensity={100}
        castShadow
        color="#ffffee"
        decay={2}
        onUpdate={(self) => self.lookAt(0, 0, 4)}
      />

      <object3D ref={target2} position={[0, 1.8, 0]} />

      <ambientLight intensity={1} />
    </>
  );
}
