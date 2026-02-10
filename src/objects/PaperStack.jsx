import { useGLTF, Text } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { infoTextContent } from "../data/infoTextContent.js";

const paperMaterial = new THREE.MeshStandardMaterial({
  color: "#f5f4f2",
});

export default function PaperStack({
  position,
  rotation,
  onEnterGrabArea,
  onLeaveGrabArea,
}) {
  const { scene } = useGLTF("./models/paper-stack.glb");

  // Apply material and shadow properties to all meshes in the model
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = paperMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  });

  return (
    <>
      <RigidBody
        type="kinematicPosition"
        colliders={false}
        position={[position[0], position[1] + 0.0257, position[2]]}
        rotation={[Math.PI * 0.5, Math.PI, rotation[1]]}
      >
        {/* Collider */}
        <CuboidCollider
          args={[0.3, 0.5, 0.3]}
          position={[0, 0, 0.3]}
          sensor
          onIntersectionEnter={onEnterGrabArea}
          onIntersectionExit={onLeaveGrabArea}
        />

        {/* Text */}
        <Text
          font="./fonts/IBMPlexSans-SemiBold.woff"
          position={[-0.08, 0.11, 0]}
          fontSize={0.02}
          color="black"
          anchorX="left"
          anchorY="top"
        >
          white cube
        </Text>
        <Text
          font="./fonts/IBMPlexSans-Regular.woff"
          position={[-0.08, 0.07, 0]}
          fontSize={0.006}
          color="black"
          anchorX="left"
          anchorY="top"
          maxWidth={0.15}
        >
          {infoTextContent[0] +
            " " +
            infoTextContent[1] +
            " " +
            infoTextContent[2]}
        </Text>

        {/* Invisible mesh for raycaster */}
        <mesh name="paperStack">
          <boxGeometry args={[1, 1, 1]} /> <meshBasicMaterial visible={false} />
        </mesh>
      </RigidBody>

      {/* Paper stack model */}
      <primitive rotation={rotation} position={position} object={scene} />
    </>
  );
}
