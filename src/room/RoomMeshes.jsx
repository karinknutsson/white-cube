import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useControls } from "leva";
import useGallery from "../stores/useGallery";
import { useThree, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useRef, useMemo, useState, useImperativeHandle } from "react";
import Artwork from "../artwork/Artwork";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const wallThickness = 0.1;

const roomMaterial = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  // wireframe: true,
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

export function BackWallMesh({
  ref,
  width,
  height,
  depth,
  works,
  handleEnterGrabArea,
  handleLeaveGrabArea,
}) {
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
        <group position={[0, 0, wallThickness * 0.5 + 0.0001]}>
          {works.map((work) => {
            if (!work.position) return null;

            return (
              <Artwork
                key={work.id}
                id={work.id}
                position={[
                  work.position.x,
                  work.position.y,
                  Math.random() * 0.001,
                ]}
                type="canvas"
                path={work.path}
                size={work.size}
                artist={work.artist}
                title={work.title}
                year={work.year}
                onEnterGrabArea={() => handleEnterGrabArea(work.id)}
                onLeaveGrabArea={() => handleLeaveGrabArea()}
              ></Artwork>
            );
          })}
        </group>
      </RigidBody>
    </>
  );
}

export function LeftWallMesh({
  ref,
  width,
  height,
  depth,
  works,
  handleEnterGrabArea,
  handleLeaveGrabArea,
}) {
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
      <group position={[0, 0, wallThickness * 0.5 + 0.0001]}>
        {works.map((work) => {
          if (!work.position) return null;

          return (
            <Artwork
              key={work.id}
              id={work.id}
              position={[
                work.position.x,
                work.position.y,
                Math.random() * 0.001,
              ]}
              type="canvas"
              path={work.path}
              size={work.size}
              artist={work.artist}
              title={work.title}
              year={work.year}
              onEnterGrabArea={() => handleEnterGrabArea(work.id)}
              onLeaveGrabArea={() => handleLeaveGrabArea()}
            ></Artwork>
          );
        })}
      </group>
    </RigidBody>
  );
}

export function RightWallMesh({
  ref,
  width,
  height,
  depth,
  works,
  handleEnterGrabArea,
  handleLeaveGrabArea,
}) {
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
        onEnterGrabArea={() => handleEnterGrabArea(work.id)}
        onLeaveGrabArea={() => handleLeaveGrabArea()}
      ></mesh>
      <group position={[0, 0, wallThickness * 0.5 + 0.0001]}>
        {works.map((work) => {
          if (!work.position) return null;

          return (
            <Artwork
              key={work.id}
              id={work.id}
              position={[
                work.position.x,
                work.position.y,
                Math.random() * 0.001,
              ]}
              type="canvas"
              path={work.path}
              size={work.size}
              artist={work.artist}
              title={work.title}
              year={work.year}
              onEnterGrabArea={() => handleEnterGrabArea(work.id)}
              onLeaveGrabArea={() => handleLeaveGrabArea()}
            ></Artwork>
          );
        })}
      </group>
    </RigidBody>
  );
}

