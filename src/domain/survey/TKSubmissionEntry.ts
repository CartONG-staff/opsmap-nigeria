import { TKTrafficLightValues } from "../fdf/TKTrafficLightValues";
import { TKLabel } from "../ui/TKLabel";

// ////////////////////////////////////////////////////////////////////////////
// Entry abstract concept definition
// ////////////////////////////////////////////////////////////////////////////
export interface TKSubmissionEntryText {
  type: "text";
  field: string;
  fieldLabel: TKLabel;
  answerLabel: TKLabel;
  trafficLight: boolean;
  trafficLightColor: TKTrafficLightValues;
  isAnswered: boolean;
}
export interface TKSubmissionEntryAgePyramid {
  type: "age_pyramid";
  malesEntries: Array<number>;
  femalesEntries: Array<number>;
  malesLabels: Array<TKLabel>;
  isAnswered: true;
  femalesLabels: Array<TKLabel>;
}

// ////////////////////////////////////////////////////////////////////////////
// Alltogether type
// ////////////////////////////////////////////////////////////////////////////

export type TKSubmissionEntry =
  | TKSubmissionEntryText
  | TKSubmissionEntryAgePyramid;
