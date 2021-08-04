import { TKFDF } from "@/domain/fdf/TKFDF";
import { TKSubmissionEntryAgePyramid } from "./TKSubmissionEntry";

// ////////////////////////////////////////////////////////////////////////////
// EntryAgePyramid concept definition
// ////////////////////////////////////////////////////////////////////////////
export interface TKSubmissionEntryAgePyramidItem {
  field: string;
  value: string;
  type: string;
}

// ////////////////////////////////////////////////////////////////////////////
// EntryAgePyramid creation method
// ////////////////////////////////////////////////////////////////////////////

export function TKCreateSubmissionEntryAgePyramid(
  chartdata: Array<TKSubmissionEntryAgePyramidItem>,
  surveyConfiguration: TKFDF
): TKSubmissionEntryAgePyramid {
  const malesEntries = chartdata.filter(item => item.type === "m").reverse();
  const femalesEntries = chartdata.filter(item => item.type === "f").reverse();

  const malesDataset = malesEntries.map(item => Number(item.value));
  const femalesDataset = femalesEntries.map(item => Number(item.value));

  const malesLabel = malesEntries.map(
    item => surveyConfiguration.fieldsLabels[item.field]
  );
  const femalesLabel = femalesEntries.map(
    item => surveyConfiguration.fieldsLabels[item.field]
  );

  return {
    type: "age_pyramid",
    isAnswered: true,
    malesEntries: malesDataset,
    femalesEntries: femalesDataset,
    malesLabels: malesLabel,
    femalesLabels: femalesLabel
  };
}
