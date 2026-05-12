import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

const SLOW_SPEED = 0.005;

export default function WhiteCube() {
  const meshRef = useRef();
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
      mesh.rotation.x *= 0.95;
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

  const handlePointerEnter = () => {
    const sign = () => (Math.random() > 0.5 ? 1 : -1);
    const speed = () => sign() * (0.02 + Math.random() * 0.04);
    hoverSpeeds.current = { x: speed(), y: speed(), z: speed() };
    setHovered(true);
  };

  return (
    <RigidBody type="fixed">
      <mesh ref={meshRef} position={[3, 0, 6]} receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
  );
}
