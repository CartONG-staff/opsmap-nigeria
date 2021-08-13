import { TKCampTypesValues } from "@/domain/survey/TKCamp";
import { TKBoundarieDescription } from "@/domain/opsmapConfig/TKBoundarieDescription";
import { TKSubmission } from "./TKSubmission";
import { TKSurvey } from "./TKSurvey";
import { TKCamp } from "@/domain/survey/TKCamp";

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
  private _currentSurvey!: TKSurvey; // ! --> Disable'not defined in ctor error'

  // Selection state
  private _currentAdmin1: TKBoundarieDescription | null = null;
  private _currentAdmin2: TKBoundarieDescription | null = null;
  private _currentCamp: TKCamp | null = null;
  private _currentSubmission: TKSubmission | null = null;

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

    if (this.surveys.length > 0) {
      this.currentSurvey = this.surveys[0];
    }

    console.log(
      `Dataset filterer set up ${(Date.now() - before) / 1000} seconds.`
    );
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Active survey management: a bit different from the others
  // ////////////////////////////////////////////////////////////////////////////

  setCurrentSurveyByName(name: string) {
    const survey = this.surveys.find(item => item.name === name);
    if (survey) {
      this.currentSurvey = survey;
    }
  }

  public get currentSurvey(): TKSurvey {
    return this._currentSurvey;
  }

  public set currentSurvey(survey: TKSurvey) {
    if (this._currentSurvey !== survey) {
      // Erase everything
      this._currentCamp = null;
      this._currentSubmission = null;
      this._currentAdmin2 = null;
      this._currentAdmin1 = null;
      this.filters[TKFilters.CAMP] = null;
      this.filters[TKFilters.ADMIN2] = null;
      this.filters[TKFilters.ADMIN1] = null;
      this.levelToZoom = TKFilters.SURVEY;

      this._currentSurvey = survey;

      this.lastModification = `survey=${this._currentSurvey.name}`;

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
          this._currentCamp &&
          value === false &&
          this._currentCamp.infos.type === TKCampTypesValues.PLANNED
        ) {
          this.levelToZoom = this._currentAdmin2
            ? TKFilters.ADMIN2
            : this._currentAdmin1
            ? TKFilters.ADMIN1
            : TKFilters.SURVEY;
          this._currentCamp = null;
          this._currentSubmission = null;
          this.filters[TKFilters.CAMP] = null;
          this.lastModification = "clearCamp";
        }
        break;
      // Change OF SPONTANEOUS TYPE ///////////////////////////////////////////
      case TKFilters.SPONTANEOUS_SITE:
        if (
          this._currentCamp &&
          value === false &&
          this._currentCamp.infos.type === TKCampTypesValues.SPONTANEOUS
        ) {
          this.levelToZoom = this._currentAdmin2
            ? TKFilters.ADMIN2
            : this._currentAdmin1
            ? TKFilters.ADMIN1
            : TKFilters.SURVEY;
          this._currentCamp = null;
          this._currentSubmission = null;
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
  public get currentSubmission(): TKSubmission | null {
    return this._currentSubmission;
  }

  public set currentSubmission(submission: TKSubmission | null) {
    if (submission !== this._currentSubmission) {
      if (submission && this._currentCamp?.submissions.includes(submission)) {
        this._currentSubmission = submission;
      } else {
        this._currentSubmission = this._currentCamp?.submissions[0] ?? null;
      }
      this.lastModification = `submission=${this._currentSubmission?.date}`;
    }
  }

  setSubmissionByDate(date: string) {
    const submission = this._currentCamp?.submissions.find(
      submission => submission.date === date
    );

    this.currentSubmission = submission ?? null;
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change Admin1
  // ////////////////////////////////////////////////////////////////////////////

  public get currentAdmin1(): TKBoundarieDescription | null {
    return this._currentAdmin1;
  }

  public set currentAdmin1(admin1: TKBoundarieDescription | null) {
    if (admin1) {
      if (admin1 !== this._currentAdmin1) {
        this._currentAdmin1 = admin1;
        this.filters[TKFilters.ADMIN1] = this._currentAdmin1.pcode;

        // Clear Current Admin
        this.filters[TKFilters.ADMIN2] = null;
        this._currentAdmin2 = null;
        this._currentCamp = null;
        this._currentSubmission = null;
        this.filters[TKFilters.CAMP] = null;

        this.levelToZoom = TKFilters.ADMIN1;

        this.lastModification = `admin1=${this._currentAdmin1.pcode}`;
        this.updateFiltering();
      }
    } else {
      this.levelToZoom = TKFilters.SURVEY;

      this._currentAdmin1 = null;
      this.filters[TKFilters.ADMIN1] = null;

      this._currentAdmin2 = null;
      this.filters[TKFilters.ADMIN2] = null;

      this._currentCamp = null;
      this.filters[TKFilters.CAMP] = null;
      this._currentSubmission = null;

      this.lastModification = `clearAdmin1`;

      this.updateFiltering();
    }
  }

  setCurrentAdmin1ByName(admin1Name: string) {
    const admin1 = this._currentSurvey.boundariesList.admin1.find(
      admin1 => admin1.name === admin1Name
    );
    this.currentAdmin1 = admin1 ?? null;
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change Admin2
  // ////////////////////////////////////////////////////////////////////////////

  public get currentAdmin2(): TKBoundarieDescription | null {
    return this._currentAdmin2;
  }

  public set currentAdmin2(admin2: TKBoundarieDescription | null) {
    if (admin2) {
      if (admin2 !== this._currentAdmin2) {
        this._currentAdmin2 = admin2;
        this.filters[TKFilters.ADMIN2] = this._currentAdmin2.pcode;

        // Clear camp
        this._currentCamp = null;
        this._currentSubmission = null;
        this.filters[TKFilters.CAMP] = null;

        // New admin2
        this.levelToZoom = TKFilters.ADMIN2;
        const campAdmin2 = this._currentSurvey.camps.find(
          camp => camp.infos.admin2.pcode === this._currentAdmin2?.pcode
        );
        if (campAdmin2) {
          this._currentAdmin1 = campAdmin2.infos.admin1;
        }
        this.filters[TKFilters.ADMIN1] = this._currentAdmin1
          ? this._currentAdmin1.pcode
          : null;

        this.lastModification = `admin2=${this._currentAdmin2.pcode}`;

        this.updateFiltering();
      }
    } else {
      this.levelToZoom = this._currentAdmin1
        ? TKFilters.ADMIN1
        : TKFilters.SURVEY;

      this.filters[TKFilters.ADMIN1] = this._currentAdmin1
        ? this._currentAdmin1.pcode
        : null;

      this._currentAdmin2 = null;
      this.filters[TKFilters.ADMIN2] = null;

      this._currentCamp = null;
      this.filters[TKFilters.CAMP] = null;
      this._currentSubmission = null;

      this.lastModification = `clearAdmin2`;

      this.updateFiltering();
    }
  }

  setCurrentAdmin2ByName(admin2Name: string) {
    const admin2 = this._currentSurvey.boundariesList.admin2.find(
      admin2 => admin2.name === admin2Name
    );
    this.currentAdmin2 = admin2 ?? null;
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change Camp
  // ////////////////////////////////////////////////////////////////////////////

  setCurrentCampByName(campName: string) {
    const camp = this._currentSurvey.camps.find(
      camp => camp.infos.name === campName
    );
    this.currentCamp = camp ?? null;
  }

  public get currentCamp(): TKCamp | null {
    return this._currentCamp;
  }

  public set currentCamp(camp: TKCamp | null) {
    if (camp) {
      if (this._currentCamp !== camp) {
        this._currentCamp = camp;

        this.filters[TKFilters.CAMP] = this._currentCamp.infos.id;
        this.levelToZoom = TKFilters.CAMP;
        if (this._currentCamp && this._currentSurvey) {
          if (this._currentCamp.infos.admin1 !== this._currentAdmin1) {
            this._currentAdmin1 = this._currentCamp.infos.admin1;
            this.filters[TKFilters.ADMIN1] = this._currentAdmin1.pcode;
          }

          if (this._currentCamp.infos.admin2 !== this._currentAdmin2) {
            this._currentAdmin2 = this._currentCamp.infos.admin2;
            this.filters[TKFilters.ADMIN2] = this._currentAdmin2.pcode;
          }

          this._currentSubmission = this._currentCamp.submissions[0];

          this.lastModification = `camp=${this._currentCamp.infos.id}`;
        }
        this.updateFiltering();
      }
    } else {
      // Clear camp
      this.levelToZoom = this._currentAdmin2
        ? TKFilters.ADMIN2
        : this._currentAdmin1
        ? TKFilters.ADMIN1
        : TKFilters.SURVEY;
      this._currentCamp = null;
      this._currentSubmission = null;
      this.filters[TKFilters.CAMP] = null;
      this.lastModification = "clearCamp";
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
      this.filteredCampsList.map(camp => camp.infos.admin1.pcode)
    );
    this.filteredAdmin1List = this.filteredAdmin1List.filter(item =>
      validAdmin1.has(item.pcode)
    );

    if (this._currentAdmin1 && !validAdmin1.has(this._currentAdmin1.pcode)) {
      this._currentAdmin1 = null;
      this.filters[TKFilters.ADMIN1] = null;
    }
  }

  // Admin2
  filterAdmin2BaseOnFilteredCamp(): void {
    // Filter Admin2 based on filtered Camp List //////////////////////////////
    const validAdmin2 = new Set(
      this.filteredCampsList.map(camp => camp.infos.admin2.pcode)
    );
    this.filteredAdmin2List = this.filteredAdmin2List.filter(item =>
      validAdmin2.has(item.pcode)
    );
    if (this._currentAdmin2 && !validAdmin2.has(this._currentAdmin2.pcode)) {
      this._currentAdmin2 = null;
      this.filters[TKFilters.ADMIN2] = null;
    }
  }

  // Sponateneous
  updateFiltering() {
    // Reset camp list ////////////////////////////////////////////////////////
    this.filteredCampsList = this._currentSurvey.camps;
    this.filteredAdmin1List = this._currentSurvey.boundariesList.admin1;
    this.filteredAdmin2List = this._currentSurvey.boundariesList.admin2;

    // Camp filtering base on Admin1 //////////////////////////////////////////
    if (this.filters[TKFilters.ADMIN1]) {
      this.filteredCampsList = this.filteredCampsList.filter(
        camp => camp.infos.admin1.pcode === this.filters[TKFilters.ADMIN1]
      );
      this.filterAdmin2BaseOnFilteredCamp();
    }

    // Camp filtering base on Admin2 //////////////////////////////////////////
    if (this.filters[TKFilters.ADMIN2]) {
      this.filteredCampsList = this.filteredCampsList.filter(
        camp => camp.infos.admin2.pcode === this.filters[TKFilters.ADMIN2]
      );
    }

    // Remove planned if needed ///////////////////////////////////////////////
    if (!this.filters[TKFilters.PLANNED_SITE]) {
      this.filteredCampsList = this.filteredCampsList.filter(
        camp => camp.infos.type !== TKCampTypesValues.PLANNED
      );

      this.filterAdmin1BaseOnFilteredCamp();
      this.filterAdmin2BaseOnFilteredCamp();
    }

    // Remove spontaneous if needed ///////////////////////////////////////////
    if (!this.filters[TKFilters.SPONTANEOUS_SITE]) {
      this.filteredCampsList = this.filteredCampsList.filter(
        camp => camp.infos.type !== TKCampTypesValues.SPONTANEOUS
      );
      this.filterAdmin1BaseOnFilteredCamp();
      this.filterAdmin2BaseOnFilteredCamp();
    }
  }
}
