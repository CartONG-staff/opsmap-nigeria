import { TKFDFTrafficLightConfiguration } from "./TKFDFTrafficLightConfiguration";
import { TKFDFTrafficLightsProperties } from "./TKFDFTrafficLightProperties";

// ////////////////////////////////////////////////////////////////////////////
//
// ////////////////////////////////////////////////////////////////////////////

export interface TKFDFTrafficLightsConfiguration {
  properties?: TKFDFTrafficLightsProperties;
  trafficLights: Record<string, TKFDFTrafficLightConfiguration>;
}
