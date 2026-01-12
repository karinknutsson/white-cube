import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import RoomScene from "./room/RoomScene.jsx";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import { Physics } from "@react-three/rapier";
import Player from "./Player.jsx";
import * as data from "./data/exampleArtworks.js";
import Artwork from "./artwork/Artwork.jsx";
import { Environment } from "@react-three/drei";
import * as positionsData from "./data/positions.js";

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

        <Player />

        {data.data.map((work) => {
          if (!work.position) return null;

          return (
            <Artwork
              key={work.title}
              position={
                positionsData.positions[work.position.wall][
                  work.position.wallPosition
                ]
              }
              rotation={positionsData.positions[work.position.wall].rotation}
              type="canvas"
              path={work.path}
              size={work.size}
              artist={work.artist}
              title={work.title}
              year={work.year}
            ></Artwork>
          );
        })}
      </Physics>
    </>
  );
}
