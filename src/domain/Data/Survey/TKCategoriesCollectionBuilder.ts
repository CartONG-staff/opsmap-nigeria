export interface TKCategory {
  label: string;
  formatted_name: string;
  icon_name: string;
}

export interface TKCategoriesCollection {
  [propName: string]: TKCategory;
}

export function TKCategoriesCollectionBuilder(
  categories: TKCategory[]
): TKCategoriesCollection {
  const categoriesCollection: TKCategoriesCollection = {};
  categories.map((item) => {
    if (item.label?.length > 0) {
      categoriesCollection[item.formatted_name] = { ...item };
    }
  });
  return categoriesCollection;
}
