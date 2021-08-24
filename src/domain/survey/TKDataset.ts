import { TKCampType } from "@/domain/survey/TKCamp";
import { TKBoundaries } from "@/domain/survey/TKBoundaries";
import { TKSubmission } from "./TKSubmission";
import { TKCamp } from "@/domain/survey/TKCamp";
import {
  TKSurveyInfos,
  TKSurveyInfosType
} from "../opsmapConfig/TKSurveyInfos";
import { TKFDFSpatialDescription } from "../fdf/TKFDFSpatialDescription";
import { TKFDFIndicators } from "../fdf/TKFDFIndicators";

import { TKCreateFDF } from "../fdf/TKFDF";
import { TKGetKoboRawData } from "../kobo/TKGetKoboRawData";
import { TKCreateSurvey, TKSurvey } from "./TKSurvey";
import { TKReadRawDataGSheet } from "./TKRawData";
import { TKCSVParse } from "../utils/TKCSV";

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

export class TKDataset {
  private _lastModification = "";

  // Dataset
  private _surveys: TKSurvey[];
  private _currentSurvey!: TKSurvey; // ! --> Disable'not defined in ctor error'

  // Selection state
  private _currentAdmin1: TKBoundaries | null = null;
  private _currentAdmin2: TKBoundaries | null = null;
  private _currentCamp: TKCamp | null = null;
  private _currentSubmission: TKSubmission | null = null;

  private _filteredAdmin1List: TKBoundaries[] = [];
  private _filteredAdmin2List: TKBoundaries[] = [];
  private _filteredCampsList: TKCamp[] = [];
  private _filters: { [key in TKFilters]: TKFiltersTypes } = {
    survey: null,
    admin1: null,
    admin2: null,
    camp: null,
    planned: true,
    spontaneous: true
  };
  private _levelToZoom: TKFilters = TKFilters.SURVEY;

  constructor(surveys: TKSurvey[]) {
    const before = Date.now();

    this._surveys = surveys;

    if (this._surveys.length > 0) {
      this.currentSurvey = this._surveys[0];
    }

    console.log(
      `Dataset filterer set up ${(Date.now() - before) / 1000} seconds.`
    );
  }
  // ////////////////////////////////////////////////////////////////////////////
  // Current Survey
  // ////////////////////////////////////////////////////////////////////////////

  public get surveys(): TKSurvey[] {
    return this._surveys;
  }

  public get lastModification(): string {
    return this._lastModification;
  }

