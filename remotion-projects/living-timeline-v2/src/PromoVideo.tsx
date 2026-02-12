import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
} from "remotion";

const colors = {
  bg: "#0a0a0f",
  red: "#ff0000",
  redDark: "#1a0a0a",
  green: "#00ff00",
  cream: "#faf3e0",
  gray: "#888",
};

const events = [
  { date: "FEB 9", title: "Anthropic Safety Lead Quits", desc: '"The world is in peril." Former researcher leaves to write poetry in UK.' },
  { date: "FEB 10", title: "xAI Co-Founders Depart", desc: 'Half the founding team leaves. "Recursive self-improvement loops go live in 12 months."' },
  { date: "FEB 11", title: "US Declines Safety Report", desc: 'First time US refuses to back International AI Safety Report. Guardrails removed.' },
];

const IntroScene = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const scale = spring({ frame, fps: 30, from: 0.9, to: 1, durationInFrames: 30 });
  
  return (
    <AbsoluteFill style={{ background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity, transform: `scale(${scale})`, textAlign: "center" }}>
        <h1 style={{ color: colors.red, fontSize: "80px", fontWeight: "900", textShadow: "0 0 60px #ff0000", marginBottom: "20px" }}>
          AI SAFETY CRISIS
        </h1>
        <p style={{ color: colors.gray, fontSize: "30px" }}>February 2026</p>
      </div>
    </AbsoluteFill>
  );
};

const TimelineScene = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{ background: colors.bg, padding: "80px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <h2 style={{ color: colors.red, fontSize: "50px", marginBottom: "60px", textAlign: "center" }}>
        The Alarms Are Getting Louder
      </h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "40px", maxWidth: "900px", margin: "0 auto" }}>
        {events.map((event, i) => {
          const delay = i * 20;
          const opacity = interpolate(frame, [delay, delay + 20], [0, 1]);
          const x = interpolate(frame, [delay, delay + 20], [-50, 0]);
          
          return (
            <div key={i} style={{ 
              opacity, 
              transform: `translateX(${x}px)`,
              background: colors.redDark,
              border: "1px solid #ff0000",
              padding: "30px",
              borderRadius: "8px",
            }}>
              <div style={{ color: colors.red, fontSize: "18px", fontWeight: "700", letterSpacing: "3px", marginBottom: "10px" }}>
                {event.date}
              </div>
              <h3 style={{ color: colors.cream, fontSize: "32px", marginBottom: "10px" }}>
                {event.title}
              </h3>
              <p style={{ color: colors.gray, fontSize: "22px", lineHeight: 1.5 }}>
                {event.desc}
              </p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SolutionScene = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const scale = spring({ frame, fps: 30, from: 0.9, to: 1, durationInFrames: 30 });
  
  return (
    <AbsoluteFill style={{ background: "#001100", display: "flex", alignItems: "center", justifyContent: "center", borderTop: "4px solid #00ff00" }}>
      <div style={{ opacity, transform: `scale(${scale})`, textAlign: "center", padding: "60px" }}>
        <h2 style={{ color: colors.green, fontSize: "70px", fontWeight: "700", textShadow: "0 0 40px #00ff00", marginBottom: "30px" }}>
          THE SOLUTION
        </h2>
        <p style={{ color: colors.cream, fontSize: "32px", maxWidth: "700px", margin: "0 auto 40px", lineHeight: 1.6 }}>
          Transparency isn't a feature. It's the architecture.
        </p>
        <div style={{ 
          display: "inline-block", 
          padding: "25px 50px", 
          border: "3px solid #00ff00", 
          color: colors.green, 
          fontSize: "28px",
          fontWeight: "700"
        }}>
          See The Architecture
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const PromoVideo = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={120}>
        <IntroScene />
      </Sequence>
      <Sequence from={120} durationInFrames={240}>
        <TimelineScene />
      </Sequence>
      <Sequence from={360} durationInFrames={180}>
        <SolutionScene />
      </Sequence>
    </AbsoluteFill>
  );
};