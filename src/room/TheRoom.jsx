import { CubeCamera, Environment } from "@react-three/drei";
import RoomMeshes from "./RoomMeshes";

export default function TheRoom() {
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
      <RoomMeshes
        size={[roomWidth, roomHeight, roomDepth]}
        position={[0, 0, 0]}
      />
    </>
  );
}
