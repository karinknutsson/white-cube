import { useLoader, extend } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry, shaderMaterial } from "@react-three/drei";
import canvasPaintingVertexShader from "../shaders/canvas-painting/vertex.glsl";
import canvasPaintingFragmentShader from "../shaders/canvas-painting/fragment.glsl";

export default function ArtworkMesh({ path, size }) {
  const texture = useLoader(THREE.TextureLoader, path);
  const geometry = new THREE.PlaneGeometry(size[0], size[1], 64, 64);

  const edgeStartX = 1 - 0.02 / size[0];
  const edgeStartY = 1 - 0.02 / size[1];

  const CanvasPaintingMaterial = shaderMaterial(
    {
      uEdgeStartX: edgeStartX,
      uEdgeStartY: edgeStartY,
      uTexture: null,
    },
    canvasPaintingVertexShader,
    canvasPaintingFragmentShader,
  );

  extend({ CanvasPaintingMaterial });

  return (
    <>
      <group position={[0, 0, size[2] * 0.5 + 0.003]}>
        {/* Front face */}
        <mesh position={[0, 0, size[2] + 0.002]} geometry={geometry}>
          <canvasPaintingMaterial
            key={texture.uuid}
            uTexture={texture}
            transparent
          />
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
    </>
  );
}
