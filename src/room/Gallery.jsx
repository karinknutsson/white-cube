import { CubeCamera } from "@react-three/drei";
import TheRoom from "./TheRoom";

export default function Gallery({
  roomWidth,
  roomHeight,
  roomDepth,
  wallThickness,
}) {
  return (
    <>
      {/* Environment map */}
      <CubeCamera resolution={256} />

      {/* Room mesh */}
      <TheRoom
        roomWidth={roomWidth}
        roomHeight={roomHeight}
        roomDepth={roomDepth}
        wallThickness={wallThickness}
        position={[0, 0, 0]}
        doorWidth={1.2}
        doorHeight={2.3}
        windowSeatHeight={0.6}
        windowSeatDepth={0.6}
        windowFrameWidth={0.08}
        windowFrameDepth={0.05}
        doorDepth={0.02}
      />
    </>
  );
}
