import CanvasMesh from "./CanvasMesh";
import ArtworkInfoMesh from "./ArtworkInfoMesh";
import { useState } from "react";
import { PivotControls } from "@react-three/drei";

export default function Artwork({
  position,
  rotation,
  type,
  path,
  size,
  title,
  artist,
  year,
}) {
  // const [position, setPosition] = useState(startPosition || [0, 1.6, 0]);

  return (
    // <PivotControls anchor={[0.5, 0.5, 0]}>
    <group position={position} rotation={rotation}>
      {type === "canvas" && <CanvasMesh path={path} size={size} />}
      <ArtworkInfoMesh title={title} artist={artist} year={year} />
    </group>
    // </PivotControls>
  );
}
