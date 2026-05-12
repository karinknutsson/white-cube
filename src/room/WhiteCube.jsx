import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

const CUBE_POSITION = [2, 1, 6];

const SLOW_SPEED = 0.005;
const X_TILT = -0.4;

export default function WhiteCube() {
  const meshRef = useRef();
  const spotLightRef = useRef();
  const spotLightTargetRef = useRef();
  const [hovered, setHovered] = useState(false);
  const hoverSpeeds = useRef({ x: 0, y: SLOW_SPEED, z: 0 });
  const { raycaster, camera } = useThree();
  const mouse = new THREE.Vector2();

  useFrame(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;

    if (hovered) {
      mesh.rotation.x += hoverSpeeds.current.x;
      mesh.rotation.y += hoverSpeeds.current.y;
      mesh.rotation.z += hoverSpeeds.current.z;
    } else {
      mesh.rotation.x += (X_TILT - mesh.rotation.x) * 0.05;
      mesh.rotation.z *= 0.95;
      mesh.rotation.y += SLOW_SPEED;
    }
  });

  useEffect(() => {
    window.addEventListener("mousemove", (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(meshRef.current);

      if (intersects.length > 0) {
        if (!hovered) handlePointerEnter();
      } else {
        setHovered(false);
      }
    });

    return () => {
      window.removeEventListener("mousemove", () => {});
    };
  }, []);

  useEffect(() => {
    if (spotLightRef.current && spotLightTargetRef.current) {
      spotLightRef.current.target = spotLightTargetRef.current;
    }
  }, []);

  const handlePointerEnter = () => {
    const sign = () => (Math.random() > 0.5 ? 1 : -1);
    const speed = () => sign() * (0.02 + Math.random() * 0.04);
    hoverSpeeds.current = { x: speed(), y: speed(), z: speed() };
    setHovered(true);
  };

  return (
    <>
      {/* Spotlight */}
      <spotLight
        ref={spotLightRef}
        position={[
          CUBE_POSITION[0] - 2,
          CUBE_POSITION[1] + 2,
          CUBE_POSITION[2] - 2,
        ]}
        angle={4.6}
        penumbra={1}
        intensity={100}
        castShadow
        color="#ffffff"
        decay={2.6}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <object3D ref={spotLightTargetRef} position={CUBE_POSITION} />

      {/* white cube body */}
      <RigidBody type="fixed">
        <mesh ref={meshRef} position={CUBE_POSITION} receiveShadow>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>
    </>
  );
}
