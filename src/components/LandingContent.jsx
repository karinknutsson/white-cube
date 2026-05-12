import { Button } from "@/components/ui/button";
import useWhiteCube from "@/stores/useWhiteCube";
import "../style.css";

export default function LandingContent() {
  const triggerTransform = useWhiteCube((state) => state.triggerTransform);

  return (
    <div className="landing-container">
      <div className="landing-content flex flex-col gap-6 m-60">
        <h1 className="logo">white cube</h1>
        <p>An interactive 3D art gallery built with React Three Fiber.</p>
        <Button>Sign In</Button>
        <Button onClick={triggerTransform}>View Demo</Button>
      </div>
    </div>
  );
}
