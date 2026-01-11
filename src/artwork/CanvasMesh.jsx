import { useLoader } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import gsap from "gsap";

export default function ArtworkMesh({ path, size }) {
  const texture = useLoader(THREE.TextureLoader, path);

  const leftRef = useRef();
  const rightRef = useRef();
  const topRef = useRef();
  const bottomRef = useRef();

  useEffect(() => {
    const fixSideUV = (mesh, axis) => {
      if (!mesh || !mesh.geometry) return;
      const geom = mesh.geometry;
      const uv = geom.attributes.uv;
      for (let i = 0; i < uv.count; i++) {
        const u = uv.getX(i);
        const v = uv.getY(i);
        if (axis === "left") uv.setXY(i, 0, v);
        if (axis === "right") uv.setXY(i, 1, v);
        if (axis === "top") uv.setXY(i, u, 1);
        if (axis === "bottom") uv.setXY(i, u, 0);
      }
      uv.needsUpdate = true;
    };

    fixSideUV(leftRef.current, "left");
    fixSideUV(rightRef.current, "right");
    fixSideUV(topRef.current, "top");
    fixSideUV(bottomRef.current, "bottom");
  }, []);

  function onIntersection() {
    gsap.to(".grab-icon-container", { duration: 0.1, opacity: 1 });
  }

  function onIntersectionExit() {
    gsap.to(".grab-icon-container", { duration: 0.1, opacity: 0 });
  }

  return (
    <>
      {/* Body */}
      <RigidBody
        type="kinematicPosition"
        colliders={false}
        onIntersectionEnter={onIntersection}
        onIntersectionExit={onIntersectionExit}
      >
        {/* Colliders */}
        <CuboidCollider args={[size[0] * 0.5, size[1] * 0.5, size[2] * 0.5]} />
        <CuboidCollider args={[size[0] * 0.5, size[1] * 0.5, 0.6]} sensor />

        {/* Front face */}
        <mesh position={[0, 0, size[2] * 0.5]}>
          <planeGeometry args={[size[0], size[1]]} />
          <meshStandardMaterial map={texture} />
        </mesh>

        {/* Back face */}
        <mesh position={[0, 0, -size[2] * 0.5]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[size[0], size[1]]} />
          <meshStandardMaterial color="white" />
        </mesh>

        {/* Left side */}
        <mesh
          ref={leftRef}
          position={[-size[0] * 0.5, 0, 0]}
          rotation={[0, -Math.PI * 0.5, 0]}
        >
          <planeGeometry args={[size[2], size[1]]} />
          <meshStandardMaterial map={texture} />
        </mesh>

        {/* Right side */}
        <mesh
          ref={rightRef}
          position={[size[0] * 0.5, 0, 0]}
          rotation={[0, Math.PI * 0.5, 0]}
        >
          <planeGeometry args={[size[2], size[1]]} />
          <meshStandardMaterial map={texture} />
        </mesh>

        {/* Top side */}
        <mesh
          ref={topRef}
          position={[0, size[1] * 0.5, 0]}
          rotation={[-Math.PI * 0.5, 0, 0]}
        >
          <planeGeometry args={[size[0], size[2]]} />
          <meshStandardMaterial map={texture} />
        </mesh>

        {/* Bottom side */}
        <mesh
          ref={bottomRef}
          position={[0, -size[1] * 0.5, 0]}
          rotation={[Math.PI * 0.5, 0, 0]}
        >
          <planeGeometry args={[size[0], size[2]]} />
          <meshStandardMaterial map={texture} />
        </mesh>
      </RigidBody>
    </>
  );
}
