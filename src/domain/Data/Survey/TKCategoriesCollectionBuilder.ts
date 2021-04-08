export interface TKCategory {
  formatted_name: string;
  icon_file_name: string;
  thematic_label_en: string;
  thematic_label_tr: string;
}

export interface TKCategoriesCollection {
  [propName: string]: TKCategory;
}

export function TKCategoriesCollectionBuild(
  categories: TKCategory[]
): TKCategoriesCollection {
  const categoriesCollection: TKCategoriesCollection = {};
  categories.map((item: TKCategory) => {
    if (item.formatted_name?.length > 0) {
      categoriesCollection[item.formatted_name] = { ...item };
    }
  });
  return categoriesCollection;
}
