import { useEffect, useRef, useState } from "react";
import "./IntroAnimation.css";

const ICONS = ["🛒", "📍", "🤝", "⚡"];
const RADIUS = 100;
const ORBIT_MS = 1700;
const CONVERGE_MS = 550;
const HOLD_MS = 350;
const EXIT_MS = 550;

export default function IntroAnimation({ onFinish }) {
  const [positions, setPositions] = useState(
    ICONS.map((_, i) => ({ x: 0, y: 0, scale: 0, opacity: 0 }))
  );
  const [burst, setBurst] = useState(false);
  const [exiting, setExiting] = useState(false);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const easeInCubic = (t) => t * t * t;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;

      if (elapsed < ORBIT_MS) {
        const t = elapsed / ORBIT_MS;
        const spin = easeOutCubic(Math.min(t * 1.15, 1)) * 720;
        const grow = Math.min(t * 4, 1); // quick pop-in at start
        const next = ICONS.map((_, i) => {
          const angle = ((i * 90 + spin) * Math.PI) / 180;
          return {
            x: Math.cos(angle) * RADIUS,
            y: Math.sin(angle) * RADIUS,
            scale: grow,
            opacity: grow,
          };
        });
        setPositions(next);
        rafRef.current = requestAnimationFrame(tick);
      } else if (elapsed < ORBIT_MS + CONVERGE_MS) {
        const t = (elapsed - ORBIT_MS) / CONVERGE_MS;
        const eased = easeInCubic(t);
        const spin = 720 + t * 260; // keeps accelerating inward = "blast" feel
        const next = ICONS.map((_, i) => {
          const angle = ((i * 90 + spin) * Math.PI) / 180;
          const r = RADIUS * (1 - eased);
          return {
            x: Math.cos(angle) * r,
            y: Math.sin(angle) * r,
            scale: 1 - eased,
            opacity: 1 - eased,
          };
        });
        setPositions(next);
        if (!burst && t > 0.85) setBurst(true);
        rafRef.current = requestAnimationFrame(tick);
      } else if (elapsed < ORBIT_MS + CONVERGE_MS + HOLD_MS) {
        rafRef.current = requestAnimationFrame(tick);
      } else if (elapsed < ORBIT_MS + CONVERGE_MS + HOLD_MS + EXIT_MS) {
        if (!exiting) setExiting(true);
        rafRef.current = requestAnimationFrame(tick);
      } else {
        onFinish && onFinish();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`nkIntroWrap ${exiting ? "nkIntroExit" : ""}`}>
      <div className="nkOrb nkOrb1" />
      <div className="nkOrb nkOrb2" />

      <div className="nkCenterStage">
        {burst && <div className="nkBurst" />}

        <div className={`nkGlassBadge nkBadgeIn ${burst ? "nkBadgePulse" : ""}`}>
          <span style={{ fontSize: 34 }}>🏠</span>
          <div className="nkShine" />
        </div>

        <h1 className={`nkLogoText ${burst ? "nkLogoIn" : ""}`}>
          NUK<span>KAD</span>
        </h1>
        <p className={`nkTagline ${burst ? "nkLogoIn" : ""}`} style={{ animationDelay: "0.15s" }}>
          Your Local Market, Online.
        </p>

        {ICONS.map((emoji, i) => {
          const p = positions[i];
          return (
            <div
              key={emoji}
              className="nkGlassCircle"
              style={{
                transform: `translate(-50%, -50%) translate(${p.x}px, ${p.y}px) scale(${p.scale})`,
                opacity: p.opacity,
              }}
            >
              <span className="nkIconEmoji">{emoji}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
