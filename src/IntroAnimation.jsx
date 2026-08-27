import { useEffect, useState } from "react";
import "./IntroAnimation.css";

export default function IntroAnimation({ onFinish }) {
  const [stage, setStage] = useState("shutter"); // shutter -> icons -> logo -> done

  useEffect(() => {
    const t1 = setTimeout(() => setStage("icons"), 700);
    const t2 = setTimeout(() => setStage("logo"), 2400);
    const t3 = setTimeout(() => onFinish && onFinish(), 4600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  return (
    <div className="intro-screen">
      {/* Shutter stage */}
      <div className={`stage shutter-stage ${stage === "shutter" ? "stage-active" : "stage-hidden"}`}>
        <div className="shutter-box">
          <div className="shutter-lines" />
        </div>
      </div>

      {/* Icons stage */}
      <div className={`stage icons-stage ${stage === "icons" ? "stage-active" : "stage-hidden"}`}>
        <div className="icon-grid">
          <div className="icon-circle" style={{ animationDelay: "0.05s" }}>🛒</div>
          <div className="icon-circle" style={{ animationDelay: "0.2s" }}>📍</div>
          <div className="icon-circle" style={{ animationDelay: "0.35s" }}>🤝</div>
          <div className="icon-circle" style={{ animationDelay: "0.5s" }}>⚡</div>
        </div>
      </div>

      {/* Logo stage */}
      <div className={`stage logo-stage ${stage === "logo" ? "stage-active" : "stage-hidden"}`}>
        <div className="logo-badge">🏠</div>
        <h1 className="logo-text">
          NUK<span>KAD</span>
        </h1>
        <p className="logo-tagline">Your Local Market, Online.</p>
      </div>
    </div>
  );
}
