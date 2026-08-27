import { useEffect, useState } from "react";
import "./IntroAnimation.css";

export default function IntroAnimation({ onFinish }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 300);   // shutter opens
    const t2 = setTimeout(() => setStage(2), 1200);  // icons pop
    const t3 = setTimeout(() => setStage(3), 2600);  // logo reveal
    const t4 = setTimeout(() => onFinish && onFinish(), 4200); // done

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onFinish]);

  return (
    <div className="intro-screen">
      <div className={`shutter ${stage >= 1 ? "shutter-open" : ""}`}>
        <div className="shutter-lines" />
      </div>

      <div className={`icon-row ${stage >= 2 ? "icons-show" : ""}`}>
        <span className="intro-icon" style={{ animationDelay: "0s" }}>🛒</span>
        <span className="intro-icon" style={{ animationDelay: "0.15s" }}>📍</span>
        <span className="intro-icon" style={{ animationDelay: "0.3s" }}>🤝</span>
        <span className="intro-icon" style={{ animationDelay: "0.45s" }}>⚡</span>
      </div>

      <div className={`logo-reveal ${stage >= 3 ? "logo-show" : ""}`}>
        <div className="logo-badge">🏠</div>
        <h1 className="logo-text">
          NUK<span>KAD</span>
        </h1>
        <p className="logo-tagline">Your Local Market, Online.</p>
      </div>
    </div>
  );
}
