import { TKFDFTrafficLigthColormap } from "./TKFDFTrafficLightColormap";

/**
 * Property of a colormap
 *
 * - colormap of the trafficlight
 * - colorerror: key in colormap that represents the error field
 */
export interface TKFDFTrafficLightProperties {
  colormap: TKFDFTrafficLigthColormap;
  colorerror: string; // index in colormap
}
