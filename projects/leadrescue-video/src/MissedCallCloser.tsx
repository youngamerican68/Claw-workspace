import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Audio,
  staticFile
} from "remotion";

// Luis Miguel palette from the landing page
const colors = {
  teal: "#0E7490",
  tealDark: "#0A5A6F",
  tealLight: "#22A3B8",
  palm: "#2E5A3F",
  palmLight: "#3D7A54",
  sand: "#C9A87C",
  sandLight: "#E4D4B8",
  cream: "#FAF9F6",
  creamDark: "#F0EDE8",
  black: "#111111",
  blackLight: "#1E1E1E",
};

// Scene 1: Problem - Phone ringing, missed call
const ProblemScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneShake = Math.sin(frame * 0.8) * (frame < 60 ? 5 : 0);
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const missedOpacity = interpolate(frame, [70, 90], [0, 1], { extrapolateRight: "clamp" });
  const textOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${colors.cream}, ${colors.creamDark})`,
      justifyContent: "center",
      alignItems: "center",
    }}>
      <div style={{ textAlign: "center" }}>
        {/* Phone icon */}
        <div style={{
          fontSize: 120,
          marginBottom: 30,
          opacity,
          transform: `translateX(${phoneShake}px)`,
        }}>
          📱
        </div>

        {/* Missed call indicator */}
        <div style={{
          opacity: missedOpacity,
          marginBottom: 30,
        }}>
          <span style={{
            background: "#ef4444",
            color: "white",
            padding: "12px 24px",
            borderRadius: 30,
            fontSize: 28,
            fontFamily: "system-ui",
            fontWeight: 600,
          }}>
            ❌ Missed Call
          </span>
        </div>

        {/* Text */}
        <h1 style={{
          fontFamily: "system-ui",
          fontSize: 56,
          color: colors.black,
          opacity: textOpacity,
          maxWidth: 800,
          lineHeight: 1.3,
        }}>
          Every missed call is a <span style={{ color: "#ef4444" }}>lost customer</span>
        </h1>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Solution - 60 second callback
const SolutionScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, from: 0.7, to: 1, durationInFrames: 25 });
  const logoOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const timerOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });
  const callbackOpacity = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" });

  // Countdown effect
  const countdown = Math.max(60 - Math.floor((frame - 50) / 2), 0);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${colors.tealDark}, ${colors.teal})`,
      justifyContent: "center",
      alignItems: "center",
    }}>
      <div style={{ textAlign: "center" }}>
        {/* Logo */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          marginBottom: 40,
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
          }}>
            📞
          </div>
          <span style={{
            fontFamily: "system-ui",
            fontSize: 52,
            fontWeight: 700,
            color: "white",
          }}>
            MissedCallCloser
          </span>
        </div>

        {/* Timer */}
        <div style={{
          opacity: timerOpacity,
          marginBottom: 30,
        }}>
          <div style={{
            fontSize: 100,
            fontWeight: 700,
            color: colors.sand,
            fontFamily: "system-ui",
          }}>
            {countdown}s
          </div>
          <div style={{
            fontSize: 28,
            color: colors.cream,
            fontFamily: "system-ui",
          }}>
            callback time
          </div>
        </div>

        {/* Callback text */}
        <div style={{
          opacity: callbackOpacity,
          background: "rgba(255,255,255,0.15)",
          padding: "20px 40px",
          borderRadius: 20,
        }}>
          <span style={{
            fontSize: 32,
            color: "white",
            fontFamily: "system-ui",
          }}>
            🔔 Calling customer back...
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Features - AI qualifying + booking
const FeaturesScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const feature1Opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const feature1Y = spring({ frame, fps, from: 30, to: 0, durationInFrames: 25 });
  
  const feature2Opacity = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" });
  const feature2Y = spring({ frame: frame - 40, fps, from: 30, to: 0, durationInFrames: 25 });

  return (
    <AbsoluteFill style={{
      background: colors.cream,
      justifyContent: "center",
      alignItems: "center",
      padding: 80,
    }}>
      <div style={{ display: "flex", gap: 60, justifyContent: "center" }}>
        {/* AI Chat feature */}
        <div style={{
          background: "white",
          borderRadius: 24,
          padding: 50,
          boxShadow: "0 15px 50px rgba(0,0,0,0.1)",
          opacity: feature1Opacity,
          transform: `translateY(${feature1Y}px)`,
          minWidth: 350,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 70, marginBottom: 20 }}>🤖</div>
          <h3 style={{
            fontFamily: "system-ui",
            fontSize: 32,
            color: colors.black,
            fontWeight: 700,
            marginBottom: 15,
          }}>
            AI Qualifies Leads
          </h3>
          <div style={{
            background: colors.creamDark,
            borderRadius: 16,
            padding: 20,
            marginTop: 20,
          }}>
            <p style={{
              fontSize: 22,
              color: colors.blackLight,
              fontFamily: "system-ui",
              fontStyle: "italic",
            }}>
              "What service do you need?"
            </p>
          </div>
        </div>

        {/* Calendar feature */}
        <div style={{
          background: "white",
          borderRadius: 24,
          padding: 50,
          boxShadow: "0 15px 50px rgba(0,0,0,0.1)",
          opacity: feature2Opacity,
          transform: `translateY(${feature2Y}px)`,
          minWidth: 350,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 70, marginBottom: 20 }}>📅</div>
          <h3 style={{
            fontFamily: "system-ui",
            fontSize: 32,
            color: colors.black,
            fontWeight: 700,
            marginBottom: 15,
          }}>
            Books Appointments
          </h3>
          <div style={{
            background: colors.teal,
            borderRadius: 12,
            padding: "15px 25px",
            marginTop: 20,
            display: "inline-block",
          }}>
            <span style={{
              fontSize: 20,
              color: "white",
              fontFamily: "system-ui",
              fontWeight: 600,
            }}>
              ✓ Thursday 2:00 PM
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: CTA - Never lose another lead
const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainScale = spring({ frame, fps, from: 0.8, to: 1, durationInFrames: 30 });
  const mainOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const urlOpacity = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" });
  const pulse = Math.sin(frame * 0.15) * 0.02 + 1;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${colors.tealDark}, ${colors.teal})`,
      justifyContent: "center",
      alignItems: "center",
    }}>
      <div style={{ textAlign: "center" }}>
        {/* Main headline */}
        <h1 style={{
          fontFamily: "system-ui",
          fontSize: 72,
          color: "white",
          fontWeight: 700,
          opacity: mainOpacity,
          transform: `scale(${mainScale})`,
          marginBottom: 50,
          lineHeight: 1.2,
        }}>
          Never lose<br />another lead
        </h1>

        {/* CTA button */}
        <div style={{
          opacity: urlOpacity,
          transform: `scale(${pulse})`,
        }}>
          <div style={{
            background: "white",
            borderRadius: 50,
            padding: "25px 50px",
            display: "inline-block",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          }}>
            <span style={{
              fontFamily: "system-ui",
              fontSize: 36,
              color: colors.tealDark,
              fontWeight: 700,
            }}>
              Try Free Demo →
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Main composition - 15 seconds total (450 frames at 30fps)
export const MissedCallCloserVideo = () => {
  // Scene timing matched to voiceover:
  // 0-4s: "Every missed call is a lost customer"
  // 4-8s: "MissedCallCloser calls them back in 60 seconds"
  // 8-12s: "with AI that qualifies leads and books appointments while you're busy"
  // 12-15s: "Never lose another lead"
  
  const fps = 30;
  const scene1 = 4 * fps;   // 120 frames
  const scene2 = 4 * fps;   // 120 frames
  const scene3 = 4 * fps;   // 120 frames
  const scene4 = 3 * fps;   // 90 frames

  return (
    <AbsoluteFill>
      <Audio src={staticFile("voiceover.mp3")} volume={1} />

      <Sequence from={0} durationInFrames={scene1}>
        <ProblemScene />
      </Sequence>
      
      <Sequence from={scene1} durationInFrames={scene2}>
        <SolutionScene />
      </Sequence>
      
      <Sequence from={scene1 + scene2} durationInFrames={scene3}>
        <FeaturesScene />
      </Sequence>
      
      <Sequence from={scene1 + scene2 + scene3} durationInFrames={scene4}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
