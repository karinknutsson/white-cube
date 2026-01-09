import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import Room from "./Room.jsx";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import { Physics } from "@react-three/rapier";
import Player from "./Player.jsx";
import * as data from "./data/exampleData.js";
import Artwork from "./artwork/Artwork.jsx";

export default function Experience() {
  const { perfVisible } = useControls({ perfVisible: false });

  return (
    <>
      {perfVisible && <Perf position="top-left" />}

      {/* <OrbitControls makeDefault /> */}

      <Lights />

      {/* <mesh>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshNormalMaterial />
      </mesh> */}
      {/* <Physics debug> */}
      <Physics>
        <Room />
        <Player />

        {data.data.map((work) => {
          return (
            <Artwork
              key={work.title}
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
