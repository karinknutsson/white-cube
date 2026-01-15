import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useControls } from "leva";
import useGallery from "../stores/useGallery";
import { useThree, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef, useMemo, use } from "react";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const planeGeometry = new THREE.PlaneGeometry(1, 1);
const wallThickness = 0.1;

const roomMaterial = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  // wireframe: true,
});
const redMaterial = new THREE.MeshStandardMaterial({
  color: "#ff0000",
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
        scale={[width + wallThickness, depth, wallThickness]}
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
        scale={[width + wallThickness, depth, wallThickness]}
        position={position}
        castShadow
        receiveShadow
      ></mesh>
    </RigidBody>
  );
}

export function BackWallMesh({ ref, width, height, depth }) {
  return (
    <>
      <RigidBody
        type="fixed"
        colliders={false}
        position={[0, height * 0.5, -depth * 0.5 + 0.05]}
      >
        <CuboidCollider
          args={[width * 0.5, height * 0.5, wallThickness * 0.5]}
        />
        <mesh
          ref={ref}
          name="backWall"
          geometry={boxGeometry}
          material={roomMaterial}
          scale={[width, height, wallThickness]}
          castShadow
          receiveShadow
        ></mesh>
      </RigidBody>
    </>
  );
}

export function LeftWallMesh({ ref, width, height, depth }) {
  return (
    <RigidBody
      type="fixed"
      colliders={false}
      position={[-width * 0.5, height * 0.5, 0]}
      rotation={[0, Math.PI * 0.5, 0]}
    >
      <CuboidCollider args={[depth * 0.5, height * 0.5, wallThickness * 0.5]} />
      <mesh
        ref={ref}
        name="leftWall"
        geometry={boxGeometry}
        material={roomMaterial}
        scale={[depth, height, wallThickness]}
        castShadow
        receiveShadow
      ></mesh>
    </RigidBody>
  );
}

export function RightWallMesh({ ref, width, height, depth }) {
  return (
    <RigidBody
      type="fixed"
      colliders={false}
      position={[width * 0.5, height * 0.5, 0]}
      rotation={[0, -Math.PI * 0.5, 0]}
    >
      <CuboidCollider args={[depth * 0.5, height * 0.5, wallThickness * 0.5]} />
      <mesh
        ref={ref}
        name="rightWall"
        geometry={boxGeometry}
        material={roomMaterial}
        scale={[depth, height, wallThickness]}
        castShadow
        receiveShadow
      ></mesh>
    </RigidBody>
  );
}

export function PartitionMesh({ ref, width, height, depth, position }) {
  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      <CuboidCollider args={[width * 0.5, height * 0.5, depth * 0.5]} />
      <mesh
        ref={ref}
        geometry={boxGeometry}
        material={roomMaterial}
        scale={[width, height, depth]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={planeGeometry}
        material={redMaterial}
        scale={[width, height, 0]}
        receiveShadow
        position={[0, 0, depth * 0.5 + 0.0001]}
      />
      <mesh
        geometry={planeGeometry}
        material={redMaterial}
        scale={[width, height, 0]}
        receiveShadow
        position={[0, 0, -(depth * 0.5 + 0.0001)]}
        rotation={[0, Math.PI, 0]}
      />
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

export default function RoomMeshes({ size, position }) {
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

  const { camera } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  // const direction = useMemo(() => new THREE.Vector3(), []);
  // const grabbedWorkId = useGallery(state => state.grabbedWorkId);
  const isGrabbingRef = useRef(false);
  const wallRefs = useRef({
    left: null,
    right: null,
    back: null,
    partition: null,
  });

  useEffect(() => {
    const unsubscribe = useGallery.subscribe(
      (state) => state.grabbedWorkId,
      (grabbedWorkId) => {
        isGrabbingRef.current = grabbedWorkId !== null;
      }
    );

    window.addEventListener("mousedown", handleClick);

    return () => {
      unsubscribe();
      window.removeEventListener("mousedown", handleClick);
    };
  }, []);

  function handleClick() {
    if (!isGrabbingRef.current) return;

    const wallsArray = Object.values(wallRefs.current).filter(Boolean);
    if (!wallsArray.length) return;

    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const hits = raycaster.intersectObjects(wallsArray, false);
    if (hits.length === 0) return;

    console.log(hits[0].object.name);
    console.log(hits[0].uv);

    if (hits[0].object.name === "backWall") {
    }

    useGallery.getState().setGrabbedWorkId(null);
  }

  function dropArtworkAtWall(position, rotation) {
    const eulerRotation = new THREE.Euler(
      rotation[0],
      rotation[1],
      rotation[2]
    );
    const quaternionRotation = new THREE.Quaternion();
    quaternionRotation.setFromEuler(eulerRotation);

    const setDropWallPosition = useGallery.getState().setDropWallPosition;
    setDropWallPosition(position);
  }
  2;

  return (
    <group position={position}>
      <FloorMesh width={size[0]} depth={size[2]} />

      <CeilingMesh width={size[0]} depth={size[2]} position={[0, size[1], 0]} />

      <BackWallMesh
        ref={(el) => (wallRefs.current.back = el)}
        width={size[0]}
        height={size[1]}
        depth={size[2]}
        // onIntersection={onIntersection}
      />

      <LeftWallMesh
        ref={(el) => (wallRefs.current.left = el)}
        width={size[0]}
        height={size[1]}
        depth={size[2]}
        // onIntersection={onIntersection}
      />

      <RightWallMesh
        ref={(el) => (wallRefs.current.right = el)}
        width={size[0]}
        height={size[1]}
        depth={size[2]}
        // onIntersection={onIntersection}
      />

      <PartitionMesh
        ref={(el) => (wallRefs.current.partition = el)}
        width={size[0] - 2.6}
        height={size[1]}
        depth={0.2}
        position={[0, size[1] * 0.5, 0]}
        // onIntersection={onIntersection}
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
        width={size[0] + wallThickness}
        height={size[1] + wallThickness}
        depth={0.02}
        position={[0, size[1] * 0.5, size[2] * 0.5 + 0.01]}
      />
    </group>
  );
}
