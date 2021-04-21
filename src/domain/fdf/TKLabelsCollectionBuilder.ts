/* eslint-disable @typescript-eslint/camelcase */

import { TKAnswerLabelCSV } from "@/domain/fdf/TKAnswerLabelCSV";
import { TKLabel } from "@/domain/core/TKLabel";
import { TKFieldLabelCSV, TKToLabel } from "./TKFieldLabelCSV";

export interface TKLabelsCollection {
  [propName: string]: TKLabel;
}

export interface TKAnswerLabelsCollection {
  [propName: string]: TKAnswerLabelCSV;
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

export function TKAnswerLabelsCollectionBuild(
  labels: TKAnswerLabelCSV[]
): TKAnswerLabelsCollection {
  const labelsCollection: TKAnswerLabelsCollection = {};
  labels.map((item: TKAnswerLabelCSV) => {
    labelsCollection[item.choice_name] = { ...item };
  });
  return labelsCollection;
}
