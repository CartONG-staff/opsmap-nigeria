import { TKCampDescription } from "@/domain/survey/TKCampDescription";
import { TKCampTypesValues } from "@/domain/survey/TKCampTypesValues";
import { TKBoundarieDescription } from "@/domain/opsmapConfig/TKBoundarieDescription";
import { TKSurveyCollection } from "./TKSurveyCollection";

// ////////////////////////////////////////////////////////////////////////////
// Filtesr Concept description. Requires Comments !
// TODO : work on this : clarity, comments, etc.
// ////////////////////////////////////////////////////////////////////////////

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
  levelToZoom: TKFilters;

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
    this.levelToZoom = TKFilters.SURVEY;
  }

  setFiltersValue(filter: TKFilters, value: TKFiltersTypes) {
    this.filters[filter] = value;
    switch (filter) {
      case TKFilters.SURVEY:
        this.levelToZoom = TKFilters.SURVEY;
        this.currentSurvey = value as string;
        this.filters[TKFilters.ADMIN1] = null;
        this.currentAdmin1 = null;
        this.filters[TKFilters.ADMIN2] = null;
        this.currentAdmin2 = null;
        this.currentCamp = null;
        break;
      case TKFilters.ADMIN1:
        if (value) {
          this.levelToZoom = TKFilters.ADMIN1;
          this.currentAdmin1 = this.admin1List.find(
            (a) => a.pcode === value
          ) as TKBoundarieDescription;
        } else {
          this.levelToZoom = TKFilters.SURVEY;
          this.currentAdmin1 = null;
        }
        this.filters[TKFilters.ADMIN2] = null;
        this.currentAdmin2 = null;
        this.currentCamp = null;
        break;
      case TKFilters.ADMIN2:
        if (value) {
          this.levelToZoom = TKFilters.ADMIN2;
          this.currentAdmin2 = this.admin2List.find(
            (a) => a.pcode === value
          ) as TKBoundarieDescription;
        } else {
          this.levelToZoom = TKFilters.ADMIN1;
          this.currentAdmin2 = null;
        }
        this.currentCamp = null;
        break;
      case TKFilters.CAMP:
        if (value) {
          this.levelToZoom = TKFilters.CAMP;
          this.currentCamp = this.campsList.find(
            (c) => c.id === value
          ) as TKCampDescription;
        } else {
          this.levelToZoom = TKFilters.ADMIN2;
          this.currentCamp = null;
        }
        if (this.currentCamp) {
          this.filters[TKFilters.ADMIN2] = this.currentCamp.admin2.pcode;
          this.currentAdmin1 = this.currentCamp.admin1;
          this.currentAdmin2 = this.currentCamp.admin2;
        }
        break;
      case TKFilters.PLANNED_SITE:
        if (
          this.currentCamp &&
          value === false &&
          this.currentCamp.type === TKCampTypesValues.PLANNED
        ) {
          this.currentCamp = null;
        }
        break;
      case TKFilters.SPONTANEOUS_SITE:
        if (
          this.currentCamp &&
          value === false &&
          this.currentCamp.type === TKCampTypesValues.SPONTANEOUS
        ) {
          this.currentCamp = null;
        }
        break;
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

    if (this.levelToZoom === TKFilters.ADMIN2) {
      if (this.filteredCampsList.length) {
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
