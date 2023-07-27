import { TKLabel } from "@/domain/utils/TKLabel";
import { TKLogoGroup } from "@/domain/utils/TKLogo";
import { TKSurveyInfos } from "@/domain/opsmapConfig/TKSurveyInfos";
import { TKLogo } from "@/domain/utils/TKLogo";
import VueI18n from "vue-i18n";
import {
  TKSurveyAnonymousType,
  TKSurveyOptions
} from "@/domain/survey/TKSurvey";
import { TKBasemapsLayer } from "@/domain/map/TKBasemaps";
import { TKAdminLevel, sortAdminLevelsRootFirst } from "./TKAdminLevel";
import { TKAdditionalFilterDescription } from "@/domain/survey/TKAdditionalFilter";

// ////////////////////////////////////////////////////////////////////////////
// JSON format
// ////////////////////////////////////////////////////////////////////////////
interface TKAppOptions {
  readonly showCCCMLogo: boolean;
  readonly dark: boolean;
  readonly pdfColumnCount: number;
  readonly exportForEsite: boolean;
  readonly showDemoBanner: boolean;
  readonly exportAsCSVonHomePage: boolean;
  readonly keepThematicOrderFromFDF: boolean;
}

interface TKTextContent {
  readonly name: TKLabel;
  readonly opsmapDescr: TKLabel;
}

interface TKLocaleDescription {
  default: string;
  locales: string[];
  override: Record<string, VueI18n.LocaleMessages>;
}

interface TKIFrameDescription {
  readonly url: string;
  readonly display: boolean;
}

interface TKMapboxConfiguration {
  readonly token: string;
  readonly style: string;
  readonly padding: 100;
  readonly zoomspeed: 2;
  readonly bounds: Array<number>;
}

export interface TKOpsmapSpatialConfiguration {
  mapConfig: TKMapboxConfiguration;
  dbConfig: Record<TKAdminLevel, string>;
  admin0LocalURL: string;
  adminLevels: Array<TKAdminLevel>;
  adminLevelsMap: Array<TKAdminLevel>;
}

// ////////////////////////////////////////////////////////////////////////////
// This file host some infos that could be in the FDF.
// Therefore, specific FDF types are used
// ////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////////
// Global Opsmap configuration
// ////////////////////////////////////////////////////////////////////////////

export interface TKOpsmapConfiguration {
  readonly textContent: TKTextContent;
  locale: TKLocaleDescription;
  readonly spatial: TKOpsmapSpatialConfiguration;
  readonly footerLogos: TKLogoGroup[];
  readonly iframe?: TKIFrameDescription;
  readonly surveys: TKSurveyInfos[];
  headerLogos: TKLogo[];
  options: TKAppOptions;
}

