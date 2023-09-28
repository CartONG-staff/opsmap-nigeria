import { TKLabel } from "@/domain/utils/TKLabel";
import { TKFDFTrafficLightColor } from "./TKFDFTrafficLightColor";

export interface TKFDFTrafficLightItem {
  color: TKFDFTrafficLightColor;
  label: TKLabel | string;
}
