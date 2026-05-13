import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import useWhiteCube from "@/stores/useWhiteCube";
import useAuth from "@/stores/useAuth";
import "../style.css";

export default function LandingContent() {
  const triggerTransform = useWhiteCube((state) => state.triggerTransform);
  const { login, loading, error, clearError } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function showSignIn() {
    setVisible(false);
    setTimeout(() => {
      setSigningIn(true);
      setVisible(true);
    }, 300);
  }

  function goBack() {
    clearError();
    setVisible(false);
    setTimeout(() => {
      setSigningIn(false);
      setVisible(true);
    }, 300);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await login(email, password);
  }

  return (
    <div className="landing-container">
      <div className="landing-content flex flex-col gap-6 m-60 justify-between">
        <h1 className="logo-large">white cube</h1>
        <div
          className="flex flex-col gap-6 transition-opacity duration-300"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {!signingIn ? (
            <>
              <p className="landing-text">
                An interactive 3D art gallery built with React Three Fiber.
              </p>
              <div className="flex flex-col gap-6">
                <Button onClick={showSignIn}>Sign In</Button>
                <Button onClick={triggerTransform}>View Demo</Button>
              </div>
            </>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-8 text-white/90 placeholder:text-white/50 border-b-2 border-b-white/40 focus-visible:border-b-white/80 font-medium"
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-8 text-white/90 placeholder:text-white/50 border-b-2 border-b-white/40 focus-visible:border-b-white/80 font-medium pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/90 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <Button type="submit" className="mt-2" disabled={loading}>
                {loading ? "Signing in…" : "Continue"}
              </Button>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="text-white/50 hover:text-white/90 transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  type="button"
                  className="text-xs text-white/50 hover:text-white/90 transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
