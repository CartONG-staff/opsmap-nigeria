/* eslint-disable @typescript-eslint/camelcase */

import { TKSubmissionEntry } from "./TKSubmissionEntry";

export interface TKSubmissionThematic {
  data: Array<TKSubmissionEntry>;
  formatted_name: string;
  icon_file_name: string;
  thematic_label_en: string;
  thematic_label_pt?: string;
}