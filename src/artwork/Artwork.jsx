import ArtworkMesh from "./ArtworkMesh";
import ArtworkInfoMesh from "./ArtworkInfoMesh";

export default function Artwork({ path, size, title, artist, year }) {
  return (
    <>
      <ArtworkMesh path={path} size={size} />
      <ArtworkInfoMesh title={title} artist={artist} year={year} />
    </>
  );
}
