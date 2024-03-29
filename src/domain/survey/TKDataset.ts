import { TKBoundaries } from "@/domain/survey/TKBoundaries";
import { TKSubmission } from "./TKSubmission";
import { TKSite } from "@/domain/survey/TKSite";
import { TKAdminLevelsBoundariesArray, TKSurvey } from "./TKSurvey";
import {
  TKAdminLevel,
  arrayLeafToRoot,
  arrayLevelBelowToLeaf,
  arrayLevelToLeaf,
  arrayLevelUpToRoot,
  arrayRootToLeaf
} from "../opsmapConfig/TKAdminLevel";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import {
  TKAdditionalFilter,
  applyAdditionalFilter,
  computeAdditionalFilterCandidates
} from "./TKAdditionalFilter";

import { TKGetLocalValue } from "../utils/TKLabel";
import { TKIndicators, computeAreaIndicators } from "./TKIndicator";

// ////////////////////////////////////////////////////////////////////////////
// Filters Concept description. Requires Comments !
// TODO : work on this : clarity, comments, etc.
// ////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////////
//
// ////////////////////////////////////////////////////////////////////////////

export class TKDataset {
  private _lastModification = "";

  // Dataset
  private _surveys: TKSurvey[];
  private _currentSurvey!: TKSurvey; // ! --> Disable'not defined in ctor error'

  // Selection state
  private _currentAdmins: Partial<
    Record<TKAdminLevel, TKBoundaries | null>
  > = {};

  private _currentSite: TKSite | null = null;
  private _currentSubmission: TKSubmission | null = null;

  private _filteredAdminList: TKAdminLevelsBoundariesArray = {};

  private _filteredSitesList: TKSite[] = [];

  private _filteredTypedSitesList: TKSite[] = [];

  private _additionalFilters: TKAdditionalFilter[] = [];

  private _typeSite: Record<
    string,
    {
      active: boolean;
    }
  > = {};

  private _currentAreaIndicators: TKIndicators | null;

