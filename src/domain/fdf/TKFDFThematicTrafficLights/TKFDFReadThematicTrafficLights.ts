import { DEFAULT_PROPERTIES } from "@/domain/fdf/TKFDFTrafficLights/TKFDFTrafficLightsDefaultProperties";
import { TKFDFTrafficLightProperties } from "@/domain/fdf/TKFDFTrafficLights/TKFDFTrafficLightProperties";
import { TKFDFThematicTrafficLightsConfiguration } from "./TKFDFThematicTrafficLightsConfiguration";
import { TKFDFThematicTrafficLightConfiguration } from "./TKFDFThematicTrafficLightConfiguration";

// ////////////////////////////////////////////////////////////////////////////
// Default property
// ////////////////////////////////////////////////////////////////////////////

function applyDefaultProperty(
  json: TKFDFThematicTrafficLightConfiguration,
  defaultProperties: TKFDFTrafficLightProperties
) {
  // Properties undefined
  if (!json.properties) {
    json.properties = defaultProperties;
  }
}

// ////////////////////////////////////////////////////////////////////////////
// Read TrafficLight Configuration json
// ////////////////////////////////////////////////////////////////////////////

export async function TKFDFReadThematicTrafficLights(
  file: string
): Promise<TKFDFThematicTrafficLightsConfiguration> {
  const json: TKFDFThematicTrafficLightsConfiguration = await fetch(file, {
    cache: "no-store"
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      return {
        trafficLights: {}
      };
    }
  });

  // ////////////////////////////////////////////////////////////////////////////
  // Check errors in the file
  // ////////////////////////////////////////////////////////////////////////////

  if (!json.trafficLights) {
    json.trafficLights = {};
    console.warn("[FDF] The trafficLights field is missing in the json.");
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Default properties
  // ////////////////////////////////////////////////////////////////////////////

  for (const trafficlightname in json.trafficLights) {
    applyDefaultProperty(
      json.trafficLights[trafficlightname],
      DEFAULT_PROPERTIES
    );
  }

  return json;
}
