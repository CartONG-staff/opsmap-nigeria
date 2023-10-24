import { TKLabel } from "@/domain/utils/TKLabel";
import { TKFDFThematicTrafficLightConfiguration } from "./TKFDFThematicTrafficLights/TKFDFThematicTrafficLightConfiguration";

// ////////////////////////////////////////////////////////////////////////////
// Thematic datatype
// ////////////////////////////////////////////////////////////////////////////

export interface TKFDFThematic {
  id: string;
  iconFileName: string;
  thematicLabel: TKLabel;
  trafficLight?: TKFDFThematicTrafficLightConfiguration;
}

export type TKTFDFhematicsCollection = Record<string, TKFDFThematic>;
