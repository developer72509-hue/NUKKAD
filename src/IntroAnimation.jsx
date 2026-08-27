/* Floating background orbs for depth */
.nkOrb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.35;
  animation: nkFloat 6s ease-in-out infinite;
}
.nkOrb1 {
  width: 220px; height: 220px;
  background: #f4a3ab;
  top: -60px; left: -60px;
}
.nkOrb2 {
  width: 260px; height: 260px;
  background: #ffc98a;
  bottom: -80px; right: -60px;
  animation-delay: 1.5s;
}
@keyframes nkFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-16px) scale(1.05); }
}

/* Stage container crossfade + 3D tilt */
.nkStageWrap {
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
}
.nkEntering {
  animation: nkStageIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.nkLeaving {
  animation: nkStageOut 0.38s cubic-bezier(0.55, 0, 1, 0.45) both;
}
@keyframes nkStageIn {
  from { opacity: 0; transform: translateY(18px) rotateX(-12deg) scale(0.92); }
  to   { opacity: 1; transform: translateY(0) rotateX(0deg) scale(1); }
}
@keyframes nkStageOut {
  from { opacity: 1; transform: translateY(0) rotateX(0deg) scale(1); }
  to   { opacity: 0; transform: translateY(-14px) rotateX(10deg) scale(0.94); }
}

/* Glass shared look */
.nkGlassCard, .nkGlassCircle, .nkGlassBadge {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow:
    0 8px 24px rgba(185, 28, 60, 0.15),
    inset 0 1px 1px rgba(255, 255, 255, 0.9);
}

/* Shutter */
.nkShutterCard {
  padding: 10px;
  border-radius: 20px;
}
.nkShutterBox {
  width: 118px;
  height: 86px;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 6px rgba(0,0,0,0.15);
}
.nkShutterLines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg, #b91c3c, #b91c3c 7px, #e8536f 7px, #e8536f 14px
  );
  animation: nkShutterUp 0.75s cubic-bezier(0.65, 0, 0.35, 1) forwards;
  animation-delay: 0.15s;
}
@keyframes nkShutterUp {
  from { transform: translateY(0) rotateX(0deg); }
  to   { transform: translateY(-100%) rotateX(-25deg); }
}
.nkShine {
  position: absolute;
  top: 0; left: -60%;
  width: 40%; height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.7), transparent);
  animation: nkShineSweep 1.4s ease-in-out 0.9s;
}
@keyframes nkShineSweep {
  to { left: 130%; }
}

/* Icons */
.nkGlassCircle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(20px) scale(0.5) rotateY(60deg);
  animation: nkPopIn 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.nkIconEmoji {
  font-size: 25px;
  filter: drop-shadow(0 2px 3px rgba(0,0,0,0.12));
}
@keyframes nkPopIn {
  60% { transform: translateY(-4px) scale(1.08) rotateY(0deg); opacity: 1; }
  to  { opacity: 1; transform: translateY(0) scale(1) rotateY(0deg); }
}

/* Logo badge */
.nkGlassBadge {
  width: 74px;
  height: 74px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, rgba(185,28,60,0.9), rgba(214,51,108,0.85));
  box-shadow:
    0 10px 26px rgba(185, 28, 60, 0.35),
    inset 0 1px 1px rgba(255,255,255,0.5);
}
.nkBadgePop {
  animation: nkBadgeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes nkBadgeIn {
  from { transform: scale(0.4) rotateY(-90deg); opacity: 0; }
  to   { transform: scale(1) rotateY(0deg); opacity: 1; }
}
.nkBadgeShine {
  animation-delay: 0.5s;
}

/* Logo text */
.nkLogoText {
  font-size: 34px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: 0.5px;
  opacity: 0;
  text-shadow: 0 1px 0 rgba(255,255,255,0.5);
}
.nkLogoText span { color: #d6336c; }

.nkTagline {
  font-size: 14px;
  color: #7a7a7a;
  margin-top: 6px;
  opacity: 0;
  letter-spacing: 0.2px;
}

.nkFadeUp {
  animation: nkFadeUpAnim 0.55s ease forwards;
}
@keyframes nkFadeUpAnim {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
