/* eslint-disable @typescript-eslint/no-explicit-any */

import { TKBoundaries } from "./TKBoundaries";
import { TKCreateSubmission, TKSubmission } from "./TKSubmission";
import {
  PEOPLE_COUNT_ICON,
  SITE_COUNT_ICON,
  TKIndicator,
  TKIndicatorType
} from "./TKIndicator";
import { PEOPLE_COUNT_LABEL, SITE_COUNT_LABEL } from "./TKIndicatorLabels";

import { TKFDF } from "@/domain/fdf/TKFDF";
import { TKSite, TKSiteBoundaries } from "@/domain/survey/TKSite";
import { TKDateCompare, TKDateFormat } from "@/domain/utils/TKDate";
import {
  TKFDFIndicatorPeopleCount,
  TKFDFIndicators,
  TKFDFIndicatorSiteCount,
  TKFDFIndicatorStandard,
  TKFDFIndicatorType,
  TKFDFIndicatorValueCount
} from "../fdf/TKFDFIndicators";
import { TKSubmissionEntryType } from "./TKSubmissionEntry";
import { getCenterOfBounds } from "../map/TKMapSites";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import { TKAdminLevel } from "../opsmapConfig/TKAdminLevel";
import { TKAdditionalFilterDescription } from "./TKAdditionalFilter";

// ////////////////////////////////////////////////////////////////////////////
// Survey concept definition
// ////////////////////////////////////////////////////////////////////////////

export enum TKSurveyAnonymousType {
  NONE = "none",
  TEXT = "text",
  TEXT_AND_MAP = "text and map"
}

export interface TKSurveyOptions {
  anonymousMode: TKSurveyAnonymousType;
  dateFormat: string;
  listSeparator: string;
}

export type TKAdminLevelsBoundariesArray = {
  [key in TKAdminLevel]?: TKBoundaries[];
};

// ////////////////////////////////////////////////////////////////////////////
// Survey concept definition
// ////////////////////////////////////////////////////////////////////////////

export interface TKSurvey {
  name: string;
  boundaries: TKAdminLevelsBoundariesArray;
  fdf: TKFDF;
  sites: TKSite[];
  options: TKSurveyOptions;
  additionalFiltersDescription: TKAdditionalFilterDescription[];
  computedIndicators: Record<string, [TKIndicator, TKIndicator, TKIndicator]>; // pcode -> string
  defaultIndicators: TKFDFIndicators;
}

// ////////////////////////////////////////////////////////////////////////////
// helper method that compute survey indicator
// ////////////////////////////////////////////////////////////////////////////

function computeSurveyIndicator(
  descr:
    | TKFDFIndicatorSiteCount
    | TKFDFIndicatorPeopleCount
    | TKFDFIndicatorValueCount
    | TKFDFIndicatorStandard,
  sites: TKSite[]
): TKIndicator {
  // Handle Site Count
  if (descr.type === TKFDFIndicatorType.SITE_COUNT) {
    return {
      type: TKIndicatorType.STANDARD,
      nameLabel: SITE_COUNT_LABEL,
      valueLabel: {
        en: String(sites.length)
      },
      iconOchaName: SITE_COUNT_ICON
    };
  }

  // Accumulate results
  const results = [];
  for (const site of sites) {
    if (site.submissions.length > 0) {
      const submission = site.submissions[0];

      const item = submission.entries[descr.entryCode];
      if (
        item &&
        item.type === TKSubmissionEntryType.TEXT &&
        item.answerLabel
      ) {
        results.push(item.answerLabel.en);
      }
    }
  }

  // Process Results
  let result = "-";
  if (results.length > 0) {
    if (
      descr.type === TKFDFIndicatorType.PEOPLE_COUNT ||
      descr.type === TKFDFIndicatorType.STANDARD
    ) {
      // Do the sum of numeric value
      result = String(
        results.reduce(
          (sum, current) =>
            sum +
            (!isNaN(parseFloat(current)) ? Math.floor(parseFloat(current)) : 0),
          0
        )
      );
    } else if (descr.type === TKFDFIndicatorType.VALUE_COUNT) {
      result = String(results.filter(item => item === descr.refValue).length);
    }
  }

  if (descr.type === TKFDFIndicatorType.PEOPLE_COUNT) {
    return {
      type: TKIndicatorType.STANDARD,
      nameLabel: PEOPLE_COUNT_LABEL,
      valueLabel: { en: result },
      iconOchaName: PEOPLE_COUNT_ICON
    };
  }

  return {
    type: TKIndicatorType.STANDARD,
    iconOchaName: descr.iconOchaName,
    nameLabel: descr.name,
    valueLabel: { en: result }
  };
}

// ////////////////////////////////////////////////////////////////////////////
// Survey Creation Method
// ////////////////////////////////////////////////////////////////////////////

