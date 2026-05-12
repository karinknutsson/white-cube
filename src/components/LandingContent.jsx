import { Button } from "@/components/ui/button";
import "../style.css";

export default function LandingContent() {
  return (
    <div className="landing-container">
      <div className="landing-content flex flex-col gap-4 m-60">
        <h1>white cube</h1>
        <p>An interactive 3D art gallery built with React Three Fiber.</p>
        <Button>Sign In</Button>
        <Button>View Demo</Button>
      </div>
    </div>
  );
}
