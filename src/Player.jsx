import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { PointerLockControls } from "@react-three/drei";
import useGallery from "./stores/useGallery";

export default function Player() {
  const { camera } = useThree();
  const { isFloating } = useGallery();
  const bodyRef = useRef();
  const controlsRef = useRef();
  const cameraYOffset = useRef(0.7);

  const move = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    crouch: false,
  });

  /**
   * Player movement and controls logic
   */
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
        case "ShiftLeft":
        case "ShiftRight":
          move.current.crouch = true;
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
        case "ShiftLeft":
        case "ShiftRight":
          move.current.crouch = false;
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

  /**
   * Update player movement and camera position on each frame
   */
  useFrame(() => {
    if (!bodyRef.current) return;

    if (!isFloating) {
      const velocity = bodyRef.current.linvel();
      const direction = new THREE.Vector3();

      // Set direction based on input
      if (move.current.forward) direction.z -= 1;
      if (move.current.backward) direction.z += 1;
      if (move.current.left) direction.x -= 1;
      if (move.current.right) direction.x += 1;

      direction.normalize();

      // Rotate direction by camera orientation
      direction.applyEuler(camera.rotation);

      // Set speed
      const speed = 1;

      // Set velocity based on input direction and camera orientation
      bodyRef.current.setLinvel(
        {
          x: direction.x * speed,
          y: velocity.y,
          z: direction.z * speed,
        },
        true,
      );

      // Jump if player is on the ground and jump key is pressed
      if (move.current.jump && Math.abs(velocity.y) < 0.05) {
        bodyRef.current.setLinvel({ x: velocity.x, y: 4, z: velocity.z }, true);
      }

      const position = bodyRef.current.translation();
      const targetY = move.current.crouch ? position.y : position.y + 0.7;

      // Set camera position based on body position and whether the player is crouching
      camera.position.y += (targetY - camera.position.y) * 0.1;
      camera.position.x = position.x;
      camera.position.z = position.z;
    } else {
      const direction = new THREE.Vector3();

      // Set direction based on input
      if (move.current.forward) direction.z -= 1;
      if (move.current.backward) direction.z += 1;
      if (move.current.left) direction.x -= 1;
      if (move.current.right) direction.x += 1;

      direction.normalize();

      const cameraDirection = new THREE.Vector3();
      const cameraRight = new THREE.Vector3();

      camera.getWorldDirection(cameraDirection);

      cameraRight.crossVectors(camera.up, cameraDirection).normalize();

      // Calculate total impulse
      const impulse = new THREE.Vector3();
      const impulseStrength = 0.05;

      if (move.current.forward)
        impulse.addScaledVector(cameraDirection, impulseStrength);
      if (move.current.backward)
        impulse.addScaledVector(cameraDirection, -impulseStrength);
      if (move.current.left)
        impulse.addScaledVector(cameraRight, impulseStrength);
      if (move.current.right)
        impulse.addScaledVector(cameraRight, -impulseStrength);

      // Apply impulse
      if (impulse.lengthSq() > 0) {
        bodyRef.current.applyImpulse(impulse, true);
      }

      // bodyRef.current.applyImpulse(
      //   {
      //     x: direction.x * 0.5,
      //     y: direction.y * 0.5,
      //     z: direction.z * 0.5,
      //   },
      //   true,
      // );

      const position = bodyRef.current.translation();

      // Target offset:center of body when floating, eye height when not
      const targetOffset = isFloating ? 0 : 0.7;

      // Smooth the offset
      cameraYOffset.current += (targetOffset - cameraYOffset.current) * 0.001;

      // Set camera position based on body position and smoothed offset
      camera.position.y = position.y + cameraYOffset.current;
      camera.position.x = position.x;
      camera.position.z = position.z;
    }
  });

  useEffect(() => {
    if (!bodyRef.current) return;

    if (isFloating) {
      // When the player starts floating, apply impulse to lift them up and into the room
      bodyRef.current.setEnabledRotations(true, true, true);
      bodyRef.current.applyImpulse({ x: 0, y: 0.5, z: 0 }, true);
      bodyRef.current.applyTorqueImpulse({ x: 0.5, y: 0.5, z: 0 }, true);
    } else {
      // Reset velocity and rotation when player stops floating
      bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      bodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      bodyRef.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
      bodyRef.current.setEnabledRotations(false, false, false);
    }
  }, [isFloating]);

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
        gravityScale={isFloating ? 0 : 1}
      >
        <CapsuleCollider args={[0.5, 0.3]} />
        <CapsuleCollider args={[0.5, 0.4]} sensor />
      </RigidBody>
    </>
  );
}
