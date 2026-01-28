import { Composition } from "remotion";
import { LeadRescueDemo } from "./LeadRescueDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LeadRescueDemo"
        component={LeadRescueDemo}
        durationInFrames={495}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
