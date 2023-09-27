import { TKFDFTrafficLightItem } from "./TKFDFTrafficLightItem";

export type TKFDFTrafficLigthColormap = Record<string, TKFDFTrafficLightItem>;

export interface TKFDFTrafficLightsProperties {
  colormap: TKFDFTrafficLigthColormap;
  colorerror: string; // index in colormap
}
