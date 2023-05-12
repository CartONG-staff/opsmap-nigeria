import { TKBoundaries } from "@/domain/survey/TKBoundaries";
import { TKSubmission } from "./TKSubmission";
import { TKSite } from "@/domain/survey/TKSite";
import { TKAdminLevelsBoundariesArray, TKSurvey } from "./TKSurvey";
import {
  TKAdminLevel,
  arrayLevelBelowToLeaf,
  arrayLevelToLeaf,
  arrayLevelToRoot,
  arrayLevelUpToRoot,
  arrayRootToLevel,
  parent
} from "../opsmapConfig/TKAdminLevel";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";

// ////////////////////////////////////////////////////////////////////////////
// Filters Concept description. Requires Comments !
// TODO : work on this : clarity, comments, etc.
// ////////////////////////////////////////////////////////////////////////////

// TODO : split level (survey -> site and filter planned / spontaneous)

export enum TKAdminFilters {
  SURVEY = "survey",
  ADMIN1 = "admin1",
  ADMIN2 = "admin2",
  ADMIN3 = "admin3",
  ADMIN4 = "admin4",
  SITE = "site"
}

export type TKAdminFiltersTypes = string | boolean | null;

function getAdminFiltersFromAdminLevel(level: TKAdminLevel): TKAdminFilters {
  switch (level) {
    case TKAdminLevel.ADMIN1:
      return TKAdminFilters.ADMIN1;
    case TKAdminLevel.ADMIN2:
      return TKAdminFilters.ADMIN2;
    case TKAdminLevel.ADMIN3:
      return TKAdminFilters.ADMIN3;
    case TKAdminLevel.ADMIN4:
      return TKAdminFilters.ADMIN4;
  }
}

// ////////////////////////////////////////////////////////////////////////////
//
// ////////////////////////////////////////////////////////////////////////////

export class TKDataset {
  private _lastModification = "";

  // Dataset
  private _surveys: TKSurvey[];
  private _currentSurvey!: TKSurvey; // ! --> Disable'not defined in ctor error'

  // Selection state
  private _currentAdmins: {
    [key in TKAdminLevel]?: TKBoundaries | null;
  } = {};

  private _currentSite: TKSite | null = null;
  private _currentSubmission: TKSubmission | null = null;

  private _filteredAdminList: TKAdminLevelsBoundariesArray = {};

  private _filteredSitesList: TKSite[] = [];

  private _filteredTypedSitesList: TKSite[] = [];

  private _typeSite: Record<
    string,
    {
      active: boolean;
    }
  > = {};

  private _filters: Record<TKAdminFilters, TKAdminFiltersTypes> = {
    [TKAdminFilters.SURVEY]: null,
    [TKAdminLevel.ADMIN1]: null,
    [TKAdminLevel.ADMIN2]: null,
    [TKAdminLevel.ADMIN3]: null,
    [TKAdminLevel.ADMIN4]: null,
    [TKAdminFilters.SITE]: null
  };
  private _levelToZoom: TKAdminFilters = TKAdminFilters.SURVEY;

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

  public get filteredSitesList(): TKSite[] {
    return this._filteredSitesList;
  }

  public get filteredTypedSitesList(): TKSite[] {
    return this._filteredTypedSitesList;
  }

  public get filters(): {
    [key in TKAdminFilters]: TKAdminFiltersTypes;
  } {
    return this._filters;
  }

  public get levelToZoom(): TKAdminFilters {
    return this._levelToZoom;
  }

  public get typeSite() {
    return this._typeSite;
  }

  public get filteredAdminList() {
    return this._filteredAdminList;
  }

