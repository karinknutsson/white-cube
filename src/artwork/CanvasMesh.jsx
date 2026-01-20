import { useLoader, extend } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry, shaderMaterial } from "@react-three/drei";
import canvasPaintingVertexShader from "../shaders/canvas-painting/vertex.glsl";
import canvasPaintingFragmentShader from "../shaders/canvas-painting/fragment.glsl";

const CanvasPaintingMaterial = shaderMaterial(
  {},
  canvasPaintingVertexShader,
  canvasPaintingFragmentShader,
);

extend({ CanvasPaintingMaterial });

export default function ArtworkMesh({ path, size }) {
  const texture = useLoader(THREE.TextureLoader, path);

  return (
    <group position={[0, 0, size[2] * 0.5 + 0.003]}>
      <mesh position={[0, 0, 1]}>
        <planeGeometry args={[size[0], size[1]]} />
        <canvasPaintingMaterial />
      </mesh>
      {/* Front face */}
      <mesh position={[0, 0, size[2]]}>
        <planeGeometry args={[size[0], size[1]]} />
        <meshStandardMaterial map={texture} receiveShadow />
      </mesh>

      {/* Back part */}
      <mesh position={[0, 0, size[2] - 0.01]}>
        <RoundedBoxGeometry
          args={[size[0], size[1], size[2]]}
          radius={0.005}
          steps={5}
          smoothness={7}
          bevelSegments={10}
        />
        <meshStandardMaterial color="#b9aa91" receiveShadow />
      </mesh>
    </group>
  );
}
