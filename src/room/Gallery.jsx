import { CubeCamera, Environment, useHelper } from "@react-three/drei";
import TheRoom from "./TheRoom";
import { RigidBody } from "@react-three/rapier";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Gallery() {
  const roomWidth = 7;
  const roomHeight = 3.2;
  const roomDepth = 9;

  return (
    <>
      {/* Environment map */}
      <CubeCamera
        resolution={256}
        position={[0, 2, -2]}
        near={0.1}
        far={100}
        frames={1}
      />

      {/* Room mesh */}
      <TheRoom
        roomWidth={roomWidth}
        roomHeight={roomHeight}
        roomDepth={roomDepth}
        wallThickness={0.1}
        position={[0, 0, 0]}
      />
    </>
  );
}
