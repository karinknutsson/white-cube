import { CubeCamera, Environment } from "@react-three/drei";
import TheRoom from "./TheRoom";

export default function Gallery() {
  const roomWidth = 7;
  const roomHeight = 3.2;
  const roomDepth = 9;

  return (
    <>
      {/* Environment map */}
      <CubeCamera resolution={256}>
        {(texture) => {
          return (
            <>
              {" "}
              <Environment map={texture} />
              {/* Metallic sphere for testing */}
              {/* <RigidBody type="dynamic" colliders="ball" restitution={1}>
                <mesh position={[0, 3, 3]}>
                  <octahedronGeometry args={[0.5, 50]} />
                  <meshStandardMaterial
                    color="grey"
                    roughness={0}
                    metalness={1}
                  />
                </mesh>
              </RigidBody> */}
            </>
          );
        }}
      </CubeCamera>

      {/* Room mesh */}
      <TheRoom
        // size={[roomWidth, roomHeight, roomDepth]}
        roomWidth={roomWidth}
        roomHeight={roomHeight}
        roomDepth={roomDepth}
        wallThickness={0.1}
        position={[0, 0, 0]}
      />
    </>
  );
}
