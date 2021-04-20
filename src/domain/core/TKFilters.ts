import { TKCampDescription } from "./TKCampDescription";
import { campTypesValues } from "@/app-demo/appConfiguration";
import { TKBoundarieDescription } from "./TKBoundarieDescription";
import { TKSurveyCollection } from "./TKSurveyCollection";

export enum TKFilters {
  SURVEY = "survey",
  ADMIN1 = "admin1",
  ADMIN2 = "admin2",
  PLANNED_SITE = "planned",
  SPONTANEOUS_SITE = "spontaneous",
}

export type TKFiltersTypes = string | boolean | null;

export class TKDatasetFilterer {
  surveys: TKSurveyCollection;
  surveyList: string[];
  currentSurvey: string;
  admin1List: TKBoundarieDescription[];
  currentAdmin1: TKBoundarieDescription | null = null;
  admin2List: TKBoundarieDescription[];
  currentAdmin2: TKBoundarieDescription | null = null;
  campsList: TKCampDescription[];
  currentCamp: TKCampDescription | null = null;
  filteredAdmin1List: TKBoundarieDescription[];
  filteredAdmin2List: TKBoundarieDescription[];
  filteredCampsList: TKCampDescription[];
  filters: { [key: string]: TKFiltersTypes } = {
    survey: null,
    admin1: null,
    admin2: null,
    planned: true,
    spontaneous: true,
  };

  constructor(surveys: TKSurveyCollection) {
    this.surveys = surveys;
    this.surveyList = Object.keys(surveys);
    this.currentSurvey = this.surveyList[0];
    this.filters.survey = this.currentSurvey;
    this.admin1List = surveys[this.currentSurvey].boundariesList.admin1;
    this.filteredAdmin1List = surveys[this.currentSurvey].boundariesList.admin1;
    this.admin2List = surveys[this.currentSurvey].boundariesList.admin2;
    this.filteredAdmin2List = surveys[this.currentSurvey].boundariesList.admin2;
    this.campsList = surveys[this.currentSurvey].campsList;
    this.filteredCampsList = surveys[this.currentSurvey].campsList;
  }

  setFiltersValue(filter: TKFilters, value: TKFiltersTypes) {
    this.filters[filter] = value;
    this.refreshLists();
  }

  refreshLists() {
    if (this.filters.survey) {
      this.filteredCampsList = this.surveys[this.currentSurvey].campsList;
    }
    if (this.filters.admin1) {
      this.filteredCampsList = this.filteredCampsList.filter(
        (x) => x.admin1.pcode === this.filters.admin1
      );
    }
    if (this.filters.admin2) {
      this.filteredCampsList = this.filteredCampsList.filter(
        (x) => x.admin2.pcode === this.filters.admin2
      );
    }

    if (!this.filters.planned) {
      this.filteredCampsList = this.filteredCampsList.filter(
        (x) => x.type !== campTypesValues.PLANNED
      );
    }
    if (!this.filters.spontaneous) {
      this.filteredCampsList = this.filteredCampsList.filter(
        (x) => x.type !== campTypesValues.SPONTANEOUS
      );
    }
  }

  getFilteredCampsList() {
    return this.filteredCampsList;
  }
}
