import { TKLabel } from "@/domain/utils/TKLabel";
import { TKFDFTrafficLightColor } from "./TKFDFTrafficLightColor";

export interface TKFDFTrafficLightColormapItem {
  color: TKFDFTrafficLightColor;
  label: TKLabel | string;
}
/**
 * A Map type that link a key and a traffic light item
 */
export type TKFDFTrafficLigthColormap = Record<
  string,
  TKFDFTrafficLightColormapItem
>;
