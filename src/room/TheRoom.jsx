import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import useGallery from "../stores/useGallery";
import { useThree, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useRef, useMemo, useState, useEffect } from "react";
import Artwork from "../artwork/Artwork";
import { wallLabelSizes } from "../data/wallLabelSizes";
import PaperStack from "../objects/PaperStack";
import { BakeShadows } from "@react-three/drei";
import FloatObject from "../objects/FloatObject";

/**
 * Geometry
 */
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

/**
 * Material
 */
const roomMaterial = new THREE.MeshStandardMaterial({
  color: "#ffffff",
});
const windowFrameMaterial = new THREE.MeshStandardMaterial({
  color: "#c2c2cc",
});
const windowMaterial = new THREE.MeshPhysicalMaterial({
  color: "#ffffff",
  roughness: 0,
  transmission: 1,
  transparent: true,
  thickness: 0.006,
  ior: 1.5,
});

/**
 * Floor mesh
 */
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

/**
 * Ceiling mesh
 */
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

/**
 * Window seat mesh
 */
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

/**
 * Window frame mesh
 */
export function WindowFrameMesh({
  width,
  height,
  frameWidth,
  depth,
  position,
}) {
  return (
    <RigidBody type="fixed" colliders="trimesh" position={position}>
      {/* Top part */}
      <mesh
        geometry={boxGeometry}
        material={windowFrameMaterial}
        scale={[width, frameWidth, depth]}
        position={[0, height * 0.5 - frameWidth * 0.5, 0]}
        castShadow
        receiveShadow
      ></mesh>

      {/* Bottom part */}
      <mesh
        geometry={boxGeometry}
        material={windowFrameMaterial}
        scale={[width, frameWidth, depth]}
        position={[0, -height * 0.5 + frameWidth * 0.5, 0]}
        castShadow
        receiveShadow
      ></mesh>

      {/* Right part */}
      <mesh
        geometry={boxGeometry}
        material={windowFrameMaterial}
        scale={[frameWidth, height, depth]}
        position={[width * 0.5 - frameWidth * 0.5, 0, 0]}
        castShadow
        receiveShadow
      ></mesh>

      {/* Left part */}
      <mesh
        geometry={boxGeometry}
        material={windowFrameMaterial}
        scale={[frameWidth, height, depth]}
        position={[-width * 0.5 + frameWidth * 0.5, 0, 0]}
        castShadow
        receiveShadow
      ></mesh>
    </RigidBody>
  );
}

/**
 * Window mesh
 */
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

