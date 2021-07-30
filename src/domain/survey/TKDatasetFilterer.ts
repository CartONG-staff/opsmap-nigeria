import { TKCampDescription } from "@/domain/survey/TKCampDescription";
import { TKCampTypesValues } from "@/domain/survey/TKCampDescription";
import { TKBoundarieDescription } from "@/domain/opsmapConfig/TKBoundarieDescription";
import { TKSurveyCollection } from "./TKSurveyCollection";
import { TKSubmission } from "./TKSubmission";

// ////////////////////////////////////////////////////////////////////////////
// Filtesr Concept description. Requires Comments !
// TODO : work on this : clarity, comments, etc.
// ////////////////////////////////////////////////////////////////////////////

// TODO : split level (survey -> camp and filter planned / spontaneous)
export enum TKFilters {
  SURVEY = "survey",
  ADMIN1 = "admin1",
  ADMIN2 = "admin2",
  CAMP = "camp",
  PLANNED_SITE = "planned",
  SPONTANEOUS_SITE = "spontaneous"
}

export type TKFiltersTypes = string | boolean | null;

// ////////////////////////////////////////////////////////////////////////////
//
// ////////////////////////////////////////////////////////////////////////////

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
  currentDate = "";

  currentSubmission: TKSubmission | null = null;
  sortedSubmissions: string[] = [];

  filteredAdmin1List: TKBoundarieDescription[] = [];
  filteredAdmin2List: TKBoundarieDescription[] = [];
  filteredCampsList: TKCampDescription[] = [];
  filters: { [key in TKFilters]: TKFiltersTypes } = {
    survey: null,
    admin1: null,
    admin2: null,
    camp: null,
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

  resetActiveSurvey() {
    if (this.surveyList.length > 0) {
      this.currentSurvey = "";
      this.setActiveSurvey(this.surveyList[0]);
    }
  }

  hasActiveSurvey(): boolean {
    return this.surveyList.includes(this.currentSurvey);
  }

  setActiveSurvey(survey: string) {
    if (this.currentSurvey !== survey) {
      // Erase everything
      this.currentCamp = null;
      this.currentDate = "";
      this.currentSubmission = null;
      this.sortedSubmissions = [];
      this.currentAdmin2 = null;
      this.currentAdmin1 = null;
      this.filters[TKFilters.CAMP] = null;
      this.filters[TKFilters.ADMIN2] = null;
      this.filters[TKFilters.ADMIN1] = null;
      this.levelToZoom = TKFilters.SURVEY;

      if (this.surveyList.includes(survey)) {
        this.currentSurvey = survey;
        this.filters[TKFilters.SURVEY] = this.currentSurvey;
        this.campsList = this.surveys[this.currentSurvey].campsList;
        this.admin1List = this.surveys[
          this.currentSurvey
        ].boundariesList.admin1;
        this.admin2List = this.surveys[
          this.currentSurvey
        ].boundariesList.admin2;
      } else {
        console.error(
          "The survey '" + survey + "' does not exist in the opsmap"
        );
        this.currentSurvey = "";
        this.filters[TKFilters.SURVEY] = null;
        this.campsList = [];
        this.admin1List = [];
        this.admin2List = [];
        this.campsList = [];
      }

      this.updateFiltering();
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Filter all
  // ////////////////////////////////////////////////////////////////////////////
  setFiltersValue(
    filter: TKFilters.PLANNED_SITE | TKFilters.SPONTANEOUS_SITE,
    value: TKFiltersTypes
  ) {
    this.filters[filter] = value;

    switch (filter) {
      // Change OF PLANNED TYPE ///////////////////////////////////////////////
      case TKFilters.PLANNED_SITE:
        if (
          this.currentCamp &&
          value === false &&
          this.currentCamp.type === TKCampTypesValues.PLANNED
        ) {
          this.clearCurrentCamp();
        }
        break;
      // Change OF SPONTANEOUS TYPE ///////////////////////////////////////////
      case TKFilters.SPONTANEOUS_SITE:
        if (
          this.currentCamp &&
          value === false &&
          this.currentCamp.type === TKCampTypesValues.SPONTANEOUS
        ) {
          this.clearCurrentCamp();
        }
        break;
    }

    this.updateFiltering();
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change date
  // ////////////////////////////////////////////////////////////////////////////

  setCurrentDate(date: string) {
    if (date !== this.currentDate) {
      if (this.currentCamp) {
        if (this.sortedSubmissions.includes(date)) {
          this.currentDate = date;
        } else {
          this.currentDate = this.currentCamp.lastSubmission;
        }

        this.currentSubmission = this.surveys[
          this.currentSurvey
        ].submissionsByCamps[this.currentCamp.id][this.currentDate];
      } else {
        this.currentDate = "";
        this.currentSubmission = null;
      }
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change Admin1
  // ////////////////////////////////////////////////////////////////////////////

  clearCurrentAdmin1() {
    this.currentCamp = null;
    this.currentDate = "";
    this.currentSubmission = null;
    this.sortedSubmissions = [];
    this.currentAdmin2 = null;
    this.currentAdmin1 = null;
    this.filters[TKFilters.CAMP] = null;
    this.filters[TKFilters.ADMIN2] = null;
    this.filters[TKFilters.ADMIN1] = null;
    this.levelToZoom = TKFilters.SURVEY;

    this.updateFiltering();
  }

  setCurrentAdmin1Name(admin1Name: string) {
    const admin1 = this.admin1List.find(admin1 => admin1.name === admin1Name);
    if (admin1) {
      this.setCurrentAdmin1(admin1.pcode);
    }
  }

  setCurrentAdmin1(pcode: string) {
    if (this.currentAdmin1?.pcode !== pcode) {
      this.currentCamp = null;
      this.currentDate = "";
      this.currentSubmission = null;
      this.sortedSubmissions = [];
      this.currentAdmin2 = null;
      this.filters[TKFilters.CAMP] = null;
      this.filters[TKFilters.ADMIN2] = null;

      this.filters[TKFilters.ADMIN1] = pcode;
      this.levelToZoom = TKFilters.ADMIN1;

      this.currentAdmin1 = this.admin1List.find(
        a => a.pcode === pcode
      ) as TKBoundarieDescription;

      this.updateFiltering();
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change Admin2
  // ////////////////////////////////////////////////////////////////////////////

  clearCurrentAdmin2() {
    this.currentCamp = null;
    this.currentDate = "";
    this.currentSubmission = null;
    this.sortedSubmissions = [];
    this.filters[TKFilters.CAMP] = null;
    this.filters[TKFilters.ADMIN2] = null;
    this.currentAdmin2 = null;
    this.levelToZoom = TKFilters.ADMIN1;
    this.filters[TKFilters.ADMIN1] = this.currentAdmin1
      ? this.currentAdmin1.pcode
      : null;

    this.updateFiltering();
  }

  setCurrentAdmin2Name(admin2Name: string) {
    const admin2 = this.admin2List.find(admin2 => admin2.name === admin2Name);
    if (admin2) {
      this.setCurrentAdmin2(admin2.pcode);
    }
  }

  setCurrentAdmin2(pcode: string) {
    if (this.currentAdmin2?.pcode !== pcode) {
      // Clear camp
      this.currentCamp = null;
      this.currentDate = "";
      this.currentSubmission = null;
      this.sortedSubmissions = [];
      this.filters[TKFilters.CAMP] = null;

      this.filters[TKFilters.ADMIN2] = pcode;

      // New admin2
      this.levelToZoom = TKFilters.ADMIN2;
      this.currentAdmin2 = this.admin2List.find(
        a => a.pcode === pcode
      ) as TKBoundarieDescription;

      const campAdmin2 = this.campsList.find(
        a => a.admin2.pcode === this.currentAdmin2?.pcode
      );
      if (campAdmin2) {
        this.currentAdmin1 = campAdmin2.admin1;
      }
      this.filters[TKFilters.ADMIN1] = this.currentAdmin1
        ? this.currentAdmin1.pcode
        : null;

      this.updateFiltering();
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change Camp
  // ////////////////////////////////////////////////////////////////////////////

  clearCurrentCamp() {
    // Clear camp
    this.levelToZoom = TKFilters.ADMIN2;
    this.currentCamp = null;
    this.currentDate = "";
    this.currentSubmission = null;
    this.sortedSubmissions = [];
    this.filters[TKFilters.CAMP] = null;
  }

  setCurrentCampName(campName: string) {
    const camp = this.campsList.find(camp => camp.name === campName);
    if (camp) {
      this.setCurrentCamp(camp.id);
    }
  }

  setCurrentCamp(campId: string) {
    if (this.currentCamp?.id !== campId) {
      this.filters[TKFilters.CAMP] = campId;
      this.levelToZoom = TKFilters.CAMP;
      this.currentCamp = this.campsList.find(
        c => c.id === campId
      ) as TKCampDescription;
      if (this.currentCamp) {
        if (this.currentCamp.admin1 !== this.currentAdmin1) {
          this.currentAdmin1 = this.currentCamp.admin1;
          this.filters[TKFilters.ADMIN1] = this.currentAdmin1.pcode;
        }

        if (this.currentCamp.admin2 !== this.currentAdmin2) {
          this.currentAdmin2 = this.currentCamp.admin2;
          this.filters[TKFilters.ADMIN2] = this.currentAdmin2.pcode;
        }

        this.currentDate = this.surveys[
          this.currentSurvey
        ].dateOfSubmissionsByCamps[this.currentCamp.id][0];

        if (this.currentDate) {
          this.currentSubmission = this.surveys[
            this.currentSurvey
          ].submissionsByCamps[this.currentCamp.id][this.currentDate];
        }
        this.sortedSubmissions = this.surveys[
          this.currentSurvey
        ].dateOfSubmissionsByCamps[this.currentCamp.id];
      }
      this.updateFiltering();
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Update filtering
  // ////////////////////////////////////////////////////////////////////////////

  // Admin1
  filterAdmin1BaseOnFilteredCamp(): void {
    // Filter Admin1 based on filtered Camp List //////////////////////////////
    const validAdmin1 = new Set(
      this.filteredCampsList.map(item => item.admin1.pcode)
    );
    this.filteredAdmin1List = this.filteredAdmin1List.filter(item =>
      validAdmin1.has(item.pcode)
    );

    if (this.currentAdmin1 && !validAdmin1.has(this.currentAdmin1.pcode)) {
      this.currentAdmin1 = null;
      this.filters[TKFilters.ADMIN1] = null;
    }
  }

  // Admin2
  filterAdmin2BaseOnFilteredCamp(): void {
    // Filter Admin2 based on filtered Camp List //////////////////////////////
    const validAdmin2 = new Set(
      this.filteredCampsList.map(item => item.admin2.pcode)
    );
    this.filteredAdmin2List = this.filteredAdmin2List.filter(item =>
      validAdmin2.has(item.pcode)
    );
    if (this.currentAdmin2 && !validAdmin2.has(this.currentAdmin2.pcode)) {
      this.currentAdmin2 = null;
      this.filters[TKFilters.ADMIN2] = null;
    }
  }

  // Sponateneous
  updateFiltering() {
    console.log("POPOPOPOPO");

    // Reset camp list ////////////////////////////////////////////////////////
    this.filteredCampsList = this.campsList;
    this.filteredAdmin1List = this.admin1List;
    this.filteredAdmin2List = this.admin2List;

    // Camp filtering base on Admin1 //////////////////////////////////////////
    if (this.filters[TKFilters.ADMIN1]) {
      this.filteredCampsList = this.filteredCampsList.filter(
        x => x.admin1.pcode === this.filters[TKFilters.ADMIN1]
      );
      this.filterAdmin2BaseOnFilteredCamp();
    }

    // Camp filtering base on Admin2 //////////////////////////////////////////
    if (this.filters[TKFilters.ADMIN2]) {
      this.filteredCampsList = this.filteredCampsList.filter(
        x => x.admin2.pcode === this.filters[TKFilters.ADMIN2]
      );
    }

    // Remove planned if needed ///////////////////////////////////////////////
    if (!this.filters[TKFilters.PLANNED_SITE]) {
      this.filteredCampsList = this.filteredCampsList.filter(
        x => x.type !== TKCampTypesValues.PLANNED
      );

      this.filterAdmin1BaseOnFilteredCamp();
      this.filterAdmin2BaseOnFilteredCamp();
    }

    // Remove spontaneous if needed ///////////////////////////////////////////
    if (!this.filters[TKFilters.SPONTANEOUS_SITE]) {
      this.filteredCampsList = this.filteredCampsList.filter(
        x => x.type !== TKCampTypesValues.SPONTANEOUS
      );
      this.filterAdmin1BaseOnFilteredCamp();
      this.filterAdmin2BaseOnFilteredCamp();
    }
  }
}
