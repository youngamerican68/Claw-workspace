import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, Sequence, Audio } from "remotion";

// Color scheme matching landing page
const colors = {
  primary: "#667eea",
  secondary: "#764ba2",
  dark: "#1a1a2e",
  white: "#ffffff",
  gray: "#f5f5f5",
  green: "#10b981",
  red: "#ef4444",
};

// Phone component
const Phone: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        width: 280,
        height: 560,
        backgroundColor: colors.dark,
        borderRadius: 40,
        padding: 8,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: colors.white,
          borderRadius: 32,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Scene 1: Missed Call
const MissedCallScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const ringPulse = Math.sin(frame * 0.5) * 0.1 + 1;
  const showMissed = frame > fps * 2;
  
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h2
          style={{
            color: colors.white,
            fontSize: 48,
            fontWeight: 800,
            marginBottom: 40,
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {showMissed ? "❌ Missed Call" : "📞 Incoming Call..."}
        </h2>
        
        <Phone>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: showMissed ? colors.gray : colors.white,
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: showMissed ? colors.red : colors.green,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 48,
                transform: showMissed ? "scale(1)" : `scale(${ringPulse})`,
                transition: "all 0.3s",
              }}
            >
              {showMissed ? "📵" : "📞"}
            </div>
            <p
              style={{
                marginTop: 20,
                fontSize: 20,
                fontWeight: 600,
                color: colors.dark,
              }}
            >
              {showMissed ? "Call Missed" : "Customer Calling"}
            </p>
            <p style={{ fontSize: 14, color: "#666", marginTop: 8 }}>
              {showMissed ? "You were on another job" : "+1 (555) 123-4567"}
            </p>
          </div>
        </Phone>
        
        {showMissed && (
          <p
            style={{
              color: colors.white,
              fontSize: 24,
              marginTop: 30,
              opacity: interpolate(frame, [fps * 2, fps * 2.5], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            💸 There goes a $500 job...
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: 60 Seconds Later
const TransitionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scale = spring({ frame, fps, from: 0.5, to: 1, durationInFrames: 20 });
  
  return (
    <AbsoluteFill
      style={{
        background: colors.dark,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center", transform: `scale(${scale})` }}>
        <p style={{ color: colors.primary, fontSize: 24, marginBottom: 10 }}>
          But wait...
        </p>
        <h2 style={{ color: colors.white, fontSize: 64, fontWeight: 800 }}>
          ⚡ 60 Seconds Later
        </h2>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: AI Calls Back
const AICallbackScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const messageIndex = Math.floor(frame / (fps * 1.2));
  
  const messages = [
    { from: "ai", text: "Hi! This is LeadRescue calling for ABC Plumbing. I saw you just tried to reach us!" },
    { from: "customer", text: "Oh great! Yeah, I have a leak under my sink." },
    { from: "ai", text: "I can help with that. When works best - tomorrow morning or afternoon?" },
    { from: "customer", text: "Tomorrow morning would be perfect." },
    { from: "ai", text: "Done! You're booked for 9 AM. We'll send a confirmation text." },
  ];
  
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h2
          style={{
            color: colors.white,
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 30,
          }}
        >
          🤖 AI Calls Back Instantly
        </h2>
        
        <Phone>
          <div
            style={{
              flex: 1,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              overflowY: "auto",
              backgroundColor: colors.gray,
            }}
          >
            {messages.slice(0, messageIndex + 1).map((msg, i) => {
              const isAI = msg.from === "ai";
              const msgFrame = frame - i * fps * 1.2;
              const opacity = interpolate(msgFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
              
              return (
                <div
                  key={i}
                  style={{
                    alignSelf: isAI ? "flex-start" : "flex-end",
                    maxWidth: "80%",
                    opacity,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: isAI ? colors.primary : colors.white,
                      color: isAI ? colors.white : colors.dark,
                      padding: "10px 14px",
                      borderRadius: 16,
                      fontSize: 13,
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>
        </Phone>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Appointment Booked
const BookedScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const checkScale = spring({ frame, fps, from: 0, to: 1, durationInFrames: 20 });
  
  return (
    <AbsoluteFill
      style={{
        background: colors.dark,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.green,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 30px",
            transform: `scale(${checkScale})`,
          }}
        >
          <span style={{ fontSize: 64 }}>✓</span>
        </div>
        
        <h2 style={{ color: colors.white, fontSize: 48, fontWeight: 800, marginBottom: 20 }}>
          Appointment Booked!
        </h2>
        
        <div
          style={{
            backgroundColor: colors.white,
            borderRadius: 16,
            padding: 24,
            maxWidth: 400,
            margin: "0 auto",
            opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <p style={{ fontSize: 18, fontWeight: 600, color: colors.dark, marginBottom: 8 }}>
            📅 Tomorrow, 9:00 AM
          </p>
          <p style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>
            Customer: John Smith
          </p>
          <p style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>
            Job: Sink leak repair
          </p>
          <p style={{ fontSize: 14, color: "#666" }}>
            Address: 123 Main St
          </p>
        </div>
        
        <p
          style={{
            color: colors.green,
            fontSize: 24,
            marginTop: 30,
            fontWeight: 600,
            opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          💰 $500 job saved!
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: CTA
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scale = spring({ frame, fps, from: 0.8, to: 1, durationInFrames: 25 });
  
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center", transform: `scale(${scale})` }}>
        <h1 style={{ color: colors.white, fontSize: 56, fontWeight: 800, marginBottom: 20 }}>
          LeadRescue
        </h1>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 28, marginBottom: 40 }}>
          Never lose another lead to a missed call
        </p>
        <div
          style={{
            backgroundColor: colors.white,
            color: colors.primary,
            padding: "16px 40px",
            borderRadius: 12,
            fontSize: 24,
            fontWeight: 700,
            display: "inline-block",
          }}
        >
          Join the Waitlist →
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Main composition
export const LeadRescueDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.dark }}>
      <Sequence from={0} durationInFrames={90}>
        <MissedCallScene />
      </Sequence>
      <Sequence from={90} durationInFrames={45}>
        <TransitionScene />
      </Sequence>
      <Sequence from={135} durationInFrames={180}>
        <AICallbackScene />
      </Sequence>
      <Sequence from={315} durationInFrames={90}>
        <BookedScene />
      </Sequence>
      <Sequence from={405} durationInFrames={90}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
