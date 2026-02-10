import { RigidBody, BallCollider } from "@react-three/rapier";

export default function FloatObject({
  size,
  position,
  onEnterGrabArea,
  onLeaveGrabArea,
}) {
  function handleIntersectionEnter(e) {
    console.log(e);
    if (e.colliderObject.parent.name === "player") {
      onEnterGrabArea();
    }
  }

  return (
    <RigidBody type="dynamic" colliders={false} position={position}>
      {/* Colliders */}
      <BallCollider args={[size]} />
      <BallCollider
        args={[0.5]}
        sensor
        onIntersectionEnter={handleIntersectionEnter}
        onIntersectionExit={onLeaveGrabArea}
      />

      {/* Sphere mesh */}
      <mesh>
        {/* <octahedronGeometry args={[size, 64]} /> */}
        <torusKnotGeometry args={[size, size * 0.5, 64, 16]} />
        <meshPhysicalMaterial
          color="#796cd9"
          roughness={0}
          metalness={0.5}
          transmission={1}
          transparent
          thickness={0.5}
          ior={2.5}
          iridescence={1}
        />
      </mesh>

      {/* Invisible mesh for raycaster */}
      <mesh name="floatObject">
        <sphereGeometry args={[0.5]} /> <meshBasicMaterial visible={false} />
      </mesh>
    </RigidBody>
  );
}
