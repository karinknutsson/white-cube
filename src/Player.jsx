import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { PointerLockControls } from "@react-three/drei";

export default function Player() {
  const { camera } = useThree();
  console.log(camera);
  const body = useRef();

  const controlsRef = useRef();
  const velocity = useRef(new THREE.Vector3());
  const move = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const bodyPosition = body.current.translation();

    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z -= 0.2;
    cameraPosition.y += 0.7;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.z -= 2;
    cameraTarget.y -= 0.7;

    camera.position.copy(cameraPosition);
    camera.lookAt(cameraTarget);

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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const speed = 2;
    velocity.current.set(0, 0, 0);

    if (move.current.forward) velocity.current.z -= speed * delta;
    if (move.current.backward) velocity.current.z += speed * delta;
    if (move.current.left) velocity.current.x -= speed * delta;
    if (move.current.right) velocity.current.x += speed * delta;

    controlsRef.current.moveRight(velocity.current.x);
    controlsRef.current.moveForward(velocity.current.z);
  });

  return (
    <>
      <PointerLockControls ref={controlsRef} />
      <RigidBody ref={body} type="dynamic">
        <CuboidCollider args={[0.3, 0.8, 0.2]} position={[0, 1, 3.6]} />
      </RigidBody>
    </>
  );
}
