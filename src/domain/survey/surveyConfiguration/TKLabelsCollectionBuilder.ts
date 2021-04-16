import { TKAnswerLabel } from "@/domain/core/TKAnswerLabel";
import { TKFieldLabel } from "@/domain/core/TKFieldLabel";

export interface TKFieldLabelsCollection {
  [propName: string]: TKFieldLabel;
}

export interface TKAnswerLabelsCollection {
  [propName: string]: TKAnswerLabel;
}

export function TKFieldLabelsCollectionBuild(
  labels: TKFieldLabel[]
): TKFieldLabelsCollection {
  const labelsCollection: TKFieldLabelsCollection = {};
  labels.map((item: TKFieldLabel) => {
    labelsCollection[item.field_name] = { ...item };
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