  public getFilteredAdminList(level: TKAdminLevel) {
    return this._filteredAdminList[level];
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
      this._currentSite = null;
      this._currentSubmission = null;
      this._currentAdmins = {
        [TKAdminLevel.ADMIN1]: null,
        [TKAdminLevel.ADMIN2]: null,
        [TKAdminLevel.ADMIN3]: null,
        [TKAdminLevel.ADMIN4]: null
      };
      this._filters[TKAdminFilters.SITE] = null;
      this._filters[TKAdminFilters.ADMIN4] = null;
      this._filters[TKAdminFilters.ADMIN3] = null;
      this._filters[TKAdminFilters.ADMIN2] = null;
      this._filters[TKAdminFilters.ADMIN1] = null;
      this._levelToZoom = TKAdminFilters.SURVEY;

      this._currentSurvey = survey;

      this._typeSite = {};
      Object.keys(this._currentSurvey.fdf.siteTypes).map(index => {
        const item = this._currentSurvey.fdf.siteTypes[index];
        this._typeSite[item.formattedName] = {
          active: true
        };
      });

      this._lastModification = `survey=${this._currentSurvey.name}`;

      this.updateFiltering();
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Filter all
  // ////////////////////////////////////////////////////////////////////////////

  setTypedFilterValue(siteType: string, value: boolean) {
    // Update value
    if (this._typeSite[siteType]) {
      this._typeSite[siteType].active = value;
    }

    // Update filtered typed sites list
    this._filteredTypedSitesList = this._filteredSitesList.filter(item => {
      if (this._typeSite[item.type.formattedName]) {
        return this._typeSite[item.type.formattedName].active;
      }
      return false;
    });

    // Clear current site if needed
    if (
      this._currentSite &&
      !value &&
      this._currentSite.type.formattedName === siteType
    ) {
      this._levelToZoom = this._currentAdmins[TKAdminLevel.ADMIN4]
        ? TKAdminFilters.ADMIN4
        : this._currentAdmins[TKAdminLevel.ADMIN3]
        ? TKAdminFilters.ADMIN3
        : this._currentAdmins[TKAdminLevel.ADMIN2]
        ? TKAdminFilters.ADMIN2
        : this._currentAdmins[TKAdminLevel.ADMIN1]
        ? TKAdminFilters.ADMIN1
        : TKAdminFilters.SURVEY;
      this._currentSite = null;
      this._currentSubmission = null;
      this._filters[TKAdminFilters.SITE] = null;
    }

    this._lastModification = `filter=${siteType}x${value}`;
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change date
  // ////////////////////////////////////////////////////////////////////////////

  public get currentSubmission(): TKSubmission | null {
    return this._currentSubmission;
  }

  public set currentSubmission(submission: TKSubmission | null) {
    if (submission !== this._currentSubmission) {
      if (submission && this._currentSite?.submissions.includes(submission)) {
        this._currentSubmission = submission;
      } else {
        this._currentSubmission = this._currentSite?.submissions[0] ?? null;
      }
      this._lastModification = `submission=${this._currentSubmission?.date}`;
    }
  }

  setSubmissionByDate(date: string) {
    const submission = this._currentSite?.submissions.find(
      submission => submission.date === date
    );

    this.currentSubmission = submission ?? null;
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change Admin1
  // ////////////////////////////////////////////////////////////////////////////
  get currentAdmins() {
    return this._currentAdmins;
  }

  public getCurrentAdmin(level: TKAdminLevel): TKBoundaries | null {
    return this._currentAdmins[level] ?? null;
  }

  public setCurrentAdmin(level: TKAdminLevel, admin: TKBoundaries | null) {
    if (admin) {
      if (admin !== this._currentAdmins[level]) {
        // Update current admin
        this._currentAdmins[level] = admin;
        this._filters[level] = this._currentAdmins[level]?.pcode ?? "";

        // Clear Below Admins
        arrayLevelBelowToLeaf(level).forEach(level => {
          this._filters[level] = null;
          this._currentAdmins[level] = null;
        });

        // Clear site
        this._currentSite = null;
        this._currentSubmission = null;
        this._filters[TKAdminFilters.SITE] = null;

        // Update Upper Admins
        const siteAdmin = this._currentSurvey.sites.find(
          site => site.admins[level]?.pcode === admin.pcode
        );
        arrayLevelUpToRoot(level).forEach(level => {
          this._currentAdmins[level] = siteAdmin?.admins[level];
        });

        this._levelToZoom = getAdminFiltersFromAdminLevel(level);
        this._lastModification = `${level}=${this._currentAdmins[level]?.pcode}`;
        this.updateFiltering();
      }
    } else {
      // Level to zoom to upper
      const parentAdminLevel = parent(level);
      this._levelToZoom = parentAdminLevel
        ? getAdminFiltersFromAdminLevel(parentAdminLevel)
        : TKAdminFilters.SURVEY;
      // Clear current admin and below
      arrayLevelToLeaf(level).forEach(level => {
        this._filters[level] = null;
        this._currentAdmins[level] = null;
      });

      this._currentSite = null;
      this._filters[TKAdminFilters.SITE] = null;
      this._currentSubmission = null;

      this._lastModification = `clear:${level}`;

      this.updateFiltering();
    }
  }

  setCurrentAdminByName(level: TKAdminLevel, name: string) {
    if (this.currentSurvey && this._currentSurvey.boundaries[level]) {
      const admin = (this._currentSurvey.boundaries[
        level
      ] as TKBoundaries[]).find(admin => admin.name === name);
      this.setCurrentAdmin(level, admin ?? null);
    } else {
      this.setCurrentAdmin(level, null);
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change Site
  // ////////////////////////////////////////////////////////////////////////////

  setCurrentSiteByName(siteName: string) {
    if (this._currentSurvey) {
      const site = this._currentSurvey.sites.find(
        site => site.name === siteName
      );
      this.currentSite = site ?? null;
    } else {
      this.currentSite = null;
    }
  }

  public get currentSite(): TKSite | null {
    return this._currentSite;
  }

  public set currentSite(site: TKSite | null) {
    if (site) {
      if (this._currentSite !== site) {
        this._currentSite = site;

        this._filters[TKAdminFilters.SITE] = this._currentSite.id;
        this._levelToZoom = TKAdminFilters.SITE;

        if (this._currentSite && this._currentSurvey) {
          // Update Upper Admins
          arrayLevelToRoot(
            TKConfigurationModule.configuration.mostGranularAdmin
          ).forEach(level => {
            this._currentAdmins[level] = this._currentSite?.admins[level];
          });

          this._currentSubmission = this._currentSite.submissions[0];

          this._lastModification = `site=${this._currentSite.id}`;
        }
        this.updateFiltering();
      }
    } else {
      // Clear site
      this._levelToZoom = this._currentAdmins[TKAdminLevel.ADMIN4]
        ? TKAdminFilters.ADMIN4
        : this._currentAdmins[TKAdminLevel.ADMIN3]
        ? TKAdminFilters.ADMIN3
        : this._currentAdmins[TKAdminLevel.ADMIN2]
        ? TKAdminFilters.ADMIN2
        : this._currentAdmins[TKAdminLevel.ADMIN1]
        ? TKAdminFilters.ADMIN1
        : TKAdminFilters.SURVEY;
      this._currentSite = null;
      this._currentSubmission = null;
      this._filters[TKAdminFilters.SITE] = null;
      this._lastModification = "clearSite";
      this.updateFiltering();
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Update filtering
  // ////////////////////////////////////////////////////////////////////////////

  filterAdminBaseOnFilteredSite(level: TKAdminLevel): void {
    // Filter Admin based on filtered Site List //////////////////////////////
    const validAdmin = new Set(
      this._filteredSitesList.map(site => site.admins[level]?.pcode)
    );
    this._filteredAdminList[level] = this._filteredAdminList[
      level
    ]?.filter(item => validAdmin.has(item.pcode));

    const admin = this._currentAdmins[level];
    if (admin && !validAdmin.has(admin.pcode)) {
      this._currentAdmins[level] = null;
      this._filters[TKAdminFilters.ADMIN1] = null;
    }
  }

  // Sponateneous
  updateFiltering() {
    if (this._currentSurvey) {
      // Reset site list ////////////////////////////////////////////////////////
      this._filteredSitesList = this._currentSurvey.sites;
      this._filteredAdminList = {
        [TKAdminLevel.ADMIN1]: this._currentSurvey.boundaries[
          TKAdminLevel.ADMIN1
        ],
        [TKAdminLevel.ADMIN2]: this._currentSurvey.boundaries[
          TKAdminLevel.ADMIN2
        ],
        [TKAdminLevel.ADMIN3]: this._currentSurvey.boundaries[
          TKAdminLevel.ADMIN3
        ],
        [TKAdminLevel.ADMIN4]: this._currentSurvey.boundaries[
          TKAdminLevel.ADMIN4
        ]
      };
      const levels = arrayRootToLevel(
        TKConfigurationModule.configuration.mostGranularAdmin
      );

      levels.forEach(level => {
        if (this._filters[level]) {
          this._filteredSitesList = this._filteredSitesList.filter(
            site =>
              site.admins[level] &&
              site.admins[level]?.pcode === this._filters[level]
          );

          const levelsBelow = arrayLevelBelowToLeaf(level);

          levelsBelow.forEach(levelBelow => {
            this.filterAdminBaseOnFilteredSite(levelBelow);
          });
        }
      });

      // Update filtered typed sites list
      this._filteredTypedSitesList = this._filteredSitesList.filter(item => {
        if (item.type && this._typeSite[item.type.formattedName]) {
          return this._typeSite[item.type.formattedName].active;
        }
        return false;
      });
    }
  }
}
