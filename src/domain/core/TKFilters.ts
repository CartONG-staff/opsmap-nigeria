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
    survey: "",
    admin1: "",
    admin2: "",
    planned: true,
    spontaneous: true,
  };

  constructor(surveys: TKSurveyCollection) {
    console.log(surveys);
    this.surveys = surveys;
    this.surveyList = Object.keys(surveys);
    this.currentSurvey = this.surveyList[0];
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
    console.log("refreshmagueule");

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
