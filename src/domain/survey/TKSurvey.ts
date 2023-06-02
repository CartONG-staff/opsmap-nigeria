/* eslint-disable @typescript-eslint/no-explicit-any */

import { TKBoundaries } from "./TKBoundaries";
import { TKCreateSubmission, TKSubmission } from "./TKSubmission";

import { TKFDF } from "@/domain/fdf/TKFDF";
import { TKSite, TKSiteBoundaries } from "@/domain/survey/TKSite";
import { TKDateCompare, TKDateFormat } from "@/domain/utils/TKDate";
import { TKFDFIndicators } from "../fdf/TKFDFIndicators";
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
  inputDateFormat: string;
  displayDateFormat: string;
  listSeparator: string;
}

export type TKAdminLevelsBoundariesArray = Partial<
  Record<TKAdminLevel, TKBoundaries[]>
>;

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
  defaultIndicators: TKFDFIndicators;
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
  for (const level of ADMIN_LEVELS_ARRAY) {
    boundariesList[level] = [];
  }

  // Default bounds
  const DEFAULT_SITE_COORDINATES = getCenterOfBounds(
    TKConfigurationModule.configuration.spatialConfiguration.mapConfig.bounds
  );

  // Apply formatting to date item
  if (options.inputDateFormat && options.displayDateFormat) {
    submissions.map(submission => {
      submission[fdf.spatialDescription.siteLastUpdateField] = TKDateFormat(
        submission[fdf.spatialDescription.siteLastUpdateField],
        options.inputDateFormat,
        options.displayDateFormat
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
      for (const level of ADMIN_LEVELS_ARRAY) {
        admins[level] = {
          pcode: submission[fdf.spatialDescription.admins[level]?.pcode ?? ""],
          name: submission[fdf.spatialDescription.admins[level]?.name ?? ""]
        };
      }

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
      for (const level of ADMIN_LEVELS_ARRAY) {
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
      }
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
      return TKDateCompare(a.date, b.date, options.displayDateFormat);
    })
  );

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
    defaultIndicators: fdf.indicators,
    fdf: fdf,
    options: options,
    additionalFiltersDescription: additionalFiltersDescription
  };
}