  public get filteredAdmin1List(): TKBoundaries[] {
    return this._filteredAdmin1List;
  }
  public get filteredAdmin2List(): TKBoundaries[] {
    return this._filteredAdmin2List;
  }
  public get filteredCampsList(): TKCamp[] {
    return this._filteredCampsList;
  }
  public get filters(): { [key in TKFilters]: TKFiltersTypes } {
    return this._filters;
  }
  public get levelToZoom(): TKFilters {
    return this._levelToZoom;
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Current Survey
  // ////////////////////////////////////////////////////////////////////////////

  setCurrentSurveyByName(name: string) {
    const survey = this._surveys.find(item => item.name === name);
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
      this._filters[TKFilters.CAMP] = null;
      this._filters[TKFilters.ADMIN2] = null;
      this._filters[TKFilters.ADMIN1] = null;
      this._levelToZoom = TKFilters.SURVEY;

      this._currentSurvey = survey;

      this._lastModification = `survey=${this._currentSurvey.name}`;

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
    this._filters[filter] = value;

    switch (filter) {
      // Change OF PLANNED TYPE ///////////////////////////////////////////////
      case TKFilters.PLANNED_SITE:
        if (
          this._currentCamp &&
          value === false &&
          this._currentCamp.type === TKCampType.PLANNED
        ) {
          this._levelToZoom = this._currentAdmin2
            ? TKFilters.ADMIN2
            : this._currentAdmin1
            ? TKFilters.ADMIN1
            : TKFilters.SURVEY;
          this._currentCamp = null;
          this._currentSubmission = null;
          this._filters[TKFilters.CAMP] = null;
          this._lastModification = "clearCamp";
        }
        break;
      // Change OF SPONTANEOUS TYPE ///////////////////////////////////////////
      case TKFilters.SPONTANEOUS_SITE:
        if (
          this._currentCamp &&
          value === false &&
          this._currentCamp.type === TKCampType.SPONTANEOUS
        ) {
          this._levelToZoom = this._currentAdmin2
            ? TKFilters.ADMIN2
            : this._currentAdmin1
            ? TKFilters.ADMIN1
            : TKFilters.SURVEY;
          this._currentCamp = null;
          this._currentSubmission = null;
          this._filters[TKFilters.CAMP] = null;
          this._lastModification = "clearCamp";
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
      this._lastModification = `submission=${this._currentSubmission?.date}`;
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

  public get currentAdmin1(): TKBoundaries | null {
    return this._currentAdmin1;
  }

  public set currentAdmin1(admin1: TKBoundaries | null) {
    if (admin1) {
      if (admin1 !== this._currentAdmin1) {
        this._currentAdmin1 = admin1;
        this._filters[TKFilters.ADMIN1] = this._currentAdmin1.pcode;

        // Clear Current Admin
        this._filters[TKFilters.ADMIN2] = null;
        this._currentAdmin2 = null;
        this._currentCamp = null;
        this._currentSubmission = null;
        this._filters[TKFilters.CAMP] = null;

        this._levelToZoom = TKFilters.ADMIN1;

        this._lastModification = `admin1=${this._currentAdmin1.pcode}`;
        this.updateFiltering();
      }
    } else {
      this._levelToZoom = TKFilters.SURVEY;

      this._currentAdmin1 = null;
      this._filters[TKFilters.ADMIN1] = null;

      this._currentAdmin2 = null;
      this._filters[TKFilters.ADMIN2] = null;

      this._currentCamp = null;
      this._filters[TKFilters.CAMP] = null;
      this._currentSubmission = null;

      this._lastModification = `clearAdmin1`;

      this.updateFiltering();
    }
  }

  setCurrentAdmin1ByName(admin1Name: string) {
    if (this.currentSurvey) {
      const admin1 = this._currentSurvey.boundaries.admin1.find(
        admin1 => admin1.name === admin1Name
      );
      this.currentAdmin1 = admin1 ?? null;
    } else {
      this.currentAdmin1 = null;
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change Admin2
  // ////////////////////////////////////////////////////////////////////////////

  public get currentAdmin2(): TKBoundaries | null {
    return this._currentAdmin2;
  }

  public set currentAdmin2(admin2: TKBoundaries | null) {
    if (admin2) {
      if (admin2 !== this._currentAdmin2) {
        this._currentAdmin2 = admin2;
        this._filters[TKFilters.ADMIN2] = this._currentAdmin2.pcode;

        // Clear camp
        this._currentCamp = null;
        this._currentSubmission = null;
        this._filters[TKFilters.CAMP] = null;

        // New admin2
        this._levelToZoom = TKFilters.ADMIN2;
        const campAdmin2 = this._currentSurvey.camps.find(
          camp => camp.admin2.pcode === this._currentAdmin2?.pcode
        );
        if (campAdmin2) {
          this._currentAdmin1 = campAdmin2.admin1;
        }
        this._filters[TKFilters.ADMIN1] = this._currentAdmin1
          ? this._currentAdmin1.pcode
          : null;

        this._lastModification = `admin2=${this._currentAdmin2.pcode}`;

        this.updateFiltering();
      }
    } else {
      this._levelToZoom = this._currentAdmin1
        ? TKFilters.ADMIN1
        : TKFilters.SURVEY;

      this._filters[TKFilters.ADMIN1] = this._currentAdmin1
        ? this._currentAdmin1.pcode
        : null;

      this._currentAdmin2 = null;
      this._filters[TKFilters.ADMIN2] = null;

      this._currentCamp = null;
      this._filters[TKFilters.CAMP] = null;
      this._currentSubmission = null;

      this._lastModification = `clearAdmin2`;

      this.updateFiltering();
    }
  }

  setCurrentAdmin2ByName(admin2Name: string) {
    if (this._currentSurvey) {
      const admin2 = this._currentSurvey.boundaries.admin2.find(
        admin2 => admin2.name === admin2Name
      );
      this.currentAdmin2 = admin2 ?? null;
    } else {
      this.currentAdmin2 = null;
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change Camp
  // ////////////////////////////////////////////////////////////////////////////

  setcurrentCampByName(campName: string) {
    if (this._currentSurvey) {
      const camp = this._currentSurvey.camps.find(
        camp => camp.name === campName
      );
      this.currentCamp = camp ?? null;
    } else {
      this.currentCamp = null;
    }
  }

  public get currentCamp(): TKCamp | null {
    return this._currentCamp;
  }

  public set currentCamp(camp: TKCamp | null) {
    if (camp) {
      if (this._currentCamp !== camp) {
        this._currentCamp = camp;

        this._filters[TKFilters.CAMP] = this._currentCamp.id;
        this._levelToZoom = TKFilters.CAMP;
        if (this._currentCamp && this._currentSurvey) {
          if (this._currentCamp.admin1 !== this._currentAdmin1) {
            this._currentAdmin1 = this._currentCamp.admin1;
            this._filters[TKFilters.ADMIN1] = this._currentAdmin1.pcode;
          }

          if (this._currentCamp.admin2 !== this._currentAdmin2) {
            this._currentAdmin2 = this._currentCamp.admin2;
            this._filters[TKFilters.ADMIN2] = this._currentAdmin2.pcode;
          }

          this._currentSubmission = this._currentCamp.submissions[0];

          this._lastModification = `camp=${this._currentCamp.id}`;
        }
        this.updateFiltering();
      }
    } else {
      // Clear camp
      this._levelToZoom = this._currentAdmin2
        ? TKFilters.ADMIN2
        : this._currentAdmin1
        ? TKFilters.ADMIN1
        : TKFilters.SURVEY;
      this._currentCamp = null;
      this._currentSubmission = null;
      this._filters[TKFilters.CAMP] = null;
      this._lastModification = "clearCamp";
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
      this._filteredCampsList.map(camp => camp.admin1.pcode)
    );
    this._filteredAdmin1List = this._filteredAdmin1List.filter(item =>
      validAdmin1.has(item.pcode)
    );

    if (this._currentAdmin1 && !validAdmin1.has(this._currentAdmin1.pcode)) {
      this._currentAdmin1 = null;
      this._filters[TKFilters.ADMIN1] = null;
    }
  }

  // Admin2
  filterAdmin2BaseOnFilteredCamp(): void {
    // Filter Admin2 based on filtered Camp List //////////////////////////////
    const validAdmin2 = new Set(
      this._filteredCampsList.map(camp => camp.admin2.pcode)
    );
    this._filteredAdmin2List = this._filteredAdmin2List.filter(item =>
      validAdmin2.has(item.pcode)
    );
    if (this._currentAdmin2 && !validAdmin2.has(this._currentAdmin2.pcode)) {
      this._currentAdmin2 = null;
      this._filters[TKFilters.ADMIN2] = null;
    }
  }

  // Sponateneous
  updateFiltering() {
    if (this._currentSurvey) {
      // Reset camp list ////////////////////////////////////////////////////////
      this._filteredCampsList = this._currentSurvey.camps;
      this._filteredAdmin1List = this._currentSurvey.boundaries.admin1;
      this._filteredAdmin2List = this._currentSurvey.boundaries.admin2;

      // Camp filtering base on Admin1 //////////////////////////////////////////
      if (this._filters[TKFilters.ADMIN1]) {
        this._filteredCampsList = this._filteredCampsList.filter(
          camp => camp.admin1.pcode === this._filters[TKFilters.ADMIN1]
        );
        this.filterAdmin2BaseOnFilteredCamp();
      }

      // Camp filtering base on Admin2 //////////////////////////////////////////
      if (this._filters[TKFilters.ADMIN2]) {
        this._filteredCampsList = this._filteredCampsList.filter(
          camp => camp.admin2.pcode === this._filters[TKFilters.ADMIN2]
        );
      }

      // Remove planned if needed ///////////////////////////////////////////////
      if (!this._filters[TKFilters.PLANNED_SITE]) {
        this._filteredCampsList = this._filteredCampsList.filter(
          camp => camp.type !== TKCampType.PLANNED
        );

        this.filterAdmin1BaseOnFilteredCamp();
        this.filterAdmin2BaseOnFilteredCamp();
      }

      // Remove spontaneous if needed ///////////////////////////////////////////
      if (!this._filters[TKFilters.SPONTANEOUS_SITE]) {
        this._filteredCampsList = this._filteredCampsList.filter(
          camp => camp.type !== TKCampType.SPONTANEOUS
        );
        this.filterAdmin1BaseOnFilteredCamp();
        this.filterAdmin2BaseOnFilteredCamp();
      }
    }
  }
}

// ////////////////////////////////////////////////////////////////////////////
// Create all the survey based on the surveys infos
// ////////////////////////////////////////////////////////////////////////////

export async function TKCreateDataset(
  surveyDescription: TKSurveyInfos[],
  spatialDescription: TKFDFSpatialDescription,
  indicators: TKFDFIndicators,
  languages: Array<string>
): Promise<TKDataset> {
  // prepare output
  const surveys: TKSurvey[] = [];

  // foreach survey info
  for (const info of surveyDescription) {
    // Retrieve raw data
    let rawData;
    const before = Date.now();
    if (info.type === TKSurveyInfosType.CSV) {
      rawData = await TKCSVParse(
        info.submissionsFile,
        info.submissionsFolder,
        true
      );
      info;
    } else if (info.type === TKSurveyInfosType.GSHEET) {
      rawData = await TKReadRawDataGSheet(info.submissionsUrl, true);
    } else if (info.type === TKSurveyInfosType.KOBO) {
      rawData = await TKGetKoboRawData(info);
    }
    console.log(
      `Raw data ${info.name} retrieved in ${(Date.now() - before) /
        1000} seconds.`
    );

    const beforeFDF = Date.now();

    // Retrieve config
    const fdf = await TKCreateFDF(info, indicators, spatialDescription);

    console.log(
      `FDF  ${info.name} retrieved in ${(Date.now() - beforeFDF) /
        1000} seconds.`
    );

    const beforeSurvey = Date.now();

    // Create survey
    surveys.push(TKCreateSurvey(rawData, fdf, languages, info.options));

    console.log(
      `Survey  ${info.name} computed in ${(Date.now() - beforeSurvey) /
        1000} seconds.`
    );
  }
  return new TKDataset(surveys);
}
