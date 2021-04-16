/* eslint-disable @typescript-eslint/camelcase */

import { TKThematic } from "../survey/surveyConfiguration/TKThematicsCollectionBuilder";
import { TKFieldLabel } from "./TKFieldLabel";
import { TKSubmissionEntry } from "./TKSubmissionEntry";

export interface TKSubmissionThematic {
  data: Array<TKSubmissionEntry>;
  formatted_name: string;
  icon_file_name: string;
  nameLabel: TKFieldLabel;
}

export function TKSUbmissionThematicfromThematic(theam: TKThematic) : TKSubmissionThematic {
  return {
    data: [],
    formatted_name: theam.formatted_name,
    icon_file_name: theam.icon_file_name,
    nameLabel: {
      field_name: theam.thematic_label_en,
      field_label_en: theam.thematic_label_en,
      field_label_pt: theam.thematic_label_pt,
    }
  }
}