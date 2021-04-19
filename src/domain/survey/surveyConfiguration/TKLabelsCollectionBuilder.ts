/* eslint-disable @typescript-eslint/camelcase */

import { TKAnswerLabel } from "@/domain/core/TKAnswerLabel";
import { TKLabel } from "@/domain/core/TKLabel";
import { TKFieldLabelCSV, TKToLabel } from "./TKFieldLabelCSV";

export interface TKLabelsCollection {
  [propName: string]: TKLabel;
}

export interface TKAnswerLabelsCollection {
  [propName: string]: TKAnswerLabel;
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
  labels: TKAnswerLabel[]
): TKAnswerLabelsCollection {
  const labelsCollection: TKAnswerLabelsCollection = {};
  labels.map((item: TKAnswerLabel) => {
    labelsCollection[item.choice_name] = { ...item };
  });
  return labelsCollection;
}
