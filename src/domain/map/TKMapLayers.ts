import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import { TKFDFSiteTypeCollection } from "@/domain/fdf/TKFDFSiteTypes";
import { COLOR_SELECTED, TKColors } from "@/domain/utils/TKColors";
import { TKAdminLevel } from "@/domain/opsmapConfig/TKAdminLevel";

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
export const POPULATION_COUNT_CLUSTERS_CIRCLE = "populationCountClustersCircle";
export const POPULATION_COUNT_CLUSTERS_COUNT = "populationCountClustersCount";
export const SELECTED_SITE_POPULATION_CIRCLE = "selectedSitePopulationCircle";
export const NOT_SELECTED_SITES_POPULATION_CIRCLE =
  "notSelectedSitePopulationCircle";
export const SELECTED_SITE_POPULATION_COUNT = "selectedSitePopulationCount";
export const NOT_SELECTED_SITES_POPULATION_COUNT = "notSelectedSitePopulationCount";

export type TKMapLayerAdminStyles = {
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
};

export type TKMapLayerSiteTypesStyles = {
  [SELECTED_SITE]: {};
  [NOT_SELECTED_SITES]: {};
  [CLUSTERS_CIRCLE]: {};
  [CLUSTERS_COUNT]: {};
};

export type TKMapLayerPopulationCountStyles = {
  [POPULATION_COUNT_CLUSTERS_CIRCLE]: {};
  [POPULATION_COUNT_CLUSTERS_COUNT]: {};
  [SELECTED_SITE_POPULATION_CIRCLE]: {};
  [NOT_SELECTED_SITES_POPULATION_CIRCLE]: {};
  [SELECTED_SITE_POPULATION_COUNT]: {};
  [NOT_SELECTED_SITES_POPULATION_COUNT]: {};
};

export function computeMapLayersAdminStyle(): TKMapLayerAdminStyles {
  const styles: TKMapLayerAdminStyles = {
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
    }
  };

  for (const level of TKConfigurationModule.configuration.spatial
    .adminLevelsMap) {
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
  }
  return styles;
}

export function computeMapLayersSiteTypesStyle(
  siteTypesCollection: TKFDFSiteTypeCollection
): TKMapLayerSiteTypesStyles {
  console.log(siteTypesCollection);
  const siteTypes: Array<string> = [];
  const siteSelectedTypes: Array<string> = [];
  for (const siteIndex of Object.keys(siteTypesCollection)) {
    const site = siteTypesCollection[siteIndex];
    siteTypes.push(site.id);
    siteTypes.push(site.iconFileName.normal);
    siteSelectedTypes.push(site.id);
    siteSelectedTypes.push(site.iconFileName.selected);
  }

  const styles: TKMapLayerSiteTypesStyles = {
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
  return styles;
}

export function computeMapLayersPopulationCountStyle(
  populationField: string
): TKMapLayerPopulationCountStyles {
  return {
    [POPULATION_COUNT_CLUSTERS_CIRCLE]: {
      id: POPULATION_COUNT_CLUSTERS_CIRCLE,
      type: "circle",
      source: TKMapSource.NOT_SELECTED_SITES,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": COLOR_SELECTED,
        "circle-opacity": 0.8,
        "circle-radius": [
          "step",
          ["get", "populationSum"],
          20,
          10000,
          30,
          30000,
          40
        ]
      }
    },
    [POPULATION_COUNT_CLUSTERS_COUNT]: {
      id: POPULATION_COUNT_CLUSTERS_COUNT,
      type: "symbol",
      source: TKMapSource.NOT_SELECTED_SITES,
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "populationSum"],
        "text-font": ["Arial Unicode MS Bold"],
        "text-size": 12
      },
      paint: {
        "text-color": "#000"
      }
    },
    [SELECTED_SITE_POPULATION_CIRCLE]: {
      id: SELECTED_SITE_POPULATION_CIRCLE,
      type: "circle",
      source: TKMapSource.SELECTED_SITE,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-stroke-color": TKColors.DARK_GREY,
        "circle-stroke-width": 3,
        "circle-color": TKColors.ACCENT,
        "circle-opacity": 0.8,
        "circle-radius": [
          "step",
          ["get", populationField],
          15,
          3000,
          20,
          5000,
          25
        ]
      }
    },
    [NOT_SELECTED_SITES_POPULATION_CIRCLE]: {
      id: NOT_SELECTED_SITES_POPULATION_CIRCLE,
      type: "circle",
      source: TKMapSource.NOT_SELECTED_SITES,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": TKColors.ACCENT,
        "circle-opacity": 0.7,
        "circle-radius": [
          "step",
          ["get", populationField],
          15,
          3000,
          20,
          5000,
          25
        ]
      }
    },
    [SELECTED_SITE_POPULATION_COUNT]: {
      id: SELECTED_SITE_POPULATION_COUNT,
      type: "symbol",
      source: TKMapSource.SELECTED_SITE,
      filter: ["!", ["has", "point_count"]],
      layout: {
        "text-field": ["get", populationField],
        "text-font": ["Arial Unicode MS Bold"],
        "text-size": 10
      },
      paint: {
        "text-color": "#000"
      }
    },
    [NOT_SELECTED_SITES_POPULATION_COUNT]: {
      id: NOT_SELECTED_SITES_POPULATION_COUNT,
      type: "symbol",
      source: TKMapSource.NOT_SELECTED_SITES,
      filter: ["!", ["has", "point_count"]],
      layout: {
        "text-field": ["get", populationField],
        "text-font": ["Arial Unicode MS Bold"],
        "text-size": 10
      },
      paint: {
        "text-color": "#000"
      }
    }
  };
}
