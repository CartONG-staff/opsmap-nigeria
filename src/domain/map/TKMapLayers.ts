import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import { TKFDFSiteTypeCollection } from "../fdf/TKFDFSiteTypes";
import { TKColors } from "../utils/TKColors";
import { TKAdminLevel } from "../opsmapConfig/TKAdminLevel";

export enum TKMapSource {
  COUNTRY_MASK = "countryMask",
  ADMIN1 = "admin1",
  ADMIN2 = "admin2",
  ADMIN3 = "admin3",
  ADMIN4 = "admin4",
  SELECTED_SITE = "selectedSite",
  NOT_SELECTED_SITES = "notSelectedSites"
}

export const COUNTRY_MASK = "countryMask";
export const ADMIN1 = "admin1";
export const ADMIN1_BORDER = "admin1:border";
export const ADMIN2 = "admin2";
export const ADMIN2_BORDER = "admin2:border";
export const ADMIN3 = "admin3";
export const ADMIN3_BORDER = "admin3:border";
export const ADMIN4 = "admin4";
export const ADMIN4_BORDER = "admin4:border";
export const SELECTED_SITE = "selectedSite";
export const NOT_SELECTED_SITES = "notSelectedSites";
export const CLUSTERS_CIRCLE = "clustersCircle";
export const CLUSTERS_COUNT = "clustersCount";

export type TKMapLayerStyles = {
  [COUNTRY_MASK]: {};
  [TKAdminLevel.ADMIN1]?: {
    fill: {};
    border: {};
  };
  [TKAdminLevel.ADMIN2]?: {
    fill: {};
    border: {};
  };
  [TKAdminLevel.ADMIN3]?: {
    fill: {};
    border: {};
  };
  [TKAdminLevel.ADMIN4]?: {
    fill: {};
    border: {};
  };
  [SELECTED_SITE]: {};
  [NOT_SELECTED_SITES]: {};
  [CLUSTERS_CIRCLE]: {};
  [CLUSTERS_COUNT]: {};
};

export function computeMapLayersStyle(
  siteTypesCollection: TKFDFSiteTypeCollection
): TKMapLayerStyles {
  const siteTypes: Array<string> = [];
  const siteSelectedTypes: Array<string> = [];
  for (const siteIndex of Object.keys(siteTypesCollection)) {
    const site = siteTypesCollection[siteIndex];
    siteTypes.push(site.formattedName);
    siteTypes.push(site.iconFileName.normal);
    siteSelectedTypes.push(site.formattedName);
    siteSelectedTypes.push(site.iconFileName.selected);
  }

  const styles: TKMapLayerStyles = {
    [COUNTRY_MASK]: {
      id: COUNTRY_MASK,
      type: "fill",
      source: TKMapSource.COUNTRY_MASK,
      layout: {},
      paint: {
        "fill-color": TKColors.DARK_GREY,
        "fill-opacity": 0,
        "fill-opacity-transition": {
          duration: 1000
        }
      }
    },
    [CLUSTERS_CIRCLE]: {
      id: CLUSTERS_CIRCLE,
      type: "circle",
      source: TKMapSource.NOT_SELECTED_SITES,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": TKColors.DARK_GREY,
        "circle-radius": ["step", ["get", "point_count"], 10, 10, 15, 30, 20]
      }
    },
    [CLUSTERS_COUNT]: {
      id: CLUSTERS_COUNT,
      type: "symbol",
      source: TKMapSource.NOT_SELECTED_SITES,
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["Arial Unicode MS Bold"],
        "text-size": 12
      },
      paint: {
        "text-color": TKColors.WHITE
      }
    },
    [NOT_SELECTED_SITES]: {
      id: NOT_SELECTED_SITES,
      type: "symbol",
      source: TKMapSource.NOT_SELECTED_SITES,
      filter: ["!", ["has", "point_count"]],
      layout: {
        "icon-image": [
          "match",
          ["get", "type"],
          ...siteTypes,
          "planned_site" // everything else
        ],
        "icon-size": 0.5
      }
    },
    [SELECTED_SITE]: {
      id: SELECTED_SITE,
      type: "symbol",
      source: TKMapSource.SELECTED_SITE,
      layout: {
        "icon-image": [
          "match",
          ["get", "type"],
          ...siteSelectedTypes,
          "planned_site"
        ],
        "icon-size": 0.5
      }
    }
  };

  TKConfigurationModule.configuration.adminLevelsMap.forEach(level => {
    styles[level] = {
      fill: {
        id: level,
        type: "fill",
        source: level,
        layout: {},
        paint: {
          "fill-color": TKColors.ACCENT,
          "fill-opacity": [
            "match",
            ["get", "display"],
            "hide",
            0.0,
            "discrete",
            0.1,
            "focus",
            0.1,
            0.0
          ]
        }
      },
      border: {
        id: `${level}:border`,
        type: "line",
        source: level,
        layout: {},
        paint: {
          "line-color": TKColors.ACCENT,
          "line-width": [
            "match",
            ["get", "display"],
            "hide",
            0,
            "discrete",
            2,
            "focus",
            4,
            0.0
          ],
          "line-opacity": [
            "match",
            ["get", "display"],
            "hide",
            0.0,
            "discrete",
            1.0,
            "focus",
            1.0,
            0.0
          ]
        }
      }
    };
  });
  return styles;
}
