import "./style.css";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import LandingContent from "./components/LandingContent.jsx";
import LoggedInView from "./components/LoggedInView.jsx";
import { BrowserView, MobileView } from "react-device-detect";
import useGallery from "./stores/useGallery.js";
import useAuth from "./stores/useAuth.js";
import { Preload } from "@react-three/drei";

const FADE_DURATION = 600;

function LandingPage() {
  const showGallery = useGallery((state) => state.showGallery);
  const [rendered, setRendered] = useState(true);

  useEffect(() => {
    if (showGallery) {
      const timer = setTimeout(() => setRendered(false), FADE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [showGallery]);

  if (!rendered) return null;

  return (
    <div
      style={{
        opacity: showGallery ? 0 : 1,
        transition: `opacity ${FADE_DURATION}ms ease`,
        pointerEvents: showGallery ? "none" : "auto",
      }}
    >
      <LandingContent />
    </div>
  );
}

function App() {
  const user = useAuth((state) => state.user);
  const [canvasVisible, setCanvasVisible] = useState(!user);
  // const [canvasVisible, setCanvasVisible] = useState(false);
  const [loggedInVisible, setLoggedInVisible] = useState(!!user);
  // const [loggedInVisible, setLoggedInVisible] = useState(true);

  useEffect(() => {
    if (user) {
      setCanvasVisible(false);
      setTimeout(() => {
        setLoggedInVisible(true);
      }, FADE_DURATION);
    }
  }, [user]);

  return (
    <>
      <BrowserView>
        {canvasVisible && (
          <div
            style={{
              opacity: canvasVisible ? 1 : 0,
              transition: `opacity ${FADE_DURATION}ms ease`,
              width: "100%",
              height: "100%",
              pointerEvents: canvasVisible ? "auto" : "none",
            }}
          >
            <Canvas
              dpr={1}
              shadows
              camera={{
                fov: 75,
                near: 0.1,
                far: 40,
                position: [0, 1, 1.6],
                rotation: [0, Math.PI * 1.5, 0],
              }}
              onCreated={({ gl }) => {
                gl.toneMappingExposure = 0.4;
              }}
            >
              <Experience />
              <Preload all />
            </Canvas>
            <LandingPage />
          </div>
        )}
        {!canvasVisible && (
          <div
            style={{
              opacity: loggedInVisible ? 1 : 0,
              transition: `opacity ${FADE_DURATION}ms ease`,
              pointerEvents: loggedInVisible ? "auto" : "none",
            }}
          >
            <LoggedInView />
          </div>
        )}
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
    </>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(<App />);
