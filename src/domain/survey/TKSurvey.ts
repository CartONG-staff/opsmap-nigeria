/* eslint-disable @typescript-eslint/no-explicit-any */

import { TKBoundaries } from "./TKBoundaries";
import { TKCreateSubmission, TKSubmission } from "./TKSubmission";

import { TKFDF } from "@/domain/fdf/TKFDF";
import { TKSite, TKSiteBoundaries } from "@/domain/survey/TKSite";
import { TKDateCompare, TKDateFormat } from "@/domain/utils/TKDate";
import { TKFDFIndicators } from "@/domain/fdf/TKFDFIndicators";
import { getCenterOfBounds } from "@/domain/map/TKMapSites";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import { TKAdminLevel } from "@/domain/opsmapConfig/TKAdminLevel";
import { TKAdditionalFilterDescription } from "./TKAdditionalFilter";
import { TKSiteMapVisualisation } from "./TKSurveyMapVisualisation";

// ////////////////////////////////////////////////////////////////////////////
// Survey concept definition
// ////////////////////////////////////////////////////////////////////////////

export enum TKSurveyZoomSiteType {
  SITE = "site",
  CLOSEST_ADMIN_PARENT = "admin"
}

export enum TKSurveyAnonymousType {
  NONE = "none",
  TEXT = "text",
  TEXT_AND_MAP = "text and map"
}

export interface TKSurveyOptions {
  anonymousMode: TKSurveyAnonymousType;
  siteZoomMode: TKSurveyZoomSiteType;
  siteZoomBuffer: number;
  inputDateFormat: string;
  displayDateFormat: string;
  listSeparator: string;
  sitesMapVisualisation: TKSiteMapVisualisation[];
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
  locales: Array<string>,
  options: TKSurveyOptions,
  additionalFiltersDescription: TKAdditionalFilterDescription[]
): TKSurvey {
  let sites: TKSite[] = [];

  const ADMIN_LEVELS_ARRAY =
    TKConfigurationModule.configuration.spatial.adminLevels;
  const boundariesList: TKAdminLevelsBoundariesArray = {};
  for (const level of ADMIN_LEVELS_ARRAY) {
    boundariesList[level] = [];
  }

  // Default bounds
  const DEFAULT_SITE_COORDINATES = getCenterOfBounds(
    TKConfigurationModule.configuration.spatial.mapConfig.bounds
  );

  // Apply formatting to date item
  if (options.inputDateFormat && options.displayDateFormat) {
    submissions.map(submission => {
      submission[fdf.spatial.siteFields.lastUpdate] = TKDateFormat(
        submission[fdf.spatial.siteFields.lastUpdate],
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
      locales
    );

    // Check if new site
    let site = sites.find(
      site => site.id === submission[fdf.spatial.siteFields.id]
    );

    // Doesn't exist in sites list
    if (!site) {
      // Generate admins
      const admins: TKSiteBoundaries = {};
      for (const level of ADMIN_LEVELS_ARRAY) {
        admins[level] = {
          pcode: submission[fdf.spatial.admins[level]?.pcode ?? ""],
          name: submission[fdf.spatial.admins[level]?.name ?? ""]
        };
      }

      site = {
        id: submission[fdf.spatial.siteFields.id],
        name: submission[fdf.spatial.siteFields.name],
        label:
          fdf.answersLabels[submission[fdf.spatial.siteFields.name]] ??
          submission[fdf.spatial.siteFields.name],
        type: fdf.siteTypes[submission[fdf.spatial.siteFields.type]],
        admins: admins,
        adminsLabels: Object.assign(
          {},
          ...Object.keys(admins).map(x => {
            return {
              [x]:
                fdf.answersLabels[admins[x as TKAdminLevel]!.name] ??
                admins[x as TKAdminLevel]!.name
            };
          })
        ),
        managedBy: submission[fdf.spatial.siteFields.manageBy]
          ? fdf.answersLabels[submission[fdf.spatial.siteFields.manageBy]] ?? {
              [TKConfigurationModule.configuration.locale.default]:
                submission[fdf.spatial.siteFields.manageBy]
            }
          : fdf.spatial.siteFields.manageByAlt &&
            submission[fdf.spatial.siteFields.manageByAlt]
          ? fdf.answersLabels[
              submission[fdf.spatial.siteFields.manageByAlt]
            ] ?? {
              [TKConfigurationModule.configuration.locale.default]:
                submission[fdf.spatial.siteFields.manageByAlt]
            }
          : { [TKConfigurationModule.configuration.locale.default]: "-" },
        submissions: [computedSubmission],
        coordinates: {
          lat: DEFAULT_SITE_COORDINATES.lat,
          lng: DEFAULT_SITE_COORDINATES.lng
        }
      };

      // If not anonymisation, set lat long
      if (
        options.anonymousMode !== TKSurveyAnonymousType.TEXT_AND_MAP &&
        fdf.spatial.siteFields.latitude &&
        fdf.spatial.siteFields.longitude
      ) {
        site.coordinates = {
          lat: Number(
            submission[fdf.spatial.siteFields.latitude].replace(",", ".")
          ),
          lng: Number(
            submission[fdf.spatial.siteFields.longitude].replace(",", ".")
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
              submission[(fdf.spatial.admins[level] as TKBoundaries).pcode]
            )
        ) {
          (boundariesList[level] as TKBoundaries[]).push({
            pcode:
              submission[(fdf.spatial.admins[level] as TKBoundaries).pcode],
            name:
              submission[(fdf.spatial.admins[level] as TKBoundaries).name ?? ""]
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
