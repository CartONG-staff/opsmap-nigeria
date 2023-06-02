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

/*
  This is a small 'hack' that forces typescript compiler to understand the bijection in hte relation between adminlevel related adminfilters field and adminlevel.
  A the declaration level, it is ensured by:
  export enum TKAdminFilterType {
    ...
    ADMIN1 = TKAdminLevel.ADMIN1,
    ADMIN2 = TKAdminLevel.ADMIN2,
    ADMIN3 = TKAdminLevel.ADMIN3,
    ADMIN4 = TKAdminLevel.ADMIN4,
    ...
  }

  But whikle trying to use this implicitly, we're facing this warning: Argument of type 'TKAdminFilterType.ADMIN1 | TKAdminFilterType.ADMIN2 | TKAdminFilterType.ADMIN3 | TKAdminFilterType.ADMIN4' is not assignable to parameter of type 'TKAdminLevel'.
  Type 'TKAdminFilterType.ADMIN1' is not assignable to type 'TKAdminLevel'.
  Below is the explicit way.
*/
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
