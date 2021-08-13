import { TKCampDescription } from "@/domain/survey/TKCampDescription";
import { TKCampTypesValues } from "@/domain/survey/TKCampDescription";
import { TKBoundarieDescription } from "@/domain/opsmapConfig/TKBoundarieDescription";
import { TKSubmission } from "./TKSubmission";
import { TKCamp, TKSurvey } from "./TKSurvey";

// ////////////////////////////////////////////////////////////////////////////
// Filters Concept description. Requires Comments !
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
  lastModification = "";

  // Dataset
  surveys: TKSurvey[];
  currentSurvey!: TKSurvey; // ! --> Disable'not defined in ctor error'

  // Selection state
  currentAdmin1: TKBoundarieDescription | null = null;
  currentAdmin2: TKBoundarieDescription | null = null;
  currentCamp: TKCamp | null = null;
  currentDate = "";
  currentSubmission: TKSubmission | null = null;

  // Filtered state
  sortedSubmissions: string[] = [];

  filteredAdmin1List: TKBoundarieDescription[] = [];
  filteredAdmin2List: TKBoundarieDescription[] = [];
  filteredCampsList: TKCamp[] = [];
  filters: { [key in TKFilters]: TKFiltersTypes } = {
    survey: null,
    admin1: null,
    admin2: null,
    camp: null,
    planned: true,
    spontaneous: true
  };
  levelToZoom: TKFilters = TKFilters.SURVEY;

  constructor(surveys: TKSurvey[]) {
    const before = Date.now();

    this.surveys = surveys;

    this.setActiveSurvey(this.surveys[0]);

    console.log(
      `Dataset filterer set up ${(Date.now() - before) / 1000} seconds.`
    );
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Active survey management: a bit different from the others
  // ////////////////////////////////////////////////////////////////////////////

  resetActiveSurvey() {
    if (this.surveys.length > 0) {
      this.setActiveSurvey(this.surveys[0]);
    }
  }

  hasActiveSurvey(): boolean {
    return this.currentSurvey !== null;
  }

  setActiveSurveyByName(name: string) {
    const survey = this.surveys.find(item => item.name === name);
    if (survey) {
      this.setActiveSurvey(survey);
    } else {
      this.resetActiveSurvey();
    }
  }

  setActiveSurvey(survey: TKSurvey) {
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

      this.currentSurvey = survey;

      this.lastModification = `survey=${this.currentSurvey.name}`;

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
          this.currentCamp.camp.type === TKCampTypesValues.PLANNED
        ) {
          this.levelToZoom = this.currentAdmin2
            ? TKFilters.ADMIN2
            : this.currentAdmin1
            ? TKFilters.ADMIN1
            : TKFilters.SURVEY;
          this.currentCamp = null;
          this.currentDate = "";
          this.currentSubmission = null;
          this.sortedSubmissions = [];
          this.filters[TKFilters.CAMP] = null;
          this.lastModification = "clearCamp";
        }
        break;
      // Change OF SPONTANEOUS TYPE ///////////////////////////////////////////
      case TKFilters.SPONTANEOUS_SITE:
        if (
          this.currentCamp &&
          value === false &&
          this.currentCamp.camp.type === TKCampTypesValues.SPONTANEOUS
        ) {
          this.levelToZoom = this.currentAdmin2
            ? TKFilters.ADMIN2
            : this.currentAdmin1
            ? TKFilters.ADMIN1
            : TKFilters.SURVEY;
          this.currentCamp = null;
          this.currentDate = "";
          this.currentSubmission = null;
          this.sortedSubmissions = [];
          this.filters[TKFilters.CAMP] = null;
          this.lastModification = "clearCamp";
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
      if (this.currentSurvey && this.currentCamp) {
        if (this.sortedSubmissions.includes(date)) {
          this.currentDate = date;
        } else {
          this.currentDate = this.currentCamp.camp.lastSubmission;
        }

        this.currentSubmission = this.currentCamp.submissions[date];
      } else {
        this.currentDate = "";
        this.currentSubmission = null;
      }
      this.lastModification = `date=${this.currentDate}`;
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change Admin1
  // ////////////////////////////////////////////////////////////////////////////

  clearCurrentAdmin1() {
    this.levelToZoom = TKFilters.SURVEY;

    this.currentAdmin1 = null;
    this.filters[TKFilters.ADMIN1] = null;

    this.currentAdmin2 = null;
    this.filters[TKFilters.ADMIN2] = null;

    this.currentCamp = null;
    this.filters[TKFilters.CAMP] = null;
    this.currentDate = "";
    this.currentSubmission = null;
    this.sortedSubmissions = [];

    this.lastModification = `clearAdmin1`;

    this.updateFiltering();
  }

  setCurrentAdmin1Name(admin1Name: string) {
    const admin1 = this.currentSurvey.boundariesList.admin1.find(
      admin1 => admin1.name === admin1Name
    );
    if (admin1) {
      this.setCurrentAdmin1(admin1.pcode);
    }
  }

  setCurrentAdmin1(pcode: string) {
    if (this.currentAdmin1?.pcode !== pcode) {
      this.filters[TKFilters.ADMIN1] = pcode;

      // Clear Current Admin
      this.filters[TKFilters.ADMIN2] = null;
      this.currentAdmin2 = null;
      this.currentCamp = null;
      this.currentDate = "";
      this.currentSubmission = null;
      this.sortedSubmissions = [];
      this.filters[TKFilters.CAMP] = null;

      this.levelToZoom = TKFilters.ADMIN1;
      this.currentAdmin1 = this.currentSurvey.boundariesList.admin1.find(
        a => a.pcode === pcode
      ) as TKBoundarieDescription;

      if (this.currentAdmin1) {
        this.lastModification = `admin1=${this.currentAdmin1.pcode}`;
      }

      this.updateFiltering();
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change Admin2
  // ////////////////////////////////////////////////////////////////////////////
  clearCurrentAdmin2() {
    this.levelToZoom = this.currentAdmin1 ? TKFilters.ADMIN1 : TKFilters.SURVEY;

    this.filters[TKFilters.ADMIN1] = this.currentAdmin1
      ? this.currentAdmin1.pcode
      : null;

    this.currentAdmin2 = null;
    this.filters[TKFilters.ADMIN2] = null;

    this.currentCamp = null;
    this.filters[TKFilters.CAMP] = null;
    this.currentDate = "";
    this.currentSubmission = null;
    this.sortedSubmissions = [];

    this.lastModification = `clearAdmin2`;

    this.updateFiltering();
  }

  setCurrentAdmin2Name(admin2Name: string) {
    const admin2 = this.currentSurvey.boundariesList.admin2.find(
      admin2 => admin2.name === admin2Name
    );
    if (admin2) {
      this.setCurrentAdmin2(admin2.pcode);
    }
  }

  setCurrentAdmin2(pcode: string) {
    this.filters[TKFilters.ADMIN2] = pcode;

    if (this.currentAdmin2?.pcode !== pcode) {
      // Clear camp
      this.currentCamp = null;
      this.currentDate = "";
      this.currentSubmission = null;
      this.sortedSubmissions = [];
      this.filters[TKFilters.CAMP] = null;

      // New admin2
      this.levelToZoom = TKFilters.ADMIN2;
      this.currentAdmin2 = this.currentSurvey.boundariesList.admin2.find(
        a => a.pcode === pcode
      ) as TKBoundarieDescription;

      const campAdmin2 = this.currentSurvey.camps.find(
        camp => camp.camp.admin2.pcode === this.currentAdmin2?.pcode
      );
      if (campAdmin2) {
        this.currentAdmin1 = campAdmin2.camp.admin1;
      }
      this.filters[TKFilters.ADMIN1] = this.currentAdmin1
        ? this.currentAdmin1.pcode
        : null;

      this.lastModification = `admin2=${this.currentAdmin2.pcode}`;

      this.updateFiltering();
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change Camp
  // ////////////////////////////////////////////////////////////////////////////

  clearCurrentCamp() {
    // Clear camp
    this.levelToZoom = this.currentAdmin2
      ? TKFilters.ADMIN2
      : this.currentAdmin1
      ? TKFilters.ADMIN1
      : TKFilters.SURVEY;
    this.currentCamp = null;
    this.currentDate = "";
    this.currentSubmission = null;
    this.sortedSubmissions = [];
    this.filters[TKFilters.CAMP] = null;

    this.lastModification = "clearCamp";

    this.updateFiltering();
  }

  setCurrentCampName(campName: string) {
    const camp = this.currentSurvey.camps.find(
      camp => camp.camp.name === campName
    );
    if (camp) {
      this.setCurrentCamp(camp.camp.id);
    }
  }

  setCurrentCamp(campId: string) {
    if (this.currentCamp?.camp.id !== campId) {
      this.filters[TKFilters.CAMP] = campId;
      this.levelToZoom = TKFilters.CAMP;
      this.currentCamp = this.currentSurvey.camps.find(
        camp => camp.camp.id === campId
      ) as TKCamp;
      if (this.currentCamp && this.currentSurvey) {
        if (this.currentCamp.camp.admin1 !== this.currentAdmin1) {
          this.currentAdmin1 = this.currentCamp.camp.admin1;
          this.filters[TKFilters.ADMIN1] = this.currentAdmin1.pcode;
        }

        if (this.currentCamp.camp.admin2 !== this.currentAdmin2) {
          this.currentAdmin2 = this.currentCamp.camp.admin2;
          this.filters[TKFilters.ADMIN2] = this.currentAdmin2.pcode;
        }

        this.currentDate = this.currentCamp.camp.lastSubmission;

        if (this.currentDate) {
          this.currentSubmission = this.currentCamp.submissions[
            this.currentDate
          ];
        }
        this.sortedSubmissions = this.currentCamp.dates;

        this.lastModification = `camp=${this.currentCamp.camp.id}`;
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
      this.filteredCampsList.map(item => item.camp.admin1.pcode)
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
      this.filteredCampsList.map(item => item.camp.admin2.pcode)
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
    // Reset camp list ////////////////////////////////////////////////////////
    this.filteredCampsList = this.currentSurvey.camps;
    this.filteredAdmin1List = this.currentSurvey.boundariesList.admin1;
    this.filteredAdmin2List = this.currentSurvey.boundariesList.admin2;

    // Camp filtering base on Admin1 //////////////////////////////////////////
    if (this.filters[TKFilters.ADMIN1]) {
      this.filteredCampsList = this.filteredCampsList.filter(
        x => x.camp.admin1.pcode === this.filters[TKFilters.ADMIN1]
      );
      this.filterAdmin2BaseOnFilteredCamp();
    }

    // Camp filtering base on Admin2 //////////////////////////////////////////
    if (this.filters[TKFilters.ADMIN2]) {
      this.filteredCampsList = this.filteredCampsList.filter(
        x => x.camp.admin2.pcode === this.filters[TKFilters.ADMIN2]
      );
    }

    // Remove planned if needed ///////////////////////////////////////////////
    if (!this.filters[TKFilters.PLANNED_SITE]) {
      this.filteredCampsList = this.filteredCampsList.filter(
        x => x.camp.type !== TKCampTypesValues.PLANNED
      );

      this.filterAdmin1BaseOnFilteredCamp();
      this.filterAdmin2BaseOnFilteredCamp();
    }

    // Remove spontaneous if needed ///////////////////////////////////////////
    if (!this.filters[TKFilters.SPONTANEOUS_SITE]) {
      this.filteredCampsList = this.filteredCampsList.filter(
        x => x.camp.type !== TKCampTypesValues.SPONTANEOUS
      );
      this.filterAdmin1BaseOnFilteredCamp();
      this.filterAdmin2BaseOnFilteredCamp();
    }
  }
}
