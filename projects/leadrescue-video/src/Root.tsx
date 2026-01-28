import { Composition } from "remotion";
import { PromoVideo } from "./PromoVideo";
import { LeadRescueDemo } from "./LeadRescueDemo";
import { MissedCallCloserVideo } from "./MissedCallCloser";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="PromoVideo"
        component={PromoVideo}
        durationInFrames={1080}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LeadRescueDemo"
        component={LeadRescueDemo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MissedCallCloser"
        component={MissedCallCloserVideo}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
