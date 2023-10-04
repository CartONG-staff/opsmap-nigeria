import { TKFDFTrafficLightConfiguration } from "./TKFDFTrafficLightConfiguration";
import { TKFDFTrafficLightProperties } from "./TKFDFTrafficLightProperties";

/**
 * Configuration of the traffic light configuration. the traffic_light_json file shoudl match this definition
 * The properties field is considered as default for all TrafficLightConfiguration, and can be overriden by local definitions
 */
export interface TKFDFTrafficLightsConfiguration {
  properties: TKFDFTrafficLightProperties;
  trafficLights: Record<string, TKFDFTrafficLightConfiguration>;
}
