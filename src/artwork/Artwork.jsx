import CanvasMesh from "./CanvasMesh";
import ArtworkInfoMesh from "./ArtworkInfoMesh";

export default function Artwork({ type, path, size, title, artist, year }) {
  const position = [0, 1, 0];

  return (
    <group position={position}>
      {type === "canvas" && <CanvasMesh path={path} size={size} />}
      <ArtworkInfoMesh title={title} artist={artist} year={year} />
    </group>
  );
}