// ////////////////////////////////////////////////////////////////////////////
// Read configuration from JSON file
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadGeneralConfiguration(
  configFileName: string
): Promise<TKOpsmapConfiguration> {
  const json: TKOpsmapConfiguration = await fetch(configFileName, {
    cache: "no-store"
  }).then(response => response.json());

  // ////////////////////////////////////////////////////////////////////////////
  // Locale
  if (!json.locale) {
    json.locale = {
      locales: [],
      default: "en",
      override: {}
    };
  }

  json.locale.default = json.locale.default ?? "en";
  json.locale.override = json.locale.override ?? {};
  // Add default to locale if missing
  if (!json.locale.locales.includes(json.locale.default)) {
    json.locale.locales.push(json.locale.default);
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Admin level
  // ////////////////////////////////////////////////////////////////////////////

  // ////////////////////////////////////////////////////////////////////////////
  // Spatial Configuration
  // ////////////////////////////////////////////////////////////////////////////

  // admin0 geojson
  json.spatial.admin0LocalURL =
    json.spatial.admin0LocalURL ?? "map/admin0.geojson";

  // dbConfig
  json.spatial.dbConfig = json.spatial.dbConfig ?? {
    admin1: "pcode",
    admin2: "pcode"
  };

  // adminLevels
  json.spatial.adminLevels = sortAdminLevelsRootFirst(
    json.spatial.adminLevels ?? [TKAdminLevel.ADMIN1, TKAdminLevel.ADMIN2]
  );

  // adminLevelsMap
  json.spatial.adminLevelsMap = json.spatial.adminLevelsMap
    ? sortAdminLevelsRootFirst(json.spatial.adminLevelsMap)
    : json.spatial.adminLevels ?? [TKAdminLevel.ADMIN1, TKAdminLevel.ADMIN2];

  // ////////////////////////////////////////////////////////////////////////////
  // Mapbox configuration - handle default values
  // ////////////////////////////////////////////////////////////////////////////

  const defaultMapBoxConfig: TKMapboxConfiguration = {
    token:
      "pk.eyJ1IjoidW5oY3IiLCJhIjoiY2tveWJlcDV5MDVycTJ2and3ZXllcW1leCJ9.Vp5XDh5OhDXxZCZUvgEuDg",
    style: TKBasemapsLayer.basemapsList[0].style as string,
    padding: 100,
    zoomspeed: 2,
    bounds: [-74.17, -33.34, -33.57, 5.02]
  };

  // Init with defaultMApBoxConfig, then replace existing key with mapConfig.
  // Order matter !
  json.spatial.mapConfig = {
    ...defaultMapBoxConfig,
    ...json.spatial.mapConfig
  };

  // ////////////////////////////////////////////////////////////////////////////
  // Header Logo
  // ////////////////////////////////////////////////////////////////////////////
  const defaultHeaderLogo: TKLogo[] = [];

  json.headerLogos = {
    ...defaultHeaderLogo,
    ...json.headerLogos
  };

  // ////////////////////////////////////////////////////////////////////////////
  // Options
  // ////////////////////////////////////////////////////////////////////////////

  const defaultAppOptions: TKAppOptions = {
    showCCCMLogo: true,
    dark: false,
    pdfColumnCount: 3,
    exportForEsite: false,
    showDemoBanner: false,
    exportAsCSVonHomePage: true,
    keepThematicOrderFromFDF: false
  };

  // Init with defaultOptions, then replace existing key with options.
  // Order matter !
  json.options = {
    ...defaultAppOptions,
    ...json.options
  };

  // ////////////////////////////////////////////////////////////////////////////
  // Survey Options
  // ////////////////////////////////////////////////////////////////////////////

  // TODO: move manage by in another spot. Not an otion, more a description
  const defaultSurveyOptions: TKSurveyOptions = {
    inputDateFormat: "DD/MM/YYYY",
    displayDateFormat: "DD/MM/YYYY",
    listSeparator: ";",
    anonymousMode: TKSurveyAnonymousType.NONE
  };

  for (let i = 0; i < json.surveys.length; i++) {
    json.surveys[i].options = {
      ...defaultSurveyOptions,
      ...json.surveys[i].options
    };

    json.surveys[i].name = json.surveys[i].name ?? "Form A";
    // fdf folder set to fdf by default
    if (!json.surveys[i].fdf) {
      json.surveys[i].fdf = {
        folder: "FDF"
      };
    }
    json.surveys[i].fdf.folder = json.surveys[i].fdf.folder ?? "FDF";

    // Force to global if lat or long are undefined
    if (
      !json.surveys[i].spatial.siteFields.latitude ||
      !json.surveys[i].spatial.siteFields.longitude
    ) {
      json.surveys[i].options.anonymousMode =
        TKSurveyAnonymousType.TEXT_AND_MAP;
    }
  }

  const additionalFilters: TKAdditionalFilterDescription[] = [];
  for (let i = 0; i < json.surveys.length; i++) {
    if (!json.surveys[i].additionalFiltersDescription) {
      json.surveys[i].additionalFiltersDescription = additionalFilters;
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Return final json
  // ////////////////////////////////////////////////////////////////////////////

  console.log(json);

  return json;
}
