import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import * as THREE from "three";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <>
    <Canvas
      shadows
      camera={{
        fov: 100,
        near: 0.1,
        far: 10,
        position: [0, 2, 10],
      }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 0.4;
      }}
    >
      <Experience />
    </Canvas>
  </>,
);
