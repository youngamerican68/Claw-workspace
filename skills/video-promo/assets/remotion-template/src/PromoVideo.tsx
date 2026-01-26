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

// ==================== CUSTOMIZE THESE ====================
const config = {
  brand: "Your Brand",
  tagline: "Your tagline here",
  url: "yourbrand.com",

  // Problem/solution messaging
  problem: "Tired of [pain point]?",
  problemDetails: "Generic solutions. No real value.",
  solution: "A better way",

  // Features (3 max recommended)
  features: [
    { icon: "🎯", title: "Feature 1", desc: "Description" },
    { icon: "⚡", title: "Feature 2", desc: "Description" },
    { icon: "✨", title: "Feature 3", desc: "Description" },
  ],

  // Social proof / examples
  proofTitle: "Trusted by many",
  proofItems: ["Example 1", "Example 2", "Example 3"],

  // CTA
  ctaTitle: "Get Started Today",
};

// Color palette - swap for different vibes
const colors = {
  primary: "#1a1a2e",   // Deep background
  secondary: "#16213e", // Darker shade
  accent: "#e94560",    // Pop color
  gold: "#d4a574",      // Warm highlight
  cream: "#faf3e0",     // Light text/bg
  white: "#ffffff",
};

// ==================== SCENES ====================

const TitleScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = spring({ frame, fps, from: 50, to: 0, durationInFrames: 30 });
  const taglineOpacity = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{
          fontFamily: "Georgia, serif",
          fontSize: 100,
          color: colors.cream,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`
        }}>
          {config.brand}
        </h1>
        <h2 style={{
          fontFamily: "system-ui",
          fontSize: 48,
          color: colors.gold,
          opacity: taglineOpacity,
          marginTop: 20
        }}>
          {config.tagline}
        </h2>
      </div>
    </AbsoluteFill>
  );
};

const ProblemScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const scale = spring({ frame, fps, from: 0.9, to: 1, durationInFrames: 30 });

  return (
    <AbsoluteFill style={{
      background: colors.cream,
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{ textAlign: "center", maxWidth: 1400 }}>
        <h2 style={{
          fontFamily: "Georgia, serif",
          fontSize: 72,
          color: colors.primary,
          opacity,
          transform: `scale(${scale})`
        }}>
          {config.problem}
        </h2>
        <p style={{
          fontFamily: "system-ui",
          fontSize: 36,
          color: colors.secondary,
          opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" }),
          marginTop: 40
        }}>
          {config.problemDetails}
        </p>
      </div>
    </AbsoluteFill>
  );
};

const SolutionScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, from: 0.5, to: 1, durationInFrames: 40 });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{
          fontFamily: "Georgia, serif",
          fontSize: 100,
          color: colors.cream,
          opacity,
          transform: `scale(${logoScale})`
        }}>
          {config.brand}
        </h1>
        <h2 style={{
          fontFamily: "system-ui",
          fontSize: 52,
          color: colors.gold,
          opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" }),
          marginTop: 30
        }}>
          {config.solution}
        </h2>
      </div>
    </AbsoluteFill>
  );
};

const FeaturesScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{
      background: colors.cream,
      justifyContent: "center",
      alignItems: "center",
      padding: 100
    }}>
      <div style={{ display: "flex", gap: 60, justifyContent: "center" }}>
        {config.features.map((feature, i) => {
          const delay = i * 20;
          const cardOpacity = interpolate(frame, [delay, delay + 25], [0, 1], { extrapolateRight: "clamp" });
          const cardY = spring({ frame: frame - delay, fps, from: 50, to: 0, durationInFrames: 30 });

          return (
            <div key={i} style={{
              background: colors.white,
              borderRadius: 20,
              padding: "50px 60px",
              textAlign: "center",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              opacity: cardOpacity,
              transform: `translateY(${cardY}px)`,
              minWidth: 280
            }}>
              <div style={{ fontSize: 70, marginBottom: 20 }}>{feature.icon}</div>
              <h3 style={{
                fontFamily: "Georgia, serif",
                fontSize: 36,
                color: colors.primary,
                marginBottom: 15
              }}>{feature.title}</h3>
              <p style={{
                fontFamily: "system-ui",
                fontSize: 24,
                color: colors.secondary
              }}>{feature.desc}</p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const ProofScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{
          fontFamily: "Georgia, serif",
          fontSize: 60,
          color: colors.cream,
          opacity: titleOpacity,
          marginBottom: 50
        }}>
          {config.proofTitle}
        </h2>
        <div style={{ display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center" }}>
          {config.proofItems.map((item, i) => {
            const delay = 25 + i * 15;
            const itemOpacity = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateRight: "clamp" });

            return (
              <div key={i} style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: 15,
                padding: "20px 40px",
                opacity: itemOpacity,
                border: `1px solid ${colors.gold}40`
              }}>
                <span style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 28,
                  color: colors.cream
                }}>{item}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainScale = spring({ frame, fps, from: 0.8, to: 1, durationInFrames: 40 });
  const urlOpacity = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" });
  const pulse = Math.sin(frame * 0.1) * 0.03 + 1;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{
          fontFamily: "Georgia, serif",
          fontSize: 80,
          color: colors.white,
          transform: `scale(${mainScale})`,
          marginBottom: 50
        }}>
          {config.ctaTitle}
        </h2>
        <div style={{
          background: colors.white,
          borderRadius: 60,
          padding: "25px 60px",
          display: "inline-block",
          opacity: urlOpacity,
          transform: `scale(${pulse})`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
        }}>
          <span style={{
            fontFamily: "system-ui",
            fontSize: 40,
            color: colors.primary,
            fontWeight: 600
          }}>{config.url}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ==================== MAIN COMPOSITION ====================

export const PromoVideo = () => {
  const sceneDuration = 180; // 6 seconds each at 30fps

  return (
    <AbsoluteFill>
      {/* Uncomment to add background music */}
      {/* <Audio src={staticFile("music.mp3")} volume={0.3} /> */}

      <Sequence from={0} durationInFrames={sceneDuration}><TitleScene /></Sequence>
      <Sequence from={sceneDuration} durationInFrames={sceneDuration}><ProblemScene /></Sequence>
      <Sequence from={sceneDuration * 2} durationInFrames={sceneDuration}><SolutionScene /></Sequence>
      <Sequence from={sceneDuration * 3} durationInFrames={sceneDuration}><FeaturesScene /></Sequence>
      <Sequence from={sceneDuration * 4} durationInFrames={sceneDuration}><ProofScene /></Sequence>
      <Sequence from={sceneDuration * 5} durationInFrames={sceneDuration}><CTAScene /></Sequence>
    </AbsoluteFill>
  );
};