  constructor(surveys: TKSurvey[]) {
    const before = Date.now();

    this._surveys = surveys;
    this._currentAreaIndicators = null;
    if (this._surveys.length > 0) {
      this.currentSurvey = this._surveys[0];
    }

    console.info(
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

  public get typeSite() {
    return this._typeSite;
  }

  public get filteredAdminList() {
    return this._filteredAdminList;
  }

  public get additionalFilters() {
    return this._additionalFilters;
  }

  public setAdditionalFilter(filter: TKAdditionalFilter) {
    const found = this.additionalFilters.find(
      item => item.description === filter.description
    );
    if (found) {
      found.filterValues = filter.filterValues;
      this._lastModification = `additionalfilter:${
        filter.description
      }-${filter.filterValues
        .map(value => TKGetLocalValue(value, "en"))
        .join("-")}}`;
      this.updateFiltering();
    }
  }

  public getFilteredAdminList(level: TKAdminLevel) {
    return this._filteredAdminList[level];
  }

  public get currentAreaIndicators(): TKIndicators | null {
    return this._currentAreaIndicators;
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Current Survey
  // ////////////////////////////////////////////////////////////////////////////

  public get hasCurrentSurvey(): boolean {
    return this._currentSurvey != null;
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
      this._currentSurvey = survey;

      this._typeSite = {};
      Object.keys(this._currentSurvey.fdf.siteTypes).map(index => {
        const item = this._currentSurvey.fdf.siteTypes[index];
        this._typeSite[item.id] = {
          active: true
        };
      });

      this._additionalFilters = this._currentSurvey.additionalFiltersDescription.map(
        description => {
          return {
            description: description,
            candidates: [],
            filterValues: []
          };
        }
      );

      this._lastModification = `survey=${this._currentSurvey.name}`;

      this.updateFiltering();
    }
  }

  setCurrentSurveyByName(name: string) {
    const survey = this._surveys.find(item => item.name === name);
    if (survey) {
      this.currentSurvey = survey;
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
      if (this._typeSite[item.type.id]) {
        return this._typeSite[item.type.id].active;
      }
      return false;
    });

    // Clear current site if needed
    if (this._currentSite && !value && this._currentSite.type.id === siteType) {
      this._currentSite = null;
      this._currentSubmission = null;
    }

    this._lastModification = `filter=${siteType}x${value}`;
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change date
  // ////////////////////////////////////////////////////////////////////////////

  public get hasCurrentSubmission(): boolean {
    return this._currentSubmission != null;
  }

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
  // get most granular admin
  // ////////////////////////////////////////////////////////////////////////////

  get mostGranularAdminLevelFilter(): TKAdminLevel | null {
    for (const level of arrayLeafToRoot()) {
      if (this._currentAdmins[level]) {
        return level;
      }
    }
    return null;
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change Admin
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

        // Clear Below Admins
        for (const belowLevel of arrayLevelBelowToLeaf(level)) {
          this._currentAdmins[belowLevel] = null;
        }

        // Clear site
        this._currentSite = null;
        this._currentSubmission = null;

        // Update Upper Admins
        const siteAdmin = this._currentSurvey.sites.find(
          site => site.admins[level]?.pcode === admin.pcode
        );

        for (const levelUpper of arrayLevelUpToRoot(level)) {
          this._currentAdmins[levelUpper] = siteAdmin?.admins[levelUpper];
        }

        this._lastModification = `${level}=${this._currentAdmins[level]?.pcode}`;

        this.updateFiltering();
      }
    } else {
      // Clear current admin and below
      for (const belowLevel of arrayLevelToLeaf(level)) {
        this._currentAdmins[belowLevel] = null;
      }

      this._currentSite = null;
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

        if (this._currentSite && this._currentSurvey) {
          // Update all Admins
          for (const level of TKConfigurationModule.configuration.spatial
            .adminLevels) {
            this._currentAdmins[level] = this._currentSite?.admins[level];
          }

          this._currentSubmission = this._currentSite.submissions[0];

          this._lastModification = `site=${this._currentSite.id}`;
        }
        this.updateFiltering();
      }
    } else {
      // Clear site
      this._currentSite = null;
      this._currentSubmission = null;
      this._lastModification = "clearSite";
      this.updateFiltering();
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Update filtering
  // ////////////////////////////////////////////////////////////////////////////

  filterAdminBaseOnFilteredSite(level: TKAdminLevel): void {
    // Filter Admin based on filtered Site List
    const validAdmin = new Set(
      this._filteredSitesList.map(site => site.admins[level]?.pcode)
    );
    this._filteredAdminList[level] = this._filteredAdminList[
      level
    ]?.filter(item => validAdmin.has(item.pcode));

    const admin = this._currentAdmins[level];
    if (admin && !validAdmin.has(admin.pcode)) {
      this._currentAdmins[level] = null;
    }
  }

  // //////////////////////////////////////////////////////////////////////////
  // Update the filtering
  // - filteredSitesList based on the differents filters (site, admins, additional)
  // - admins list based on the site list.
  // //////////////////////////////////////////////////////////////////////////
  updateFiltering() {
    const mostGranularAdminLevelFilter = this.mostGranularAdminLevelFilter;

    if (this._currentSurvey) {
      // Reset start list
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

      // update additionalfilter based on sitefiltered
      for (const filter of this._additionalFilters) {
        filter.candidates = computeAdditionalFilterCandidates(
          this._filteredSitesList,
          filter.description
        );
      }

      // Filter based on advanced
      let atLeastOneAdditionalFilter = false;
      for (const filter of this._additionalFilters) {
        if (filter.filterValues.length > 0) {
          atLeastOneAdditionalFilter = true;
          this._filteredSitesList = applyAdditionalFilter(
            this._filteredSitesList,
            filter
          );
        }
      }

      let levelsBelow: Array<TKAdminLevel> = [];
      // if site list modified: recompute all admins
      if (atLeastOneAdditionalFilter) {
        levelsBelow = arrayRootToLeaf();
      }
      // otherwise: compute only belows
      else {
        if (mostGranularAdminLevelFilter) {
          levelsBelow = arrayLevelBelowToLeaf(mostGranularAdminLevelFilter);
        }
      }
      for (const levelBelow of levelsBelow) {
        this.filterAdminBaseOnFilteredSite(levelBelow);
      }

      // Adjust Current
      if (this._currentSite) {
        if (
          !this._filteredSitesList.find(
            site => this._currentSite?.id === site.id
          )
        ) {
          this._currentSite = null;
          this._currentSubmission = null;
        }
      }

      const levels = TKConfigurationModule.configuration.spatial.adminLevels;
      for (const level of levels) {
        if (this._currentAdmins[level]) {
          if (
            !this._filteredAdminList[level]?.find(
              admin => admin.pcode === this._currentAdmins[level]?.pcode
            )
          ) {
            this._currentAdmins[level] = null;
          }
        }
      }
      // Filter based on most granular admin
      if (mostGranularAdminLevelFilter) {
        const currentAdmin = this._currentAdmins[mostGranularAdminLevelFilter];
        this._filteredSitesList = this._filteredSitesList.filter(
          site =>
            site.admins[mostGranularAdminLevelFilter] &&
            site.admins[mostGranularAdminLevelFilter]?.pcode ===
              currentAdmin?.pcode
        );
      }

      // Update filtered typed sites list
      this._filteredTypedSitesList = this._filteredSitesList.filter(item => {
        if (item.type && this._typeSite[item.type.id]) {
          return this._typeSite[item.type.id].active;
        }
        return false;
      });

      // Compute Indicators
      this._currentAreaIndicators = computeAreaIndicators(
        this._currentSurvey,
        this._filteredSitesList
      );
    }
  }
}
