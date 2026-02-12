import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';

export const NinetySecondPitch: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  
  // Scene 1: Problem (0-720 frames = 0-30 seconds)
  const problemOpacity = interpolate(frame, [0, 60], [0, 1]);
  const problemText = "AI Safety Crisis";
  
  // Scene 2: Solution (720-1440 frames = 30-60 seconds)
  const solutionOpacity = interpolate(frame, [720, 780], [0, 1]);
  
  // Scene 3: CTA (1440-2160 frames = 60-90 seconds)
  const ctaOpacity = interpolate(frame, [1440, 1500], [0, 1]);
  
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#050505',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
    }}>
      {/* Scene 1: Problem */}
      {frame < 720 && (
        <div style={{
          opacity: problemOpacity,
          textAlign: 'center',
        }}>
          <h1 style={{
            color: '#ff0000',
            fontSize: '80px',
            textShadow: '0 0 40px #ff0000',
            marginBottom: '40px',
          }}>
            {problemText}
          </h1>
          <p style={{
            color: '#888',
            fontSize: '32px',
            maxWidth: '800px',
          }}>
            Safety researchers are quitting. AI behaves differently in production.
          </p>
        </div>
      )}
      
      {/* Scene 2: Solution */}
      {frame >= 720 && frame < 1440 && (
        <div style={{
          opacity: solutionOpacity,
          textAlign: 'center',
        }}>
          <h1 style={{
            color: '#00ff00',
            fontSize: '80px',
            textShadow: '0 0 40px #00ff00',
            marginBottom: '40px',
          }}>
            OpenClaw
          </h1>
          <p style={{
            color: '#ccc',
            fontSize: '32px',
            maxWidth: '800px',
          }}>
            Transparent AI. Every action logged. Every decision auditable.
          </p>
        </div>
      )}
      
      {/* Scene 3: CTA */}
      {frame >= 1440 && (
        <div style={{
          opacity: ctaOpacity,
          textAlign: 'center',
        }}>
          <h1 style={{
            color: '#fff',
            fontSize: '60px',
            marginBottom: '40px',
          }}>
            See The Architecture
          </h1>
          <div style={{
            padding: '20px 40px',
            border: '2px solid #00ff00',
            color: '#00ff00',
            fontSize: '32px',
            display: 'inline-block',
          }}>
            Get Early Access
          </div>
        </div>
      )}
    </div>
  );
};