import { TKFDFThematic } from "@/domain/fdf/TKFDFThematics";
import { TKLabel } from "../utils/TKLabel";

// ////////////////////////////////////////////////////////////////////////////
// TKSubmissionThematic Concept description.
// ////////////////////////////////////////////////////////////////////////////

export interface TKSubmissionThematic {
  id: string; // id
  iconFileName: string;
  nameLabel: TKLabel;
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
    nameLabel: thematic.thematicLabel
  };
}
