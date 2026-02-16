import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "@react-three/drei";

export default function CanvasMesh({ path, size, id }) {
  // Load texture
  const texture = useLoader(THREE.TextureLoader, path);

  // Create plane geometry for the canvas
  const geometry = new THREE.PlaneGeometry(
    size[0] - 0.01,
    size[1] - 0.01,
    1,
    1,
  );

  return (
    <>
      <group position={[0, 0, size[2] * 0.5 + 0.003]}>
        {/* Front face mesh */}
        <mesh
          position={[0, 0, size[2] + 0.0001]}
          geometry={geometry}
          receiveShadow
        >
          <meshStandardMaterial map={texture} />
        </mesh>

        {/* Invisible mesh for raycasting */}
        <mesh name={`artwork${id}`}>
          <boxGeometry args={[size[0], size[1], size[2] * 3]} />
          <meshBasicMaterial visible={false} />
        </mesh>

        {/* Back part */}
        <mesh position={[0, 0, size[2] - 0.01]} receiveShadow>
          <RoundedBoxGeometry
            args={[size[0], size[1], size[2]]}
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
