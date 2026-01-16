import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { PointerLockControls } from "@react-three/drei";

export default function Player() {
  const { camera } = useThree();
  const bodyRef = useRef();
  const controlsRef = useRef();

  const move = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  useEffect(() => {
    if (controlsRef.current) controlsRef.current.pointerSpeed = 0.3;

    const handleKeyDown = (e) => {
      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          move.current.forward = true;
          break;
        case "ArrowDown":
        case "KeyS":
          move.current.backward = true;
          break;
        case "ArrowLeft":
        case "KeyA":
          move.current.left = true;
          break;
        case "ArrowRight":
        case "KeyD":
          move.current.right = true;
          break;
        case "Space":
          move.current.jump = true;
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          move.current.forward = false;
          break;
        case "ArrowDown":
        case "KeyS":
          move.current.backward = false;
          break;
        case "ArrowLeft":
        case "KeyA":
          move.current.left = false;
          break;
        case "ArrowRight":
        case "KeyD":
          move.current.right = false;
          break;
        case "Space":
          move.current.jump = false;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!bodyRef.current) return;

    const velocity = bodyRef.current.linvel();
    const direction = new THREE.Vector3();

    if (move.current.forward) direction.z -= 1;
    if (move.current.backward) direction.z += 1;
    if (move.current.left) direction.x -= 1;
    if (move.current.right) direction.x += 1;

    direction.normalize();
    direction.applyEuler(camera.rotation);

    const speed = 5;

    bodyRef.current.setLinvel(
      {
        x: direction.x * speed,
        y: velocity.y,
        z: direction.z * speed,
      },
      true
    );

    if (move.current.jump && Math.abs(velocity.y) < 0.05) {
      bodyRef.current.setLinvel({ x: velocity.x, y: 4, z: velocity.z }, true);
    }

    const position = bodyRef.current.translation();
    camera.position.set(position.x, position.y + 0.7, position.z);
  });

  return (
    <>
      <PointerLockControls ref={controlsRef} />
      <RigidBody
        ref={bodyRef}
        position={[0, 1, 3.6]}
        type="dynamic"
        colliders={false}
        mass={1}
        enabledRotations={[false, false, false]}
      >
        <CapsuleCollider args={[0.5, 0.3]} />
        <CapsuleCollider args={[0.5, 0.6]} sensor />
      </RigidBody>
    </>
  );
}
