/* eslint-disable @typescript-eslint/camelcase */

import { TKThematic } from "@/domain/fdf/TKThematicsCollectionBuilder";
import { TKLabel } from "./TKLabel";
import { TKSubmissionEntry } from "./TKSubmissionEntry";

export interface TKSubmissionThematic {
  data: Array<TKSubmissionEntry>;
  formatted_name: string;
  icon_file_name: string;
  nameLabel: TKLabel;
}

export function TKSUbmissionThematicfromThematic(theam: TKThematic) : TKSubmissionThematic {
  return {
    data: [],
    formatted_name: theam.formatted_name,
    icon_file_name: theam.icon_file_name,
    nameLabel: {
      name: theam.thematic_label_en,
      label_en: theam.thematic_label_en,
      label_pt: theam.thematic_label_pt,
    }
  }
}