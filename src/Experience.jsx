import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import RoomScene from "./room/RoomScene.jsx";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import { Physics } from "@react-three/rapier";
import Player from "./Player.jsx";
import { Environment } from "@react-three/drei";
import ArtworkGallery from "./artwork/ArtworkGallery.jsx";

export default function Experience() {
  const { perfVisible } = useControls({ perfVisible: false });

  return (
    <>
      {perfVisible && <Perf position="top-left" />}

      {/* <OrbitControls makeDefault /> */}

      <Lights />

      {/* Center cube mesh */}
      {/* <mesh>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshNormalMaterial />
      </mesh> */}

      <Physics debug>
        {/* <Physics> */}
        <Environment files="./hdr/qwantani_dusk_2_puresky_1k.hdr" background />

        <RoomScene />

        <ArtworkGallery />

        <Player />
      </Physics>
    </>
  );
}
