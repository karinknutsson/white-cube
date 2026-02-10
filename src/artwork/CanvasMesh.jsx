import { useLoader, extend } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry, shaderMaterial } from "@react-three/drei";
import canvasPaintingVertexShader from "../shaders/canvas-painting/vertex.glsl";
import canvasPaintingFragmentShader from "../shaders/canvas-painting/fragment.glsl";

export default function CanvasMesh({ path, size, id }) {
  const texture = useLoader(THREE.TextureLoader, path);

  const verticesX = Math.round(size[0] * 100);
  const verticesY = Math.round(size[1] * 100);

  const geometry = new THREE.PlaneGeometry(
    size[0],
    size[1],
    verticesX,
    verticesY,
  );

  const edgeStartX = 1 - 0.02 / size[0];
  const edgeStartY = 1 - 0.02 / size[1];

  const CanvasPaintingMaterial = shaderMaterial(
    {
      uEdgeStartX: null,
      uEdgeStartY: null,
      uTexture: null,
    },
    canvasPaintingVertexShader,
    canvasPaintingFragmentShader,
  );

  extend({ CanvasPaintingMaterial });

  return (
    <>
      <group position={[0, 0, size[2] * 0.5 + 0.003]}>
        {/* Front face mesh */}
        <mesh
          position={[0, 0, size[2] + 0.002]}
          geometry={geometry}
          castShadow
          receiveShadow
        >
          <canvasPaintingMaterial
            key={texture.uuid}
            uTexture={texture}
            uEdgeStartX={edgeStartX}
            uEdgeStartY={edgeStartY}
            transparent
          />
        </mesh>

        {/* Invisible mesh for raycasting */}
        <mesh name={id}>
          <boxGeometry args={[size[0], size[1], size[2] * 3]} />
          <meshBasicMaterial visible={false} />
        </mesh>

        {/* Back part */}
        <mesh position={[0, 0, size[2] - 0.01]} receiveShadow>
          <RoundedBoxGeometry
            args={[size[0] - 0.001, size[1] - 0.001, size[2]]}
            radius={0.005}
            steps={5}
            smoothness={7}
            bevelSegments={10}
          />
          <meshStandardMaterial color="#b9aa91" />
        </mesh>
      </group>
    </>
  );
}
