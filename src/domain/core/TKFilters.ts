import { TKCampDescription } from "./TKCampDescription";
import { campTypesValues } from "@/app-demo/appConfiguration";
import { TKSurvey } from "./TKSurvey";

export enum TKFilters {
  SURVEY = "survey",
  ADMIN1 = "admin1",
  ADMIN2 = "admin2",
  PLANNED_SITE = "planned",
  SPONTANEOUS_SITE = "spontaneous",
}

export type TKFiltersTypes = string | boolean | null;

export class TKDatasetFilterer {
  campsList: TKCampDescription[];
  filteredCampsList: TKCampDescription[];
  filters: { [key: string]: TKFiltersTypes } = {
    survey: "",
    admin1: "",
    admin2: "",
    planned: true,
    spontaneous: true,
  };

  constructor(survey: TKSurvey) {
    this.campsList = survey.campsList;
    this.filteredCampsList = survey.campsList;
  }

  setFiltersValue(filter: TKFilters, value: TKFiltersTypes) {
    this.filters[filter] = value;
    this.refreshLists();
  }

  refreshLists() {
    !this.filters.planned
      ? (this.filteredCampsList = this.campsList.filter(
          (x) => x.type !== campTypesValues.PLANNED
        ))
      : (this.filteredCampsList = this.campsList.filter(
          (x) => x.type === campTypesValues.PLANNED
        ));
  }

  getFilteredCampsList() {
    return this.filteredCampsList;
  }
}
