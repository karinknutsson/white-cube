import Lights from "./Lights.jsx";
import Gallery from "./room/Gallery.jsx";
import { Perf } from "r3f-perf";
import { Physics } from "@react-three/rapier";
import Player from "./Player.jsx";
import { Environment } from "@react-three/drei";

export default function Experience() {
  const perfVisible = true;

  return (
    <>
      {perfVisible && <Perf position="top-left" />}

      <Lights />

      {/* <Physics debug> */}
      <Physics>
        <Environment files="./hdr/qwantani_dusk_2_puresky_1k.hdr" background />

        <Gallery />

        <Player />
      </Physics>
    </>
  );
}
