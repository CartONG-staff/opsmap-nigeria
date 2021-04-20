import { TKCampDescription } from "./TKCampDescription";
import { TKCampTypesValues } from "@/domain/core/TKCampTypesValues";
import { TKBoundarieDescription } from "./TKBoundarieDescription";
import { TKSurveyCollection } from "./TKSurveyCollection";

export enum TKFilters {
  SURVEY = "survey",
  ADMIN1 = "admin1",
  ADMIN2 = "admin2",
  CAMP = "currentCamp",
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
  levelOfChange: TKFilters;

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
    this.levelOfChange = TKFilters.SURVEY;
  }

  setFiltersValue(filter: TKFilters, value: TKFiltersTypes) {
    this.filters[filter] = value;
    switch (filter) {
      case TKFilters.SURVEY:
        this.levelOfChange = TKFilters.SURVEY;
        this.currentSurvey = value as string;
        this.filters[TKFilters.ADMIN1] = null;
        this.currentAdmin1 = null;
        this.filters[TKFilters.ADMIN2] = null;
        this.currentAdmin2 = null;
        this.currentCamp = null;
        break;
      case TKFilters.ADMIN1:
        this.levelOfChange = TKFilters.ADMIN1;
        this.currentAdmin1 = value
          ? (this.admin1List.find(
              (a) => a.pcode === value
            ) as TKBoundarieDescription)
          : null;
        this.filters[TKFilters.ADMIN2] = null;
        this.currentAdmin2 = null;
        this.currentCamp = null;
        break;
      case TKFilters.ADMIN2:
        this.levelOfChange = TKFilters.ADMIN2;
        this.currentAdmin2 = value
          ? (this.admin2List.find(
              (a) => a.pcode === value
            ) as TKBoundarieDescription)
          : null;
        this.currentCamp = null;
        break;
      case TKFilters.CAMP:
        this.filters[TKFilters.ADMIN1] = null;
        this.levelOfChange = TKFilters.CAMP;
        this.currentCamp = value
          ? (this.campsList.find((c) => c.id === value) as TKCampDescription)
          : null;
        if(this.currentCamp){
          this.filters[TKFilters.ADMIN2] = this.currentCamp.admin2.pcode;
          this.currentAdmin1 = this.currentCamp.admin1;
          this.currentAdmin2 = this.currentCamp.admin2;
        }
        break;
      default:
        console.log("error on selector");
    }
    this.refreshLists();
  }

  refreshLists() {
    if (this.filters.survey) {
      this.filteredCampsList = this.surveys[this.currentSurvey].campsList;
      this.admin1List = this.surveys[this.currentSurvey].boundariesList.admin1;
    }
    if (this.filters.admin1) {
      this.admin2List = this.surveys[this.currentSurvey].boundariesList.admin2;
      this.filteredCampsList = this.filteredCampsList.filter(
        (x) => x.admin1.pcode === this.filters.admin1
      );
    }
    if (this.filters.admin2) {
      this.filteredCampsList = this.filteredCampsList.filter(
        (x) => x.admin2.pcode === this.filters.admin2
      );
    }

    if(this.levelOfChange === TKFilters.ADMIN2){
      if(this.filteredCampsList.length){
        this.currentAdmin1 = this.filteredCampsList[0].admin1;
      }
    }

    if (!this.filters.planned) {
      this.filteredCampsList = this.filteredCampsList.filter(
        (x) => x.type !== TKCampTypesValues.PLANNED
      );
    }
    if (!this.filters.spontaneous) {
      this.filteredCampsList = this.filteredCampsList.filter(
        (x) => x.type !== TKCampTypesValues.SPONTANEOUS
      );
    }
  }

  getFilteredCampsList() {
    return this.filteredCampsList;
  }
}