import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

const roomMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" });
const planeGeometry = new THREE.PlaneGeometry(1, 1);
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

export default function RoomMesh({ position }) {
  return <RigidBody type="fixed" colliders="trimesh"></RigidBody>;
}