export function TKCreateSurvey(
  submissions: Record<string, string>[],
  fdf: TKFDF,
  languages: Array<string>,
  options: TKSurveyOptions,
  additionalFiltersDescription: TKAdditionalFilterDescription[]
): TKSurvey {
  let sites: TKSite[] = [];

  const ADMIN_LEVELS_ARRAY = TKConfigurationModule.configuration.adminLevels;
  const boundariesList: TKAdminLevelsBoundariesArray = {};
  ADMIN_LEVELS_ARRAY.forEach(level => {
    boundariesList[level] = [];
  });

  // Default bounds
  const DEFAULT_SITE_COORDINATES = getCenterOfBounds(
    TKConfigurationModule.configuration.spatialConfiguration.mapConfig.bounds
  );

  // Apply formatting to date item
  if (options.dateFormat) {
    submissions.map(submission => {
      submission[fdf.spatialDescription.siteLastUpdateField] = TKDateFormat(
        submission[fdf.spatialDescription.siteLastUpdateField],
        options.dateFormat
      );
    });
  }

  for (const submission of submissions) {
    const computedSubmission = TKCreateSubmission(
      submission,
      fdf,
      options,
      languages
    );

    // Check if new site
    let site = sites.find(
      site => site.id === submission[fdf.spatialDescription.siteIDField]
    );

    // Doesn't exist in sites list
    if (!site) {
      // Generate admins
      const admins: TKSiteBoundaries = {};
      ADMIN_LEVELS_ARRAY.forEach(level => {
        admins[level] = {
          pcode: submission[fdf.spatialDescription.admins[level]?.pcode ?? ""],
          name: submission[fdf.spatialDescription.admins[level]?.name ?? ""]
        };
      });

      site = {
        id: submission[fdf.spatialDescription.siteIDField],
        name: submission[fdf.spatialDescription.siteNameField],
        type: fdf.siteTypes[submission[fdf.spatialDescription.siteTypeField]],
        admins: admins,

        managedBy: submission[fdf.spatialDescription.siteManageByField]
          ? fdf.answersLabels[
              submission[fdf.spatialDescription.siteManageByField]
            ] ?? {
              en: submission[fdf.spatialDescription.siteManageByField]
            }
          : fdf.spatialDescription.siteManageByAltValue &&
            submission[fdf.spatialDescription.siteManageByAltValue]
          ? fdf.answersLabels[
              submission[fdf.spatialDescription.siteManageByAltValue]
            ] ?? {
              en: submission[fdf.spatialDescription.siteManageByAltValue]
            }
          : { en: "-" },
        submissions: [computedSubmission],
        coordinates: {
          lat: DEFAULT_SITE_COORDINATES.lat,
          lng: DEFAULT_SITE_COORDINATES.lng
        }
      };

      // If not anonymisation, set lat long
      if (
        options.anonymousMode !== TKSurveyAnonymousType.TEXT_AND_MAP &&
        fdf.spatialDescription.siteLatitudeField &&
        fdf.spatialDescription.siteLongitudeField
      ) {
        site.coordinates = {
          lat: Number(
            submission[fdf.spatialDescription.siteLatitudeField].replace(
              ",",
              "."
            )
          ),
          lng: Number(
            submission[fdf.spatialDescription.siteLongitudeField].replace(
              ",",
              "."
            )
          )
        };
      }
      sites.push(site);

      // Add the admins if they doesn't exists
      ADMIN_LEVELS_ARRAY.forEach(level => {
        if (!boundariesList[level]) {
          boundariesList[level] = [];
        }
        if (
          !(boundariesList[level] as TKBoundaries[])
            .map(x => x.pcode)
            .includes(
              submission[
                (fdf.spatialDescription.admins[level] as TKBoundaries).pcode
              ]
            )
        ) {
          (boundariesList[level] as TKBoundaries[]).push({
            pcode:
              submission[
                (fdf.spatialDescription.admins[level] as TKBoundaries).pcode
              ],
            name:
              submission[
                (fdf.spatialDescription.admins[level] as TKBoundaries).name ??
                  ""
              ]
          });
        }
      });
    }
    // Exist in sites list
    else {
      // Add the submissions
      site.submissions.push(computedSubmission);
    }
  }

  // Sort the dates and update last submission date for each site
  sites.map(site =>
    site.submissions.sort((a: TKSubmission, b: TKSubmission) => {
      return TKDateCompare(a.date, b.date);
    })
  );

  // //////////////////////////////////////////////////////////////////////////
  // Compute all indicators
  // //////////////////////////////////////////////////////////////////////////

  const computedIndicators: Record<
    string,
    [TKIndicator, TKIndicator, TKIndicator]
  > = {};

  // Root.
  computedIndicators[""] = [
    computeSurveyIndicator(fdf.indicators.home[0], sites),
    computeSurveyIndicator(fdf.indicators.home[1], sites),
    computeSurveyIndicator(fdf.indicators.home[2], sites)
  ];

  for (const [level, levelBoundaries] of Object.entries(boundariesList)) {
    if (!levelBoundaries) {
      continue;
    }
    for (const boundaries of levelBoundaries) {
      const sitesFiltered = sites.filter(
        site =>
          (site.admins[level as TKAdminLevel] as TKBoundaries).pcode ===
          boundaries.pcode
      );
      computedIndicators[boundaries.pcode] = [
        computeSurveyIndicator(fdf.indicators.home[0], sitesFiltered),
        computeSurveyIndicator(fdf.indicators.home[1], sitesFiltered),
        computeSurveyIndicator(fdf.indicators.home[2], sitesFiltered)
      ];
    }
  }

  // //////////////////////////////////////////////////////////////////////////
  // Sort by alphabetical order
  // //////////////////////////////////////////////////////////////////////////

  sites = sites.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  for (const level of Object.keys(boundariesList)) {
    boundariesList[level as TKAdminLevel] = (boundariesList[
      level as TKAdminLevel
    ] as TKBoundaries[]).sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }

  // //////////////////////////////////////////////////////////////////////////
  //
  // //////////////////////////////////////////////////////////////////////////

  return {
    name: fdf.name,
    sites: sites,
    boundaries: boundariesList,
    computedIndicators: computedIndicators,
    defaultIndicators: fdf.indicators,
    fdf: fdf,
    options: options,
    additionalFiltersDescription: additionalFiltersDescription
  };
}
