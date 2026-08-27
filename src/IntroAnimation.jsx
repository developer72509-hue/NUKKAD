import { useEffect, useState } from "react";
import "./IntroAnimation.css";

const wrapStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(160deg, #fff5ee 0%, #fdeee5 45%, #ffffff 100%)",
  overflow: "hidden",
};

export default function IntroAnimation({ onFinish }) {
  const [stage, setStage] = useState("shutter");

  useEffect(() => {
    const t1 = setTimeout(() => setStage("icons"), 700);
    const t2 = setTimeout(() => setStage("logo"), 2400);
    const t3 = setTimeout(() => onFinish && onFinish(), 4600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  return (
    <div style={wrapStyle}>
      {stage === "shutter" && (
        <div
          style={{
            width: 120,
            height: 88,
            borderRadius: "14px 14px 6px 6px",
            border: "3px solid #b91c3c",
            overflow: "hidden",
            position: "relative",
            background: "#fff",
          }}
        >
          <div className="nkShutterLines" />
        </div>
      )}

      {stage === "icons" && (
        <div style={{ display: "flex", gap: 18 }}>
          {["🛒", "📍", "🤝", "⚡"].map((emoji, i) => (
            <div
              key={emoji}
              className="nkIconPop"
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#fff",
                boxShadow: "0 4px 14px rgba(185,28,60,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                animationDelay: `${i * 0.15}s`,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      )}

      {stage === "logo" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            className="nkBadgePop"
            style={{
              width: 68,
              height: 68,
              background: "#b91c3c",
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              marginBottom: 12,
              boxShadow: "0 6px 18px rgba(185,28,60,0.25)",
            }}
          >
            🏠
          </div>
          <h1
            className="nkFadeUp"
            style={{ fontSize: 32, fontWeight: 800, color: "#1a1a1a", margin: 0, animationDelay: "0.15s" }}
          >
            NUK<span style={{ color: "#d6336c" }}>KAD</span>
          </h1>
          <p
            className="nkFadeUp"
            style={{ fontSize: 13.5, color: "#7a7a7a", marginTop: 6, animationDelay: "0.35s" }}
          >
            Your Local Market, Online.
          </p>
        </div>
      )}
    </div>
  );
}
