import { TKFDFThematic } from "@/domain/fdf/TKFDFThematics";
import { TKLabel } from "@/domain/utils/TKLabel";
import { TKFDFThematicTrafficLightConfiguration } from "../fdf/TKFDFThematicTrafficLights/TKFDFThematicTrafficLightConfiguration";

// ////////////////////////////////////////////////////////////////////////////
// TKSubmissionThematic Concept description.
// ////////////////////////////////////////////////////////////////////////////

export interface TKSubmissionThematic {
  id: string; // id
  iconFileName: string;
  nameLabel: TKLabel;
  trafficLight?: TKFDFThematicTrafficLightConfiguration;
}

// ////////////////////////////////////////////////////////////////////////////
// TKSubmissionThematic Creation
// ////////////////////////////////////////////////////////////////////////////

export function TKCreateSubmissionThematic(
  thematic: TKFDFThematic
): TKSubmissionThematic {
  return {
    id: thematic.id,
    iconFileName: thematic.iconFileName,
    nameLabel: thematic.thematicLabel,
    trafficLight: thematic.trafficLight
  };
}
