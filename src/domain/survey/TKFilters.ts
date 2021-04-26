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
  SPONTANEOUS_SITE = "spontaneous"
}

export type TKFiltersTypes = string | boolean | null;

export class TKDatasetFilterer {
  surveys: TKSurveyCollection;
  surveyList: string[];
  currentSurvey = "";
  admin1List: TKBoundarieDescription[] = [];
  currentAdmin1: TKBoundarieDescription | null = null;
  admin2List: TKBoundarieDescription[] = [];
  currentAdmin2: TKBoundarieDescription | null = null;
  campsList: TKCampDescription[] = [];
  currentCamp: TKCampDescription | null = null;
  // filteredAdmin1List: TKBoundarieDescription[] = [];
  // filteredAdmin2List: TKBoundarieDescription[] = [];
  filteredCampsList: TKCampDescription[] = [];
  filters: { [key: string]: TKFiltersTypes } = {
    survey: null,
    admin1: null,
    admin2: null,
    planned: true,
    spontaneous: true
  };
  levelToZoom: TKFilters = TKFilters.SURVEY;

  constructor(surveys: TKSurveyCollection) {
    this.surveys = surveys;
    this.surveyList = Object.keys(surveys);
    if (this.surveyList.length > 0) {
      this.setActiveSurvey(this.surveyList[0]);
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Active survey management: a bit different from the others
  // ////////////////////////////////////////////////////////////////////////////

  hasActiveSurvey(): boolean {
    return this.surveyList.includes(this.currentSurvey);
  }

  setActiveSurvey(survey: string) {
    if (this.surveyList.includes(survey)) {
      this.currentSurvey = survey;
      this.filters.survey = this.currentSurvey;
      this.admin1List = this.surveys[this.currentSurvey].boundariesList.admin1;
      // this.filteredAdmin1List = this.surveys[
      //   this.currentSurvey
      // ].boundariesList.admin1;
      this.admin2List = this.surveys[this.currentSurvey].boundariesList.admin2;
      // this.filteredAdmin2List = this.surveys[
      //   this.currentSurvey
      // ].boundariesList.admin2;
      this.campsList = this.surveys[this.currentSurvey].campsList;
      this.filteredCampsList = this.surveys[this.currentSurvey].campsList;
      this.currentAdmin1 = null;
      this.currentAdmin2 = null;
      this.currentCamp = null;
    } else {
      console.error("The survey '" + survey + "' does not exist in the opsmap");
      this.currentSurvey = "";
      this.filters.survey = this.currentSurvey;
      this.admin1List = [];
      // this.filteredAdmin1List = [];
      this.admin2List = [];
      // this.filteredAdmin2List = [];
      this.campsList = [];
      this.filteredCampsList = [];
      this.currentAdmin1 = null;
      this.currentAdmin2 = null;
      this.currentCamp = null;
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Filter values
  // ////////////////////////////////////////////////////////////////////////////

  setFiltersValue(filter: TKFilters, value: TKFiltersTypes) {
    this.filters[filter] = value;

    switch (filter) {
      // Change of SURVEY /////////////////////////////////////////////////////
      case TKFilters.SURVEY:
        this.levelToZoom = TKFilters.SURVEY;
        this.setActiveSurvey(value as string);
        break;

      // Change of ADMIN1 /////////////////////////////////////////////////////
      case TKFilters.ADMIN1:
        // New admin1
        if (value) {
          this.levelToZoom = TKFilters.ADMIN1;
          this.currentAdmin1 = this.admin1List.find(
            (a) => a.pcode === value
          ) as TKBoundarieDescription;
        }
        // Clear admin1
        else {
          this.levelToZoom = TKFilters.SURVEY;
          this.currentAdmin1 = null;
        }
        // Clear child levels
        this.filters[TKFilters.ADMIN2] = null;
        this.currentAdmin2 = null;
        this.currentCamp = null;
        break;
      // Change of ADMIN2 /////////////////////////////////////////////////////
      case TKFilters.ADMIN2:
        // New admin2
        if (value) {
          this.levelToZoom = TKFilters.ADMIN2;
          this.currentAdmin2 = this.admin2List.find(
            (a) => a.pcode === value
          ) as TKBoundarieDescription;

          const campAdmin2 = this.campsList.find(
            (a) => a.admin2 === this.currentAdmin2
          );
          if (campAdmin2) {
            this.currentAdmin1 = campAdmin2.admin1;
          }
        }
        // Clear admin2
        else {
          this.levelToZoom = TKFilters.ADMIN1;
          this.currentAdmin2 = null;
        }
        // Clear child levels
        this.currentCamp = null;
        break;
      // Change of CAMP ///////////////////////////////////////////////////////
      case TKFilters.CAMP:
        // New camp
        if (value) {
          this.levelToZoom = TKFilters.CAMP;
          this.currentCamp = this.campsList.find(
            (c) => c.id === value
          ) as TKCampDescription;
          this.currentAdmin1 = this.currentCamp.admin1;
          this.currentAdmin2 = this.currentCamp.admin2;

          // TODO: filteredadmin1 et filteredadmin2 never used
          // What's the use ?
          //
          // this.filters.admin1 = this.currentCamp.admin1.pcode;
          // this.filters.admin2 = this.currentCamp.admin2.pcode;
          //
        }
        // Clear camp
        else {
          this.levelToZoom = TKFilters.ADMIN2;
          this.currentCamp = null;
        }
        break;
      // Change OF PLANNED TYPE ///////////////////////////////////////////////
      case TKFilters.PLANNED_SITE:
        if (
          this.currentCamp &&
          value === false &&
          this.currentCamp.type === TKCampTypesValues.PLANNED
        ) {
          this.currentCamp = null;
        }
        break;
      // Change OF SPONTANEOUS TYPE ///////////////////////////////////////////
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
    // Survey filtering ///////////////////////////////////////////////////////
    if (this.filters.survey) {
      this.filteredCampsList = this.surveys[this.currentSurvey].campsList;
      this.admin1List = this.surveys[this.currentSurvey].boundariesList.admin1;
      this.admin2List = this.surveys[this.currentSurvey].boundariesList.admin2;
    }

    // Admin1 filtering ///////////////////////////////////////////////////////
    if (this.filters.admin1) {
      this.admin2List = this.surveys[this.currentSurvey].boundariesList.admin2;
      this.filteredCampsList = this.filteredCampsList.filter(
        (x) => x.admin1.pcode === this.filters.admin1
      );
    }

    // Admin2 filtering ///////////////////////////////////////////////////////
    if (this.filters.admin2) {
      this.filteredCampsList = this.filteredCampsList.filter(
        (x) => x.admin2.pcode === this.filters.admin2
      );
    }

    // Remove planned if needed ///////////////////////////////////////////////
    if (!this.filters.planned) {
      this.filteredCampsList = this.filteredCampsList.filter(
        (x) => x.type !== TKCampTypesValues.PLANNED
      );
    }

    // Remove spontaneous if needed ///////////////////////////////////////////
    if (!this.filters.spontaneous) {
      this.filteredCampsList = this.filteredCampsList.filter(
        (x) => x.type !== TKCampTypesValues.SPONTANEOUS
      );
    }
  }
}
