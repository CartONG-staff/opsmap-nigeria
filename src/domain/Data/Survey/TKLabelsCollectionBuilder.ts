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

export interface TKLabelsCollection {
  [propName: string]: TKFieldLabel | TKAnswerLabel;
}

export function TKLabelsCollectionBuilder(
  labels: TKFieldLabel[] | TKAnswerLabel[]
): TKLabelsCollection {
  const labelsCollection: TKLabelsCollection = {};
  labels.map((item) => {
    if (item.field_name?.length > 0 || item.choice_name?.length > 0) {
      const name = item.field_name || item.choice_name;
      labelsCollection[name] = { ...item };
    }
  });
  return labelsCollection;
}
