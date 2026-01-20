import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import useGallery from "../stores/useGallery";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useRef, useMemo, useState, useEffect, use } from "react";
import Artwork from "../artwork/Artwork";
import { wallLabelSizes } from "../data/wallLabelSizes";
import PaperStack from "../PaperStack";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

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

export function FloorMesh({ width, depth, wallThickness }) {
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

export function CeilingMesh({ width, depth, wallThickness, position }) {
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

export function WallMesh({
  ref,
  name,
  width,
  height,
  depth,
  wallThickness,
  position,
  rotation,
  works,
  handleEnterGrabArea,
  handleLeaveGrabArea,
}) {
  return (
    <>
      <RigidBody
        type="fixed"
        colliders={false}
        position={position}
        rotation={rotation}
      >
        <CuboidCollider
          args={[width * 0.5, height * 0.5, wallThickness * 0.5]}
        />
        <mesh
          ref={ref}
          name={name}
          geometry={boxGeometry}
          material={roomMaterial}
          scale={[width, height, depth]}
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

export default function TheRoom({
  roomWidth,
  roomHeight,
  roomDepth,
  wallThickness,
  position,
}) {
  const { camera } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  const grabAreaId = useRef(null);
  const [grabbedWorkId, setGrabbedWorkId] = useState(null);

  const artworks = useGallery((state) => state.artworks);
  const moveArtwork = useGallery((state) => state.moveArtwork);

  const wallRefs = useRef([]);

  const handleDropRef = useRef(null);
  const handleGrabRef = useRef(null);

  const handleHideInfoRef = useRef(null);
  const handleShowInfoRef = useRef(null);

  const isInfoVisible = useRef(false);

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  useEffect(() => {
    handleDropRef.current = (e) => {
      {
        gsap.to("#grabbed-artwork-container", { duration: 0.5, opacity: 0 });
        gsap.to(".drop-hint-container", { duration: 0.1, opacity: 0 });

        if (!wallRefs.current.length) return;

        const artwork = artworks.filter((w) => w.id === grabAreaId.current);
        if (artwork.length === 0) return;

        const artworkWidth = artwork[0].size[0];
        const artworkHeight = artwork[0].size[1];

        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        const hits = raycaster.intersectObjects(wallRefs.current, false);

        if (hits.length === 0) {
          cancelDrop();
          return;
        }

        if (hits[0].object.name === "backWall") {
          moveArtwork(grabAreaId.current, {
            wall: "backWall",
            position: {
              x: clamp(
                (hits[0].uv.x - 0.5) * roomWidth,
                (artworkWidth - roomWidth) * 0.5 +
                  wallLabelSizes.width +
                  wallLabelSizes.distanceFromArtwork * 2,
                (roomWidth - artworkWidth) * 0.5,
              ),
              y: clamp(
                (hits[0].uv.y - 0.5) * roomHeight,
                (artworkHeight - roomHeight) * 0.5,
                (roomHeight - artworkHeight) * 0.5,
              ),
              z: Math.random() * 0.001,
            },
          });
        } else if (hits[0].object.name === "leftWall") {
          moveArtwork(grabAreaId.current, {
            wall: "leftWall",
            position: {
              x: clamp(
                (hits[0].uv.x - 0.5) * roomDepth,
                (artworkWidth - roomDepth) * 0.5 +
                  wallLabelSizes.width +
                  wallLabelSizes.distanceFromArtwork * 2,
                (roomDepth - artworkWidth) * 0.5,
              ),
              y: clamp(
                (hits[0].uv.y - 0.5) * roomHeight,
                (artworkHeight - roomHeight) * 0.5,
                (roomHeight - artworkHeight) * 0.5,
              ),
              z: Math.random() * 0.001,
            },
          });
        } else if (hits[0].object.name === "rightWall") {
          moveArtwork(grabAreaId.current, {
            wall: "rightWall",
            position: {
              x: clamp(
                (hits[0].uv.x - 0.5) * roomDepth,
                (artworkWidth - roomDepth) * 0.5 +
                  wallLabelSizes.width +
                  wallLabelSizes.distanceFromArtwork * 3,
                (roomDepth - artworkWidth) * 0.5,
              ),
              y: clamp(
                (hits[0].uv.y - 0.5) * roomHeight,
                (artworkHeight - roomHeight) * 0.5,
                (roomHeight - artworkHeight) * 0.5,
              ),
              z: Math.random() * 0.001,
            },
          });
        } else if (hits[0].object.name === "partitionBack") {
          moveArtwork(grabAreaId.current, {
            wall: "partitionBack",
            position: {
              x: clamp(
                (hits[0].uv.x - 0.5) * (roomWidth - 2.6),
                (artworkWidth - roomWidth + 2.6) * 0.5 +
                  wallLabelSizes.width +
                  wallLabelSizes.distanceFromArtwork * 2,
                (roomWidth - 2.6 - artworkWidth) * 0.5,
              ),
              y: clamp(
                (hits[0].uv.y - 0.5) * roomHeight,
                (artworkHeight - roomHeight) * 0.5,
                (roomHeight - artworkHeight) * 0.5,
              ),
              z: Math.random() * 0.001,
            },
          });
        } else if (hits[0].object.name === "partitionFront") {
          moveArtwork(grabAreaId.current, {
            wall: "partitionFront",
            position: {
              x: clamp(
                (hits[0].uv.x - 0.5) * (roomWidth - 2.6),
                (artworkWidth - roomWidth + 2.6) * 0.5 +
                  wallLabelSizes.width +
                  wallLabelSizes.distanceFromArtwork * 2,
                (roomWidth - 2.6 - artworkWidth) * 0.5,
              ),
              y: clamp(
                (hits[0].uv.y - 0.5) * roomHeight,
                (artworkHeight - roomHeight) * 0.5,
                (roomHeight - artworkHeight) * 0.5,
              ),
              z: Math.random() * 0.001,
            },
          });
        }

        window.removeEventListener("mousedown", handleDropRef.current);
        setGrabbedWorkId(() => null);
        grabAreaId.current = null;
      }
    };

    handleGrabRef.current = (e) => {
      setGrabbedWorkId(grabAreaId.current);
      window.removeEventListener("mousedown", handleGrabRef.current);
      window.addEventListener("mousedown", handleDropRef.current);

      gsap.to(".grab-hint-container", { duration: 0.1, opacity: 0 });
      gsap.to(".drop-hint-container", { duration: 0.1, opacity: 1 });

      const work = artworks.find((w) => w.id === grabAreaId.current);
      if (!work) return;

      const image = document.getElementById("grabbed-image");
      image.src = work.path ?? "";
      gsap.to("#grabbed-artwork-container", { duration: 0.5, opacity: 0.6 });
    };

    handleShowInfoRef.current = (e) => {
      isInfoVisible.current = true;

      window.removeEventListener("mousedown", handleShowInfoRef.current);
      window.addEventListener("mousedown", handleHideInfoRef.current);

      gsap.to("#info-container", { duration: 0.1, opacity: 1 });
      gsap.to(".show-info-hint-container", { duration: 0.1, opacity: 0 });
      gsap.to(".hide-info-hint-container", { duration: 0.1, opacity: 1 });
    };

    handleHideInfoRef.current = (e) => {
      isInfoVisible.current = false;

      window.removeEventListener("mousedown", handleHideInfoRef.current);

      gsap.to("#info-container", { duration: 0.1, opacity: 0 });
      gsap.to(".hide-info-hint-container", { duration: 0.1, opacity: 0 });
    };
  }, []);

  useEffect(() => {
    if (grabbedWorkId === null) return;

    const handleKeyDown = (e) => {
      if (grabbedWorkId !== null && e.code === "KeyX") {
        cancelDrop();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [grabbedWorkId]);

  function cancelDrop() {
    window.removeEventListener("mousedown", handleDropRef.current);
    setGrabbedWorkId(() => null);
    grabAreaId.current = null;

    gsap.to("#grabbed-artwork-container", { duration: 0.5, opacity: 0 });
    gsap.to(".grab-hint-container", { duration: 0.1, opacity: 0 });
    gsap.to(".drop-hint-container", { duration: 0.1, opacity: 0 });
  }

  function handleEnterGrabArea(id) {
    if (grabbedWorkId !== null || isInfoVisible.current) return;

    grabAreaId.current = id;
    window.addEventListener("mousedown", handleGrabRef.current);
    gsap.to(".grab-hint-container", { duration: 0.1, opacity: 1 });
  }

  function handleLeaveGrabArea() {
    if (grabbedWorkId !== null) return;

    grabAreaId.current = null;
    window.removeEventListener("mousedown", handleGrabRef.current);
    gsap.to(".grab-hint-container", { duration: 0.1, opacity: 0 });
  }

  function handleEnterInfoArea() {
    if (grabbedWorkId !== null) return;

    window.addEventListener("mousedown", handleShowInfoRef.current);
    gsap.to(".show-info-hint-container", { duration: 0.1, opacity: 1 });
  }

  function handleLeaveInfoArea() {
    if (grabbedWorkId !== null) return;

    window.removeEventListener("mousedown", handleShowInfoRef.current);
    gsap.to(".show-info-hint-container", { duration: 0.1, opacity: 0 });
  }

  return (
    <group position={position}>
      {/* Back wall */}
      <WallMesh
        ref={(el) => (wallRefs.current[0] = el)}
        name="backWall"
        width={roomWidth}
        height={roomHeight}
        depth={wallThickness}
        wallThickness={wallThickness}
        position={[0, roomHeight * 0.5, (wallThickness - roomDepth) * 0.5]}
        rotation={[0, 0, 0]}
        works={artworks.filter(
          (w) => w.id !== grabbedWorkId && w.wall === "backWall",
        )}
        handleEnterGrabArea={handleEnterGrabArea}
        handleLeaveGrabArea={handleLeaveGrabArea}
      />

      {/* Left wall */}
      <WallMesh
        ref={(el) => (wallRefs.current[1] = el)}
        name="leftWall"
        width={roomDepth}
        height={roomHeight}
        depth={wallThickness}
        wallThickness={wallThickness}
        position={[-roomWidth * 0.5, roomHeight * 0.5, 0]}
        rotation={[0, Math.PI * 0.5, 0]}
        works={artworks.filter(
          (w) => w.id !== grabbedWorkId && w.wall === "leftWall",
        )}
        handleEnterGrabArea={handleEnterGrabArea}
        handleLeaveGrabArea={handleLeaveGrabArea}
      />

      {/* Right wall */}
      <WallMesh
        ref={(el) => (wallRefs.current[2] = el)}
        name="rightWall"
        width={roomDepth}
        height={roomHeight}
        depth={wallThickness}
        wallThickness={wallThickness}
        position={[roomWidth * 0.5, roomHeight * 0.5, 0]}
        rotation={[0, -Math.PI * 0.5, 0]}
        works={artworks.filter(
          (w) => w.id !== grabbedWorkId && w.wall === "rightWall",
        )}
        handleEnterGrabArea={handleEnterGrabArea}
        handleLeaveGrabArea={handleLeaveGrabArea}
      />

      {/* Partition back part */}
      <WallMesh
        ref={(el) => (wallRefs.current[3] = el)}
        name="partitionBack"
        width={roomWidth - 2.6}
        height={roomHeight}
        depth={wallThickness}
        wallThickness={wallThickness}
        position={[0, roomHeight * 0.5, -wallThickness * 0.5]}
        rotation={[0, Math.PI, 0]}
        works={artworks.filter(
          (w) => w.id !== grabbedWorkId && w.wall === "partitionBack",
        )}
        handleEnterGrabArea={handleEnterGrabArea}
        handleLeaveGrabArea={handleLeaveGrabArea}
      />

      {/* Partition front part */}
      <WallMesh
        ref={(el) => (wallRefs.current[4] = el)}
        name="partitionFront"
        width={roomWidth - 2.6}
        height={roomHeight}
        depth={wallThickness}
        wallThickness={wallThickness}
        position={[0, roomHeight * 0.5, wallThickness * 0.5]}
        rotation={[0, 0, 0]}
        works={artworks.filter(
          (w) => w.id !== grabbedWorkId && w.wall === "partitionFront",
        )}
        handleEnterGrabArea={handleEnterGrabArea}
        handleLeaveGrabArea={handleLeaveGrabArea}
      />

      {/* Floor */}
      <FloorMesh
        width={roomWidth}
        depth={roomDepth}
        wallThickness={wallThickness}
      />

      {/* Ceiling */}
      <CeilingMesh
        width={roomWidth}
        depth={roomDepth}
        position={[0, roomHeight, 0]}
        wallThickness={wallThickness}
      />

      {/* Window seat left side */}
      <WindowSeatMesh
        width={(roomWidth - 1.3) * 0.5}
        height={0.6}
        depth={0.6}
        position={[-(1.3 + roomWidth) * 0.25, 0.3, roomDepth * 0.5 - 0.3]}
      />
      {/* Info paper stack */}
      <PaperStack
        position={[1 - roomWidth * 0.5, 0.601, roomDepth * 0.5 - 0.36]}
        rotation={[0, -0.1, 0]}
        onEnterGrabArea={handleEnterInfoArea}
        onLeaveGrabArea={handleLeaveInfoArea}
      />

      {/* Window seat right side */}
      <WindowSeatMesh
        width={(roomWidth - 1.3) * 0.5}
        height={0.6}
        depth={0.6}
        position={[(1.3 + roomWidth) * 0.25, 0.3, roomDepth * 0.5 - 0.3]}
      />

      {/* Window */}
      <WindowMesh
        width={roomWidth + wallThickness}
        height={roomHeight + wallThickness}
        depth={0.02}
        position={[0, roomHeight * 0.5, roomDepth * 0.5 + 0.01]}
      />
    </group>
  );
}
