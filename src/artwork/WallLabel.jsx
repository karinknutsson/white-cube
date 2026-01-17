import { Text } from "@react-three/drei";

export default function ArtworkInfoMesh({
  size,
  position,
  title,
  artist,
  year,
}) {
  return (
    <mesh castShadow receiveShadow position={position}>
      <boxGeometry args={[size[0], size[1], size[2]]} />
      <meshStandardMaterial color="red" />
      <Text
        font="./fonts/IBMPlexSans-Medium.woff"
        position={[-0.9, 0.2, 0.06]}
        fontSize={0.06}
        color="black"
        anchorX="left"
        anchorY="top"
      >
        {title}
      </Text>
      <Text
        font="./fonts/IBMPlexSans-Medium.woff"
        position={[-0.9, 0.5, 0.001]}
        fontSize={0.06}
        color="black"
        anchorX="left"
        anchorY="top"
      >
        {artist}

        {year}
      </Text>
    </mesh>
  );
}
