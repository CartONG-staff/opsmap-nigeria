import { TKLabel } from "@/domain/ui/TKLabel";
import { TKSubmissionEntry } from "./TKSubmissionEntry";
import { TKFDF } from "@/domain/fdf/TKFDF";

// ////////////////////////////////////////////////////////////////////////////
// EntryAgePyramid concept definition
// ////////////////////////////////////////////////////////////////////////////

export class TKSubmissionEntryAgePyramid extends TKSubmissionEntry {
  malesEntries: Array<number>;
  femalesEntries: Array<number>;
  malesLabels: Array<TKLabel>;
  femalesLabels: Array<TKLabel>;

  constructor(
    field: string,
    fieldLabel: TKLabel,
    malesEntries: Array<number>,
    femalesEntries: Array<number>,
    malesLabels: Array<TKLabel>,
    femalesLabels: Array<TKLabel>
  ) {
    super(field, fieldLabel);
    this.malesEntries = malesEntries;
    this.femalesEntries = femalesEntries;
    this.malesLabels = malesLabels;
    this.femalesLabels = femalesLabels;
  }
}

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

  return new TKSubmissionEntryAgePyramid(
    "agepyramid",
    { labelEn: "agepyramid" },
    malesDataset,
    femalesDataset,
    malesLabel,
    femalesLabel
  );
}
