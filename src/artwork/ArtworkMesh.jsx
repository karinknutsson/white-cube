import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function ArtworkMesh({ path, size }) {
  const texture = useLoader(THREE.TextureLoader, path);

  return (
    <mesh position={[0, 1, 0]}>
      <boxGeometry args={size} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
