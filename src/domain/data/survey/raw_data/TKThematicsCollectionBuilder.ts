export interface TKThematic {
  formatted_name: string;
  icon_file_name: string;
  thematic_label_en: string;
  thematic_label_tr: string;
}

export interface TKThematicsCollection {
  [propName: string]: TKThematic;
}

export function TKThematicsCollectionBuild(
  thematics: TKThematic[]
): TKThematicsCollection {
  const thematicsCollection: TKThematicsCollection = {};
  thematics.map((item: TKThematic) => {
    thematicsCollection[item.formatted_name] = { ...item };
  });
  return thematicsCollection;
}
