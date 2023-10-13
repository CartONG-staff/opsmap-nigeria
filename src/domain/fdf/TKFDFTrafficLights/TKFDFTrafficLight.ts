import { TKFDFTrafficLightColormapItem } from "./TKFDFTrafficLightColormap";
import { TKFDFTrafficLightConfiguration } from "./TKFDFTrafficLightConfiguration";

export interface TKFDFTrafficLight {
  configuration: TKFDFTrafficLightConfiguration;
  rank: number;
  value: TKFDFTrafficLightColormapItem;
}
