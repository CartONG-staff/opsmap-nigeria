/* eslint-disable @typescript-eslint/camelcase */

import { TKSubmissionEntry } from "./TKSubmissionEntry";

export interface TKSubmissionThematic {
  data: Array<TKSubmissionEntry>;
  formatted_name: string;
  icon_file_name: string;
  thematic_label_en: string;
  thematic_label_pt?: string;
}

export const TK_SUBMISSION_THEMATIC_DEFAULT: TKSubmissionThematic = {
  data: [],
  formatted_name: "",
  icon_file_name: "",
  thematic_label_en: "",
  thematic_label_pt: ""
};

export function filterThematicUnanswered(thematic: TKSubmissionThematic) {
  thematic.data = thematic.data.filter((item: TKSubmissionEntry) =>
    item.isAnswered()
  );
}