/**
 * Wall mesh
 */
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
        {/* Collider */}
        <CuboidCollider
          args={[width * 0.5, height * 0.5, wallThickness * 0.5]}
        />

        {/* Meshes */}
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
                onLeaveGrabArea={() => handleLeaveGrabArea(work.id)}
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
  doorWidth,
  doorHeight,
  windowSeatHeight,
  windowSeatDepth,
  windowFrameWidth,
  windowFrameDepth,
  doorDepth,
}) {
  const { camera, scene } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const rayCasterPointer = useMemo(() => new THREE.Vector2(0, 0), []);
  const lastCameraQuaternion = useRef(new THREE.Quaternion());
  const isInsideGrabArea = useRef(null);
  const shownHint = useRef(null);

  const grabAreaId = useRef(null);
  const [grabbedWorkId, setGrabbedWorkId] = useState(null);
  const [bakeKey, setBakeKey] = useState(0);

  const { artworks, moveArtwork, setIsFloating } = useGallery();

  const wallRefs = useRef([]);
  const paperStackRef = useRef(null);

  const handleDropRef = useRef(null);
  const handleGrabRef = useRef(null);

  const handleHideInfoRef = useRef(null);
  const handleShowInfoRef = useRef(null);
  const isInfoVisible = useRef(false);

  const handleClickFloatRef = useRef(null);

  // Clamp helper
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  useEffect(() => {
    /**
     * Dropping artwork logic
     */
    handleDropRef.current = (e) => {
      {
        // Hide hints and grabbed artwork preview
        gsap.to("#grabbed-artwork-container", { duration: 0.5, opacity: 0 });
        gsap.to(".drop-hint-container", { duration: 0.1, opacity: 0 });

        if (!wallRefs.current.length) return;

        // Find the artwork being dropped
        const artwork = artworks.filter((w) => w.id === grabAreaId.current);
        if (artwork.length === 0) return;

        // Get artwork dimensions
        const artworkWidth = artwork[0].size[0];
        const artworkHeight = artwork[0].size[1];

        // Raycast to find where the artwork is being dropped
        raycaster.setFromCamera(rayCasterPointer, camera);
        const hits = raycaster.intersectObjects(wallRefs.current, false);

        // Cancel drop if not dropped on a wall
        if (hits.length === 0) {
          cancelDrop();
          return;
        }

        // Drop artwork on the wall, calculating position based on where it was dropped and clamping it within the wall bounds
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

        // Reset grab state
        window.removeEventListener("mousedown", handleDropRef.current);
        setGrabbedWorkId(() => null);
        grabAreaId.current = null;

        // Update shadows after dropping artwork
        setBakeKey((key) => key + 1);
      }
    };

    /**
     * Grabbing artwork logic
     */
    handleGrabRef.current = (e) => {
      setGrabbedWorkId(grabAreaId.current);
      shownHint.current = null;

      window.removeEventListener("mousedown", handleGrabRef.current);
      window.addEventListener("mousedown", handleDropRef.current);

      // Show grabbed artwork preview and drop hint
      gsap.to(".grab-hint-container", { duration: 0.1, opacity: 0 });
      gsap.to(".drop-hint-container", { duration: 0.1, opacity: 1 });

      // Find the artwork being grabbed
      const artwork = artworks.find((w) => w.id === grabAreaId.current);
      if (!artwork) return;

      // Set the source of the grabbed artwork preview to the artwork being grabbed
      const image = document.getElementById("grabbed-image");
      image.src = work.path ?? "";
      gsap.to("#grabbed-artwork-container", { duration: 0.5, opacity: 0.6 });
    };

    /**
     * Showing info logic
     */
    handleShowInfoRef.current = (e) => {
      isInfoVisible.current = true;

      window.removeEventListener("mousedown", handleShowInfoRef.current);
      window.addEventListener("mousedown", handleHideInfoRef.current);

      gsap.to("#info-container", { duration: 0.1, opacity: 1 });
      gsap.to(".show-info-hint-container", { duration: 0.1, opacity: 0 });
      gsap.to(".hide-info-hint-container", { duration: 0.1, opacity: 1 });
    };

    /**
     * Hiding info logic
     */
    handleHideInfoRef.current = (e) => {
      isInfoVisible.current = false;

      window.removeEventListener("mousedown", handleHideInfoRef.current);

      gsap.to("#info-container", { duration: 0.1, opacity: 0 });
      gsap.to(".hide-info-hint-container", { duration: 0.1, opacity: 0 });
    };

    /**
     * Activate no gravity mode
     */
    handleClickFloatRef.current = (e) => {
      window.removeEventListener("mousedown", handleClickFloatRef.current);
      gsap.to(".show-sphere-hint-container", { duration: 0.1, opacity: 0 });

      setIsFloating(true);

      setTimeout(() => {
        setIsFloating(false);
      }, 30000);
    };
  }, []);

  // When artwork is grabbed, listen for x key to cancel grab
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

  // Cancel drop when x key has been pressed or when artwork has been dropped on a non-wall surface
  function cancelDrop() {
    window.removeEventListener("mousedown", handleDropRef.current);
    setGrabbedWorkId(() => null);
    grabAreaId.current = null;

    gsap.to("#grabbed-artwork-container", { duration: 0.5, opacity: 0 });
    gsap.to(".grab-hint-container", { duration: 0.1, opacity: 0 });
    gsap.to(".drop-hint-container", { duration: 0.1, opacity: 0 });
  }

  /**
   * Raycast the scene to check if the player is looking at an interactable object and show hints
   */
  function raycastScene() {
    if (!isInsideGrabArea.current) return;
    if (grabbedWorkId !== null || isInfoVisible.current) return;

    // Raycast from the center of the screen
    raycaster.setFromCamera(rayCasterPointer, camera);
    const hits = raycaster.intersectObjects(scene.children, true);

    if (hits.length === 0) return;

    // Keep track of hit in current frame
    let hitCurrentFrame = null;

    // Check if any of the hits are interactable objects and show hints accordingly
    for (const hit of hits) {
      if (
        hit.object.name === "paperStack" &&
        isInsideGrabArea.current === "paperStack"
      ) {
        hitCurrentFrame = "paperStack";

        if (shownHint.current !== "paperStack") {
          shownHint.current = "paperStack";
          window.addEventListener("mousedown", handleShowInfoRef.current);
          gsap.to(".show-info-hint-container", { duration: 0.1, opacity: 1 });
        }
      }

      if (
        hit.object.name === "floatObject" &&
        isInsideGrabArea.current === "floatObject"
      ) {
        hitCurrentFrame = "floatObject";

        if (shownHint.current !== "floatObject") {
          shownHint.current = "floatObject";
          window.addEventListener("mousedown", handleClickFloatRef.current);
          gsap.to(".show-sphere-hint-container", { duration: 0.1, opacity: 1 });
        }
      }

      if (
        hit.object.name === isInsideGrabArea.current &&
        isInsideGrabArea.current !== "paperStack" &&
        isInsideGrabArea.current !== "floatObject"
      ) {
        hitCurrentFrame = "grabArtwork";

        if (shownHint.current !== "grabArtwork") {
          shownHint.current = "grabArtwork";
          window.addEventListener("mousedown", handleGrabRef.current);
          gsap.to(".grab-hint-container", { duration: 0.1, opacity: 1 });
        }
      }
    }

    // Hide hints if the player is no longer looking at the interactable object
    if (
      shownHint.current === "paperStack" &&
      hitCurrentFrame !== "paperStack"
    ) {
      shownHint.current = null;
      window.removeEventListener("mousedown", handleShowInfoRef.current);
      gsap.to(".show-info-hint-container", { duration: 0.1, opacity: 0 });
    }

    if (
      shownHint.current === "floatObject" &&
      hitCurrentFrame !== "floatObject"
    ) {
      shownHint.current = null;
      window.removeEventListener("mousedown", handleClickFloatRef.current);
      gsap.to(".show-sphere-hint-container", { duration: 0.1, opacity: 0 });
    }

    if (
      shownHint.current === "grabArtwork" &&
      hitCurrentFrame !== "grabArtwork"
    ) {
      shownHint.current = null;
      window.removeEventListener("mousedown", handleGrabRef.current);
      gsap.to(".grab-hint-container", { duration: 0.1, opacity: 0 });
    }
  }

  // Raycast the scene when the camera has rotated to check if the player is looking at an interactable object and show hints
  useFrame(() => {
    if (!isInsideGrabArea.current) return;

    const dot = camera.quaternion.dot(lastCameraQuaternion.current);
    const delta = 1 - Math.abs(dot);
    if (delta < 0.0001) return;

    lastCameraQuaternion.current.copy(camera.quaternion);

    raycastScene();
  });

  // Keep track of the artwork id if grab area of artwork has been entered
  function handleEnterGrabArea(name) {
    isInsideGrabArea.current = name;

    if (name !== "paperStack" && name !== "floatObject")
      grabAreaId.current = name;

    raycastScene();
  }

  // Remove event listeners and hide hints when leaving grab area
  function handleLeaveGrabArea(name) {
    isInsideGrabArea.current = null;
    shownHint.current = null;

    if (name === "paperStack") {
      window.removeEventListener("mousedown", handleShowInfoRef.current);
      gsap.to(".show-info-hint-container", { duration: 0.1, opacity: 0 });
    } else if (name === "floatObject") {
      window.removeEventListener("mousedown", handleClickFloatRef.current);
      gsap.to(".show-sphere-hint-container", { duration: 0.1, opacity: 0 });
    } else {
      window.removeEventListener("mousedown", handleGrabRef.current);
      gsap.to(".grab-hint-container", { duration: 0.1, opacity: 0 });
    }
  }

  return (
    <>
      {/* Bake shadows for better performance */}
      <BakeShadows key={bakeKey} />

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
          width={(roomWidth - doorWidth) * 0.5}
          height={windowSeatHeight}
          depth={windowSeatDepth}
          position={[
            -(doorWidth + roomWidth) * 0.25 + wallThickness * 0.5,
            windowSeatHeight * 0.5,
            (roomDepth - windowSeatDepth) * 0.5,
          ]}
        />

        {/* Window frame left side */}
        <WindowFrameMesh
          width={(roomWidth - doorWidth) * 0.5}
          height={roomHeight - windowSeatHeight - wallThickness * 0.5}
          frameWidth={windowFrameWidth}
          depth={windowFrameDepth}
          position={[
            -(doorWidth + roomWidth) * 0.25 + wallThickness * 0.5,
            (roomHeight + windowSeatHeight) * 0.5 - wallThickness * 0.25,
            (roomDepth - windowFrameDepth) * 0.5,
          ]}
        />

        {/* Window seat right side */}
        <WindowSeatMesh
          width={(roomWidth - doorWidth) * 0.5}
          height={windowSeatHeight}
          depth={windowSeatDepth}
          position={[
            (doorWidth + roomWidth) * 0.25 - wallThickness * 0.5,
            windowSeatHeight * 0.5,
            (roomDepth - windowSeatDepth) * 0.5,
          ]}
        />

        {/* Window frame right side */}
        <WindowFrameMesh
          width={(roomWidth - doorWidth) * 0.5}
          height={roomHeight - windowSeatHeight - wallThickness * 0.5}
          frameWidth={windowFrameWidth}
          depth={windowFrameDepth}
          position={[
            (doorWidth + roomWidth) * 0.25 - wallThickness * 0.5,
            (roomHeight + windowSeatHeight) * 0.5 - wallThickness * 0.25,
            (roomDepth - windowFrameDepth) * 0.5,
          ]}
        />

        {/* Window frame on top of door */}
        <WindowFrameMesh
          width={doorWidth - wallThickness}
          height={
            roomHeight - doorHeight + (windowFrameWidth - wallThickness) * 0.5
          }
          frameWidth={windowFrameWidth}
          depth={windowFrameDepth}
          position={[
            0,
            doorHeight +
              (roomHeight -
                doorHeight -
                (wallThickness + windowFrameWidth) * 0.5) *
                0.5,
            (roomDepth - windowFrameDepth) * 0.5,
          ]}
        />

        {/* Inner window frame on top of door */}
        <WindowFrameMesh
          width={doorWidth - wallThickness}
          height={
            roomHeight - doorHeight + (windowFrameWidth - wallThickness) * 0.5
          }
          frameWidth={windowFrameWidth * 1.5}
          depth={windowFrameDepth * 0.4}
          position={[
            0,
            doorHeight +
              (roomHeight -
                doorHeight -
                (wallThickness + windowFrameWidth) * 0.5) *
                0.5,
            (roomDepth - windowFrameDepth) * 0.5,
          ]}
        />

        {/* Door frame */}
        <WindowFrameMesh
          width={doorWidth - wallThickness}
          height={doorHeight - wallThickness * 0.5}
          frameWidth={windowFrameWidth}
          depth={windowFrameDepth}
          position={[
            0,
            (doorHeight + windowFrameWidth) * 0.5,
            (roomDepth - windowFrameDepth) * 0.5,
          ]}
        />

        {/* Door */}
        <WindowFrameMesh
          width={doorWidth - wallThickness - 0.04}
          height={doorHeight - wallThickness * 0.5 - 0.04}
          frameWidth={windowFrameWidth * 1.5}
          depth={doorDepth}
          position={[
            0,
            (doorHeight + windowFrameWidth) * 0.5 - 0.02,
            (roomDepth - windowFrameDepth) * 0.5 - doorDepth * 2,
          ]}
        />

        {/* Window */}
        <WindowMesh
          width={roomWidth + wallThickness}
          height={roomHeight + wallThickness}
          depth={0.006}
          position={[0, roomHeight * 0.5, roomDepth * 0.5 - 0.02]}
        />

        {/* Info paper stack */}
        <PaperStack
          ref={paperStackRef}
          position={[
            1 - roomWidth * 0.5,
            windowSeatHeight + 0.01,
            roomDepth * 0.5 - (windowSeatDepth * 0.5 + 0.06),
          ]}
          rotation={[0, -0.1, 0]}
          onEnterGrabArea={() => handleEnterGrabArea("paperStack")}
          onLeaveGrabArea={() => handleLeaveGrabArea("paperStack")}
        />

        {/* Float object for triggering no gravity mode */}
        <FloatObject
          size={0.04}
          position={[
            roomWidth * 0.5 - 0.6,
            windowSeatHeight + 0.16,
            roomDepth * 0.5 - (windowSeatDepth * 0.5 + 0.08),
          ]}
          onEnterGrabArea={() => handleEnterGrabArea("floatObject")}
          onLeaveGrabArea={() => handleLeaveGrabArea("floatObject")}
        />
      </group>
    </>
  );
}
