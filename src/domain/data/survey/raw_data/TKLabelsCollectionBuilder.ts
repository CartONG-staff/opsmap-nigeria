export interface TKFieldLabel {
  field_name: string;
  field_label_en: string;
  field_label_fr?: string;
  field_label_pt?: string;
}

export interface TKAnswerLabel {
  choice_name: string;
  choice_name_en: string;
  choice_name_fr?: string;
  choice_name_pt?: string;
}

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
