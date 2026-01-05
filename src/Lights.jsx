import { Environment } from "@react-three/drei";

export default function Lights() {
  return (
    <>
      <directionalLight position={[0, 4, 10]} intensity={3} />

      <Environment>
        <mesh
          position={[0, 2, 0]}
          scale={[1, 1, 1]}
          onUpdate={(self) => self.lookAt(0, 0, 0)}
        >
          <planeGeometry />
          <meshBasicMaterial color={[200, 200, 200]} toneMapped={false} />
        </mesh>
      </Environment>

      {/* <rectAreaLight
        position={[1, 3.8, 0]}
        scale={[0.1, 0.001, 0.1]}
        rotation={[-Math.PI * 0.5, 0, 0]}
      /> */}
      {/* <pointLight position={[1, 3.8, 0]} intensity={5} decay={10} /> */}
      <ambientLight intensity={1.5} />
    </>
  );
}
