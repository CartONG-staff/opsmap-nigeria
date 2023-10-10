import { TKLabel } from "@/domain/utils/TKLabel";

// ////////////////////////////////////////////////////////////////////////////
// Thematic datatype
// ////////////////////////////////////////////////////////////////////////////

export enum TKFDFThematicTrafficLightRule {
  MEAN = "mean",
  MIN = "min",
  MAX = "max"
}
export interface TKFDFThematic {
  id: string;
  iconFileName: string;
  thematicLabel: TKLabel;
  trafficLightRule: TKFDFThematicTrafficLightRule;
}

export type TKTFDFhematicsCollection = Record<string, TKFDFThematic>;
