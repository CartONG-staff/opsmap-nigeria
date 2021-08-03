import { TKMapboxConfiguration } from "@/domain/opsmapConfig/TKMapboxConfiguration";
import { TKLabel } from "@/domain/ui/TKLabel";
import { TKFooterLogosDescription } from "@/domain/opsmapConfig/TKFooterLogosDescription";
import { TKSpatialDescription } from "@/domain/opsmapConfig/TKSpatialDescription";
import { TKIndicatorsDescription } from "@/domain/opsmapConfig/TKIndicatorsDescription";
import { TKSurveyInfos } from "@/domain/opsmapConfig/TKSurveyInfos";
import { TKAppOptions } from "@/domain/opsmapConfig/TKAppOptions";
import { TKLogo } from "@/domain/ui/TKLogo";
import { TKIFrameDescription } from "@/domain/opsmapConfig/TKIFrameDescription";

// ////////////////////////////////////////////////////////////////////////////
// Global Opsmap configuration
// ////////////////////////////////////////////////////////////////////////////
export interface TKOpsmapConfiguration {
  readonly name: TKLabel;
  readonly languages: string[];
  readonly iso3: string;
  readonly opsmapDescr: TKLabel;
  readonly indicators: TKIndicatorsDescription;
  readonly footerLogos: TKFooterLogosDescription;
  readonly iframe?: TKIFrameDescription;
  readonly surveys: TKSurveyInfos[];
  readonly spatial: TKSpatialDescription;
  headerLogos: TKLogo[];
  mapConfig: TKMapboxConfiguration;
  options: TKAppOptions;
}

// ////////////////////////////////////////////////////////////////////////////
// Read configuration from JSON file
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadGeneralConfiguration(
  configFileName: string
): Promise<TKOpsmapConfiguration> {
  const json: TKOpsmapConfiguration = await fetch(
    configFileName
  ).then(response => response.json());

  // ////////////////////////////////////////////////////////////////////////////
  // Languages
  // Always has english, is never empty.
  if (!json.languages.includes("en")) {
    json.languages.push("en");
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Mapbox configuration - handle default values
  // ////////////////////////////////////////////////////////////////////////////
  // Provide defaults values to mapbox config
  // UNHCR account
  // token: "pk.eyJ1IjoidW5oY3IiLCJhIjoiY2tveWJlcDV5MDVycTJ2and3ZXllcW1leCJ9.Vp5XDh5OhDXxZCZUvgEuDg",
  // style: "mapbox://styles/unhcr/ckok20x8h03ma18qp76mxi3u4",

  // OPSMAP account
  // token: "pk.eyJ1Ijoib3BzbWFwcGVyIiwiYSI6ImNrbW5xMWFuYzBqejMydnBnN2VjMTBj;cG8ifQ.OtWWd9kzJdJjogrY7gb-sw",
  // style: "mapbox://styles/opsmapper/ckmnq4jfb12r217o7yon9r383",

  const defaultMapBoxConfig: TKMapboxConfiguration = {
    token:
      "pk.eyJ1IjoidW5oY3IiLCJhIjoiY2tveWJlcDV5MDVycTJ2and3ZXllcW1leCJ9.Vp5XDh5OhDXxZCZUvgEuDg",
    style: "mapbox://styles/unhcr/ckok20x8h03ma18qp76mxi3u4",
    padding: 100,
    zoomspeed: 2,
    bounds: [-74.17, -33.34, -33.57, 5.02]
  };

  // Init with defaultMApBoxConfig, then replace existing key with mapConfig.
  // Order matter !
  json.mapConfig = {
    ...defaultMapBoxConfig,
    ...json.mapConfig
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
  const defaultOptions: TKAppOptions = {
    showCCCMLogo: true
  };

  // Init with defaultOptions, then replace existing key with options.
  // Order matter !
  json.options = {
    ...defaultOptions,
    ...json.options
  };

  // ////////////////////////////////////////////////////////////////////////////
  // Return final json
  // ////////////////////////////////////////////////////////////////////////////

  console.log(json);

  return json;
}
