import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import useWhiteCube from "../stores/useWhiteCube";
import useGallery from "../stores/useGallery";

const CUBE_POSITION = [8, 0.6, 3.6];
const SLOW_SPEED = 0.003;
const CUBE_Z_TILT = -0.4;

export default function WhiteCube() {
  const meshRef = useRef();
  const directionalLightRef = useRef();
  const directionalLightTargetRef = useRef();
  const [hovered, setHovered] = useState(false);
  const hoverSpeeds = useRef({ x: 0, y: SLOW_SPEED, z: 0 });
  const transformTriggered = useWhiteCube((state) => state.transformTriggered);
  const resetTransform = useWhiteCube((state) => state.resetTransform);
  const setShowGallery = useGallery((state) => state.setShowGallery);
  const { raycaster, camera } = useThree();
  const mouse = new THREE.Vector2();
  const transforming = useRef(false);
  const transformTargetScale = useRef(new THREE.Vector3(10, 10, 10));

  useFrame(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;

    if (transforming.current) {
      // Snap rotation so a flat face points at the camera
      mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, 0, 0.06);
      mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, 0, 0.06);
      const nearestFlatY =
        Math.round(mesh.rotation.y / (Math.PI / 2)) * (Math.PI / 2);
      mesh.rotation.y = THREE.MathUtils.lerp(
        mesh.rotation.y,
        nearestFlatY,
        0.06,
      );

      // Move toward camera and scale up simultaneously
      mesh.position.lerp(camera.position, 0.01);
      mesh.scale.lerp(transformTargetScale.current, 0.01);

      // Once the camera is inside the cube, switch to gallery
      if (mesh.position.distanceTo(camera.position) < 1.5 * mesh.scale.x) {
        setShowGallery(true);
        console.log("show gallery");
        transforming.current = false;
      }
      return;
    }

    if (hovered) {
      mesh.rotation.x += hoverSpeeds.current.x;
      mesh.rotation.y += hoverSpeeds.current.y;
      mesh.rotation.z += hoverSpeeds.current.z;
    } else {
      mesh.rotation.x *= 0.95;
      mesh.rotation.z += (CUBE_Z_TILT - mesh.rotation.z) * 0.05;
      mesh.rotation.y += SLOW_SPEED;
    }
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!meshRef.current) return;

      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(meshRef.current);

      if (intersects.length > 0) {
        if (!hovered) handlePointerEnter();
      } else {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (directionalLightRef.current && directionalLightTargetRef.current) {
      directionalLightRef.current.target = directionalLightTargetRef.current;
    }
  }, []);

  useEffect(() => {
    if (transformTriggered) {
      transformCube();
      resetTransform();
    }
  }, [transformTriggered]);

  const transformCube = () => {
    transforming.current = true;
  };

  const handlePointerEnter = () => {
    const sign = () => (Math.random() > 0.5 ? 1 : -1);
    const speed = () => sign() * (0.02 + Math.random() * 0.04);
    hoverSpeeds.current = { x: speed(), y: speed(), z: speed() };
    setHovered(true);
  };

  return (
    <>
      {/* Directional light */}
      <directionalLight
        ref={directionalLightRef}
        position={[0, 1, 1.6]}
        intensity={6}
      />
      <object3D ref={directionalLightTargetRef} position={CUBE_POSITION} />

      {/* white cube body */}
      <RigidBody type="fixed">
        <mesh ref={meshRef} position={CUBE_POSITION} receiveShadow>
          <boxGeometry args={[3, 3, 3]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>
    </>
  );
}
