import { CubeCamera, Environment } from "@react-three/drei";
import RoomMesh from "./RoomMesh";

export default function RoomScene() {
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
      <RoomMesh size={[7, 3.2, 9]} position={[0, 0, 0]} />
    </>
  );
}
