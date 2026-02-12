import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

const config = {
  brand: "OpenClaw",
  tagline: "Transparent AI Infrastructure",
  url: "openclaw.ai",
  problem: "AI Safety Crisis",
  problemDetails: "Researchers quitting. Black-box systems. No accountability.",
  solution: "Safety Through Transparency",
  features: [
    { icon: "📋", title: "Full Audit Trail", desc: "Every action logged" },
    { icon: "🔍", title: "Complete Visibility", desc: "See every decision" },
    { icon: "🛡️", title: "Accountable AI", desc: "Verify everything" },
  ],
  proofTitle: "When researchers quit...",
  proofItems: ["Anthropic safety head", "xAI co-founders", "US declines safety report"],
  ctaTitle: "See The Architecture",
};

const colors = {
  primary: "#0a0a0f",
  secondary: "#1a1a2e",
  accent: "#ff0000",
  solution: "#00ff00",
  cream: "#faf3e0",
  white: "#ffffff",
};

const TitleScene = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const scale = spring({ frame, fps: 30, from: 0.8, to: 1, durationInFrames: 30 });
  
  return (
    <AbsoluteFill style={{ background: colors.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity, transform: `scale(${scale})`, textAlign: "center" }}>
        <h1 style={{ color: colors.accent, fontSize: "100px", fontWeight: "900", textShadow: "0 0 60px #ff0000", marginBottom: "40px" }}>
          {config.problem}
        </h1>
        <p style={{ color: colors.cream, fontSize: "40px" }}>{config.tagline}</p>
      </div>
    </AbsoluteFill>
  );
};

const ProblemScene = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  
  return (
    <AbsoluteFill style={{ background: colors.secondary, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px" }}>
      <div style={{ opacity }}>
        <h2 style={{ color: colors.accent, fontSize: "60px", marginBottom: "40px" }}>The Alarms Are Getting Louder</h2>
        <p style={{ color: colors.cream, fontSize: "36px", maxWidth: "800px", lineHeight: 1.6 }}>
          {config.problemDetails}
        </p>
      </div>
    </AbsoluteFill>
  );
};

const SolutionScene = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  
  return (
    <AbsoluteFill style={{ background: colors.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity, textAlign: "center" }}>
        <h2 style={{ color: colors.solution, fontSize: "80px", fontWeight: "700", textShadow: "0 0 40px #00ff00", marginBottom: "40px" }}>
          {config.solution}
        </h2>
        <p style={{ color: colors.cream, fontSize: "36px" }}>OpenClaw logs every action. Complete audit trails.</p>
      </div>
    </AbsoluteFill>
  );
};

const FeaturesScene = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{ background: colors.secondary, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px" }}>
      <div style={{ display: "flex", gap: "60px", justifyContent: "center" }}>
        {config.features.map((feature, i) => {
          const delay = i * 10;
          const opacity = interpolate(frame, [delay, delay + 20], [0, 1]);
          return (
            <div key={i} style={{ opacity, textAlign: "center", background: "rgba(255,255,255,0.05)", padding: "40px", borderRadius: "12px", width: "250px" }}>
              <div style={{ fontSize: "60px", marginBottom: "20px" }}>{feature.icon}</div>
              <h3 style={{ color: colors.solution, fontSize: "28px", marginBottom: "10px" }}>{feature.title}</h3>
              <p style={{ color: colors.cream, fontSize: "20px" }}>{feature.desc}</p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const ProofScene = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{ background: colors.primary, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px" }}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ color: colors.accent, fontSize: "50px", marginBottom: "60px" }}>{config.proofTitle}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          {config.proofItems.map((item, i) => {
            const delay = i * 15;
            const opacity = interpolate(frame, [delay, delay + 20], [0, 1]);
            return (
              <div key={i} style={{ opacity, color: colors.cream, fontSize: "32px", background: "rgba(255,0,0,0.1)", padding: "20px 40px", borderRadius: "8px", border: "1px solid #ff0000" }}>
                {item}
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
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const scale = spring({ frame, fps: 30, from: 0.9, to: 1, durationInFrames: 30 });
  
  return (
    <AbsoluteFill style={{ background: colors.secondary, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity, transform: `scale(${scale})`, textAlign: "center" }}>
        <h2 style={{ color: colors.white, fontSize: "70px", marginBottom: "40px" }}>{config.ctaTitle}</h2>
        <p style={{ color: colors.cream, fontSize: "30px", marginBottom: "60px" }}>{config.url}</p>
        <div style={{ display: "inline-block", padding: "30px 60px", border: `4px solid ${colors.solution}`, color: colors.solution, fontSize: "36px", fontWeight: "700" }}>
          Get Early Access
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const PromoVideo = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={180}>
        <TitleScene />
      </Sequence>
      <Sequence from={180} durationInFrames={180}>
        <ProblemScene />
      </Sequence>
      <Sequence from={360} durationInFrames={180}>
        <SolutionScene />
      </Sequence>
      <Sequence from={540} durationInFrames={180}>
        <FeaturesScene />
      </Sequence>
      <Sequence from={720} durationInFrames={180}>
        <ProofScene />
      </Sequence>
      <Sequence from={900} durationInFrames={180}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};