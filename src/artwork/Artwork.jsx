import CanvasMesh from "./CanvasMesh";
import ArtworkInfoMesh from "./ArtworkInfoMesh";

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
  return (
    <group position={position} rotation={rotation}>
      {type === "canvas" && <CanvasMesh path={path} size={size} />}
      <ArtworkInfoMesh title={title} artist={artist} year={year} />
    </group>
  );
}
