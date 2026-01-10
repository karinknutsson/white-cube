import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

const roomMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" });
const planeGeometry = new THREE.PlaneGeometry(1, 1);
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

export function FloorMesh({ width, depth }) {
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh
        geometry={planeGeometry}
        material={roomMaterial}
        rotation={[-Math.PI * 0.5, 0, 0]}
        scale={[width, depth, 1]}
      ></mesh>
    </RigidBody>
  );
}

export function CeilingMesh({ width, depth, position }) {
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh
        geometry={planeGeometry}
        material={roomMaterial}
        rotation={[Math.PI * 0.5, 0, 0]}
        scale={[width, depth, 1]}
        position={position}
      ></mesh>
    </RigidBody>
  );
}

export function BackWallMesh({ width, height, depth }) {
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh
        geometry={planeGeometry}
        material={roomMaterial}
        scale={[width, height, 1]}
        position={[0, height * 0.5, -depth * 0.5]}
      ></mesh>
    </RigidBody>
  );
}

export function LeftWallMesh({ width, height, depth }) {
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh
        geometry={planeGeometry}
        material={roomMaterial}
        scale={[depth, height, 1]}
        rotation={[0, Math.PI * 0.5, 0]}
        position={[-width * 0.5, height * 0.5, 0]}
      ></mesh>
    </RigidBody>
  );
}

export function RightWallMesh({ width, height, depth }) {
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh
        geometry={planeGeometry}
        material={roomMaterial}
        scale={[depth, height, 1]}
        rotation={[0, -Math.PI * 0.5, 0]}
        position={[width * 0.5, height * 0.5, 0]}
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
      ></mesh>
    </RigidBody>
  );
}

export default function RoomMesh({ size, position }) {
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
    </group>
  );
}
