/* eslint-disable @typescript-eslint/camelcase */


import { TKLabel } from "@/domain/core/TKLabel";
import { TKFieldLabelCSV, TKToLabel } from "./TKFieldLabelCSV";

export interface TKLabelsCollection {
  [propName: string]: TKLabel;
}

export function TKLabelsCollectionBuild(
  labels: TKFieldLabelCSV[]
): TKLabelsCollection {
  const labelsCollection: TKLabelsCollection = {};
  labels.map((item: TKFieldLabelCSV) => {
    labelsCollection[ item.field_name] = TKToLabel(item);
  });
  return labelsCollection;
}

