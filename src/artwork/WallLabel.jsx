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
      <meshStandardMaterial color="#f5f4f2" />
      <Text
        font="./fonts/IBMPlexSans-SemiBold.woff"
        position={[
          0.016 - size[0] * 0.5,
          size[1] * 0.5 - 0.02,
          size[2] + 0.001,
        ]}
        fontSize={0.016}
        color="black"
        anchorX="left"
        anchorY="top"
      >
        {artist}
      </Text>
      <Text
        font="./fonts/IBMPlexSans-Italic.woff"
        position={[
          0.016 - size[0] * 0.5,
          size[1] * 0.5 - 0.05,
          size[2] + 0.001,
        ]}
        fontSize={0.016}
        color="black"
        anchorX="left"
        anchorY="top"
      >
        {title}
      </Text>

      <Text
        font="./fonts/IBMPlexSans-Regular.woff"
        position={[
          0.016 - size[0] * 0.5,
          size[1] * 0.5 - 0.08,
          size[2] + 0.001,
        ]}
        fontSize={0.013}
        color="black"
        anchorX="left"
        anchorY="top"
      >
        {year}
      </Text>
    </mesh>
  );
}