export function PartitionMesh({
  ref,
  width,
  height,
  depth,
  position,
  worksFront,
  worksBack,
  handleEnterGrabArea,
  handleLeaveGrabArea,
}) {
  const frontRef = useRef();
  const backRef = useRef();

  useImperativeHandle(ref, () => ({
    front: frontRef.current,
    back: backRef.current,
  }));

  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      <CuboidCollider args={[width * 0.5, height * 0.5, depth * 0.5]} />
      <mesh
        ref={frontRef}
        name="partitionFront"
        geometry={boxGeometry}
        material={roomMaterial}
        scale={[width, height, depth * 0.5]}
        receiveShadow
        position={[0, 0, depth * 0.25]}
      />
      <mesh
        ref={backRef}
        name="partitionBack"
        geometry={boxGeometry}
        material={roomMaterial}
        scale={[width, height, depth * 0.5]}
        receiveShadow
        position={[0, 0, -depth * 0.25]}
      />
      <group position={[0, 0, depth * 0.5 + 0.0001]}>
        {worksFront.map((work) => {
          if (!work.position) return null;

          return (
            <Artwork
              key={work.id}
              id={work.id}
              position={[work.position.x, work.position.y, 0]}
              type="canvas"
              path={work.path}
              size={work.size}
              artist={work.artist}
              title={work.title}
              year={work.year}
              onEnterGrabArea={() => handleEnterGrabArea(work.id)}
              onLeaveGrabArea={() => handleLeaveGrabArea()}
            ></Artwork>
          );
        })}
      </group>

      <group
        position={[0, 0, -depth * 0.5 + 0.0001]}
        rotation={[0, Math.PI, 0]}
      >
        {worksBack.map((work) => {
          if (!work.position) return null;

          return (
            <Artwork
              key={work.id}
              id={work.id}
              position={[work.position.x, work.position.y, 0]}
              type="canvas"
              path={work.path}
              size={work.size}
              artist={work.artist}
              title={work.title}
              year={work.year}
              onEnterGrabArea={() => handleEnterGrabArea(work.id)}
              onLeaveGrabArea={() => handleLeaveGrabArea()}
            ></Artwork>
          );
        })}
      </group>
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
  const grabAreaId = useRef(null);
  const [grabbedWorkId, setGrabbedWorkId] = useState(null);

  const artworks = useGallery((state) => state.artworks);
  const moveArtwork = useGallery((state) => state.moveArtwork);

  const wallRefs = useRef({
    left: null,
    right: null,
    back: null,
    partition: null,
  });

  function handleDrop() {
    gsap.to("#grabbed-artwork-container", { duration: 0.5, opacity: 0 });
    gsap.to(".drop-hint-container", { duration: 0.1, opacity: 0 });

    const wallsArray = [];

    for (const wall of Object.values(wallRefs.current)) {
      if (!wall) continue;

      if (wall.isObject3D) {
        wallsArray.push(wall);
      } else if (wall.front || wall.back) {
        wall.front && wallsArray.push(wall.front);
        wall.back && wallsArray.push(wall.back);
      }
    }

    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const hits = raycaster.intersectObjects(wallsArray, false);
    if (hits.length === 0) return;
    console.log(hits[0].object.name);

    if (hits[0].object.name === "backWall") {
      moveArtwork(grabAreaId.current, {
        wall: "backWall",
        position: {
          x: (hits[0].uv.x - 0.5) * size[0],
          y: (hits[0].uv.y - 0.5) * size[1],
          z: Math.random() * 0.001,
        },
      });
    } else if (hits[0].object.name === "leftWall") {
      moveArtwork(grabAreaId.current, {
        wall: "leftWall",
        position: {
          x: (hits[0].uv.x - 0.5) * size[2],
          y: (hits[0].uv.y - 0.5) * size[1],
          z: Math.random() * 0.001,
        },
      });
    } else if (hits[0].object.name === "rightWall") {
      moveArtwork(grabAreaId.current, {
        wall: "rightWall",
        position: {
          x: (hits[0].uv.x - 0.5) * size[2],
          y: (hits[0].uv.y - 0.5) * size[1],
          z: Math.random() * 0.001,
        },
      });
    } else if (hits[0].object.name === "partitionFront") {
      console.log(hits[0].uv.x, hits[0].uv.y);
      moveArtwork(grabAreaId.current, {
        wall: "partitionFront",
        position: {
          x: (hits[0].uv.x - 0.5) * size[0],
          y: (hits[0].uv.y - 0.5) * size[1],
          z: Math.random() * 0.001,
        },
      });
    } else if (hits[0].object.name === "partitionBack") {
      console.log(hits[0].uv.x, hits[0].uv.y);
      moveArtwork(grabAreaId.current, {
        wall: "partitionBack",
        position: {
          x: (hits[0].uv.x - 0.5) * size[0],
          y: (hits[0].uv.y - 0.5) * size[1],
          z: Math.random() * 0.001,
        },
      });
    }

    grabAreaId.current = null;
    setGrabbedWorkId(null);
    window.removeEventListener("mousedown", handleDrop);
  }

  function handleGrab() {
    setGrabbedWorkId(grabAreaId.current);
    window.removeEventListener("mousedown", handleGrab);
    window.addEventListener("mousedown", handleDrop);
    gsap.to(".grab-hint-container", { duration: 0.1, opacity: 0 });
    gsap.to(".drop-hint-container", { duration: 0.1, opacity: 1 });
    const image = document.getElementById("grabbed-image");
    const work = artworks.filter((w) => w.id === grabAreaId.current);
    image.src = work[0].path ?? "";
    gsap.to("#grabbed-artwork-container", { duration: 0.5, opacity: 0.6 });
  }

  function handleEnterGrabArea(id) {
    grabAreaId.current = id;
    window.addEventListener("mousedown", handleGrab);
    gsap.to(".grab-hint-container", { duration: 0.1, opacity: 1 });
  }

  function handleLeaveGrabArea() {
    grabAreaId.current = null;
    window.removeEventListener("mousedown", handleGrab);
    gsap.to(".grab-hint-container", { duration: 0.1, opacity: 0 });
  }

  return (
    <group position={position}>
      <BackWallMesh
        ref={(el) => (wallRefs.current.back = el)}
        width={size[0]}
        height={size[1]}
        depth={size[2]}
        works={artworks.filter(
          (w) => w.id !== grabbedWorkId && w.wall === "backWall"
        )}
        handleEnterGrabArea={handleEnterGrabArea}
        handleLeaveGrabArea={handleLeaveGrabArea}
      />

      <LeftWallMesh
        ref={(el) => (wallRefs.current.left = el)}
        width={size[0]}
        height={size[1]}
        depth={size[2]}
        works={artworks.filter(
          (w) => w.id !== grabbedWorkId && w.wall === "leftWall"
        )}
        handleEnterGrabArea={handleEnterGrabArea}
        handleLeaveGrabArea={handleLeaveGrabArea}
      />

      <RightWallMesh
        ref={(el) => (wallRefs.current.right = el)}
        width={size[0]}
        height={size[1]}
        depth={size[2]}
        works={artworks.filter(
          (w) => w.id !== grabbedWorkId && w.wall === "rightWall"
        )}
        handleEnterGrabArea={handleEnterGrabArea}
        handleLeaveGrabArea={handleLeaveGrabArea}
      />

      <PartitionMesh
        ref={(el) => (wallRefs.current.partition = el)}
        width={size[0] - 2.6}
        height={size[1]}
        depth={0.2}
        position={[0, size[1] * 0.5, 0]}
        worksFront={artworks.filter(
          (w) => w.id !== grabbedWorkId && w.wall === "partitionFront"
        )}
        worksBack={artworks.filter(
          (w) => w.id !== grabbedWorkId && w.wall === "partitionBack"
        )}
        handleEnterGrabArea={handleEnterGrabArea}
        handleLeaveGrabArea={handleLeaveGrabArea}
      />

      <FloorMesh width={size[0]} depth={size[2]} />

      <CeilingMesh width={size[0]} depth={size[2]} position={[0, size[1], 0]} />

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
