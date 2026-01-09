import CanvasMesh from "./CanvasMesh";
import ArtworkInfoMesh from "./ArtworkInfoMesh";

export default function Artwork({ type, path, size, title, artist, year }) {
  return (
    <>
      {type === "canvas" && <CanvasMesh path={path} size={size} />}
      <ArtworkInfoMesh title={title} artist={artist} year={year} />
    </>
  );
}
