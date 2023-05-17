import { TKAdminLevel, arrayLeafToRoot } from "../opsmapConfig/TKAdminLevel";

export enum TKAdminFilterType {
  SURVEY = "survey",
  ADMIN1 = "admin1",
  ADMIN2 = "admin2",
  ADMIN3 = "admin3",
  ADMIN4 = "admin4",
  SITE = "site"
}

export type TKAdminFilterValue = string | boolean | null;

export const ADMIN_LEVEL_TO_ADMIN_FILTER = {
  [TKAdminLevel.ADMIN1]: TKAdminFilterType.ADMIN1,
  [TKAdminLevel.ADMIN2]: TKAdminFilterType.ADMIN2,
  [TKAdminLevel.ADMIN3]: TKAdminFilterType.ADMIN3,
  [TKAdminLevel.ADMIN4]: TKAdminFilterType.ADMIN4
};

export const ADMIN_FILTERS_TO_ADMIN_LEVEL = {
  [TKAdminFilterType.ADMIN1]: TKAdminLevel.ADMIN1,
  [TKAdminFilterType.ADMIN2]: TKAdminLevel.ADMIN2,
  [TKAdminFilterType.ADMIN3]: TKAdminLevel.ADMIN3,
  [TKAdminFilterType.ADMIN4]: TKAdminLevel.ADMIN4
};

export type TKAdminFilters = Record<TKAdminFilterType, TKAdminFilterValue>;

export function mostGranularAdminLevelFilter(
  filters: TKAdminFilters
): TKAdminLevel | null {
  for (const level of arrayLeafToRoot()) {
    if (filters[level]) {
      return level;
    }
  }
  return null;
}
