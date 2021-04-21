/* eslint-disable @typescript-eslint/camelcase */
import { TKFDF } from "@/domain/fdf/TKFDF";
import { TKSubmissionEntryAgePyramid } from "@/domain/core/TKSubmissionEntry";

export interface TKSubmissionEntryAgePyramidItem{
  field: string;
  value: string;
  type: string;
}

export function TKCreateSubmissionEntryAgePyramid(
  chartdata: Array<TKSubmissionEntryAgePyramidItem>,
  surveyConfiguration: TKFDF
): TKSubmissionEntryAgePyramid {
  const malesEntries = chartdata.filter(item => item.type === 'm');
  const femalesEntries = chartdata.filter(item => item.type === 'f');

  const malesDataset = malesEntries.map(item => Number(item.value));
  const femalesDataset = femalesEntries.map(item => Number(item.value));

  const malesLabel = malesEntries.map(item => surveyConfiguration.fieldsLabels[item.field]);
  const femalesLabel = femalesEntries.map(item => surveyConfiguration.fieldsLabels[item.field]);

  return new TKSubmissionEntryAgePyramid("agepyramid", malesLabel[0], malesDataset, femalesDataset, malesLabel, femalesLabel);
}
