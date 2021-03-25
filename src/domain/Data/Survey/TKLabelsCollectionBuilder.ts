export interface TKLabel {
  name: string;
  label: string;
}

export interface TKLabelsCollection {
  [propName: string]: string;
}

export function TKLabelsCollectionBuilder(
  labels: TKLabel[]
): TKLabelsCollection {
  const labelsCollection: TKLabelsCollection = {};
  labels.map((item) => {
    if (item.name?.length > 0) {
      labelsCollection[item.name] = item.label;
    }
  });
  return labelsCollection;
}
