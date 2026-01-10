import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useControls } from "leva";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const roomMaterial = new THREE.MeshStandardMaterial({
  color: "#ffffff",
});
const windowMaterial = new THREE.MeshPhysicalMaterial({
  color: "#ffffff",
  roughness: 0,
  transmission: 1,
  transparent: true,
  thickness: 0.02,
  ior: 1.5,
});

export function FloorMesh({ width, depth }) {
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh
        geometry={boxGeometry}
        material={roomMaterial}
        rotation={[-Math.PI * 0.5, 0, 0]}
        scale={[width + 0.1, depth, 0.1]}
        receiveShadow
      ></mesh>
    </RigidBody>
  );
}

export function CeilingMesh({ width, depth, position }) {
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh
        geometry={boxGeometry}
        material={roomMaterial}
        rotation={[Math.PI * 0.5, 0, 0]}
        scale={[width + 0.1, depth, 0.1]}
        position={position}
        castShadow
        receiveShadow
      ></mesh>
    </RigidBody>
  );
}

export function BackWallMesh({ width, height, depth }) {
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh
        geometry={boxGeometry}
        material={roomMaterial}
        scale={[width, height, 0.1]}
        position={[0, height * 0.5, -depth * 0.5]}
        castShadow
        receiveShadow
      ></mesh>
    </RigidBody>
  );
}

export function LeftWallMesh({ width, height, depth }) {
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh
        geometry={boxGeometry}
        material={roomMaterial}
        scale={[depth, height, 0.1]}
        rotation={[0, Math.PI * 0.5, 0]}
        position={[-width * 0.5, height * 0.5, 0]}
        castShadow
        receiveShadow
      ></mesh>
    </RigidBody>
  );
}

export function RightWallMesh({ width, height, depth }) {
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh
        geometry={boxGeometry}
        material={roomMaterial}
        scale={[depth, height, 0.1]}
        rotation={[0, -Math.PI * 0.5, 0]}
        position={[width * 0.5, height * 0.5, 0]}
        castShadow
        receiveShadow
      ></mesh>
    </RigidBody>
  );
}

export function PartitionMesh({ width, height, depth, position }) {
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh
        geometry={boxGeometry}
        material={roomMaterial}
        scale={[width, height, depth]}
        position={position}
        castShadow
        receiveShadow
      ></mesh>
    </RigidBody>
  );
}

export function WindowSeatMesh({ width, height, depth, position }) {
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh
        geometry={boxGeometry}
        material={roomMaterial}
        scale={[width, height, depth]}
        position={position}
        castShadow
        receiveShadow
      ></mesh>
    </RigidBody>
  );
}

export function WindowMesh({ width, height, depth, position }) {
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh
        geometry={boxGeometry}
        material={windowMaterial}
        scale={[width, height, depth]}
        position={position}
      ></mesh>
    </RigidBody>
  );
}

export default function RoomMesh({ size, position }) {
  const { color, roughness } = useControls("material", {
    color: {
      value: "#ffffff",
    },
    roughness: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
  });

  roomMaterial.color = new THREE.Color(color);
  roomMaterial.roughness = roughness;

  return (
    <group position={position}>
      <FloorMesh width={size[0]} depth={size[2]} />

      <CeilingMesh width={size[0]} depth={size[2]} position={[0, size[1], 0]} />

      <BackWallMesh width={size[0]} height={size[1]} depth={size[2]} />

      <LeftWallMesh width={size[0]} height={size[1]} depth={size[2]} />

      <RightWallMesh width={size[0]} height={size[1]} depth={size[2]} />

      <PartitionMesh
        width={size[0] - 2.6}
        height={size[1]}
        depth={0.2}
        position={[0, size[1] * 0.5, 0]}
      />

      <WindowSeatMesh
        width={(size[0] - 1.3) * 0.5}
        height={0.6}
        depth={0.6}
        position={[-(1.3 + size[0]) * 0.25, 0.3, size[2] * 0.5 - 0.3]}
      />

      <WindowSeatMesh
        width={(size[0] - 1.3) * 0.5}
        height={0.6}
        depth={0.6}
        position={[(1.3 + size[0]) * 0.25, 0.3, size[2] * 0.5 - 0.3]}
      />

      <WindowMesh
        width={size[0] + 0.1}
        height={size[1] + 0.1}
        depth={0.02}
        position={[0, size[1] * 0.5, size[2] * 0.5 + 0.01]}
      />
    </group>
  );
}
