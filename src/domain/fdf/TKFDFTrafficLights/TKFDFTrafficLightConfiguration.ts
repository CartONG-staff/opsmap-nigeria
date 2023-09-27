import { TKFDFTrafficLights } from "./TKFDFTrafficLights";
import { TKFDFTrafficLightsProperties } from "./TKFDFTrafficLightProperties";

// ////////////////////////////////////////////////////////////////////////////
//
// ////////////////////////////////////////////////////////////////////////////

export interface TKFDFTrafficLightsConfiguration {
  properties?: TKFDFTrafficLightsProperties;
  trafficLights: Record<string, TKFDFTrafficLights>;
}
