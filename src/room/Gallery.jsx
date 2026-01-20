import { CubeCamera, Environment } from "@react-three/drei";
import TheRoom from "./TheRoom";

export default function Gallery() {
  const roomWidth = 7;
  const roomHeight = 3.2;
  const roomDepth = 9;

  return (
    <>
      {/* Environment map */}
      <CubeCamera resolution={256} />

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
