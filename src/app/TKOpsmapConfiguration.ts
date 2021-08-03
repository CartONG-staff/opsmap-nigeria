import { TKMapboxConfiguration } from "@/domain/opsmapConfig/TKMapboxConfiguration";
import { TKLabel } from "@/domain/ui/TKLabel";
import { TKFooterLogosDescription } from "@/domain/opsmapConfig/TKFooterLogos";
import { TKSpatialDescription } from "@/domain/opsmapConfig/TKSpatialDescription";
import { TKIndicatorsDescription } from "@/domain/opsmapConfig/TKIndicatorsDescription";
import { TKSurveyInfos } from "@/domain/opsmapConfig/TKSurveyInfos";

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
  readonly iframe?: string;
  readonly surveys: TKSurveyInfos[];
  readonly spatial: TKSpatialDescription;
  readonly mapConfig: TKMapboxConfiguration;
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

  console.log(json);

  // ////////////////////////////////////////////////////////////////////////////
  // Languages
  // Always has english, is never empty.
  if (!json.languages.includes("en")) {
    json.languages.push("en");
  }

  return json;
}
