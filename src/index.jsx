import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import { BrowserView, MobileView } from "react-device-detect";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <>
    <BrowserView>
      <Canvas
        dpr={1}
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
    </BrowserView>

    <MobileView>
      <div className="mobile-message-container">
        <div className="mobile-message">
          <h1 className="mobile-message-title">white cube</h1>
          <p>
            white cube is an ongoing project created to visualize and plan art
            exhibitions. Mobile support will be available soon.
          </p>
        </div>
      </div>
    </MobileView>
  </>,
);
