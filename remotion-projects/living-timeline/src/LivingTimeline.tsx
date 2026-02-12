import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';

const events = [
  {date: 'Feb 9', title: 'Anthropic Safety Lead Quits', desc: '"World is in peril" moves to UK to write poetry'},
  {date: 'Feb 10', title: 'xAI Co-founders Leave', desc: 'Half the founding team departs'},
  {date: 'Feb 11', title: 'US Declines Safety Report', desc: 'Government refuses to back 2026 AI Safety Report'},
];

export const LivingTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#0a0a0f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      padding: '60px',
    }}>
      <h1 style={{
        color: '#ff0000',
        fontSize: '60px',
        marginBottom: '60px',
        textShadow: '0 0 40px #ff0000',
      }}>
        AI Safety Crisis Timeline
      </h1>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        width: '100%',
        maxWidth: '1000px',
      }}>
        {events.map((event, index) => {
          const startFrame = index * 480; // 20 seconds per event
          const opacity = interpolate(frame, [startFrame, startFrame + 60], [0, 1]);
          const translateX = interpolate(frame, [startFrame, startFrame + 60], [100, 0]);
          
          if (frame < startFrame) return null;
          
          return (
            <div key={index} style={{
              opacity,
              transform: `translateX(${translateX}px)`,
              background: 'rgba(255,0,0,0.1)',
              border: '1px solid #ff0000',
              padding: '30px',
              borderRadius: '8px',
            }}>
              <div style={{
                color: '#ff6666',
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '10px',
              }}>
                {event.date}
              </div>
              <h2 style={{
                color: '#fff',
                fontSize: '36px',
                marginBottom: '10px',
              }}>
                {event.title}
              </h2>
              <p style={{
                color: '#888',
                fontSize: '24px',
              }}>
                {event.desc}
              </p>
            </div>
          );
        })}
      </div>
      
      {frame > 1200 && (
        <div style={{
          marginTop: '60px',
          textAlign: 'center',
          opacity: interpolate(frame, [1200, 1320], [0, 1]),
        }}>
          <h2 style={{
            color: '#00ff00',
            fontSize: '48px',
            marginBottom: '20px',
          }}>
            The Solution: Transparency
          </h2>
          <p style={{
            color: '#ccc',
            fontSize: '28px',
          }}>
            OpenClaw logs every action. Complete audit trails.
          </p>
        </div>
      )}
    </div>
  );
};