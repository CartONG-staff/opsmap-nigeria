/* eslint-disable @typescript-eslint/camelcase */

import { TKFDFThematic } from "@/domain/fdf/TKFDFThematics";
import { TKLabel } from "../ui/TKLabel";
import { TKSubmissionEntry } from "./TKSubmissionEntry";

// ////////////////////////////////////////////////////////////////////////////
// TKSubmissionThematic Concept description.
// ////////////////////////////////////////////////////////////////////////////

export interface TKSubmissionThematic {
  data: Array<TKSubmissionEntry>;
  formatted_name: string;
  icon_file_name: string;
  nameLabel: TKLabel;
}

// ////////////////////////////////////////////////////////////////////////////
// TKSubmissionThematic Creation
// ////////////////////////////////////////////////////////////////////////////

export function TKCreateSubmissionThematic(
  thematic: TKFDFThematic
): TKSubmissionThematic {
  return {
    data: [],
    formatted_name: thematic.formatted_name,
    icon_file_name: thematic.icon_file_name,
    nameLabel: {
      name: thematic.thematic_label_en,
      label_en: thematic.thematic_label_en,
      label_pt: thematic.thematic_label_pt
    }
  };
}
