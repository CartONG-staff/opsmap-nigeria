import { TKFDFTrafficLightsConfiguration } from "@/domain/fdf/TKFDFTrafficLights/TKFDFTrafficLightsConfiguration";
import { TKFDFTrafficLightConfiguration } from "@/domain/fdf/TKFDFTrafficLights/TKFDFTrafficLightConfiguration";
import { DEFAULT_PROPERTIES } from "@/domain/fdf/TKFDFTrafficLights/TKFDFTrafficLightsDefaultProperties";
import { TKFDFTrafficLightProperties } from "@/domain/fdf/TKFDFTrafficLights/TKFDFTrafficLightProperties";

// ////////////////////////////////////////////////////////////////////////////
// Default property
// ////////////////////////////////////////////////////////////////////////////

function applyDefaultProperty(
  json: TKFDFTrafficLightsConfiguration | TKFDFTrafficLightConfiguration,
  defaultProperties: TKFDFTrafficLightProperties
) {
  // Properties undefined
  if (!json.properties) {
    json.properties = defaultProperties;
  } else {
    // Properties.colormap undefined
    if (!json.properties.colormap) {
      json.properties.colormap = defaultProperties.colormap;
    }
    if (!json.properties.colorerror) {
      json.properties.colorerror = defaultProperties.colorerror;
    }
  }
}

// ////////////////////////////////////////////////////////////////////////////
// Read TrafficLight Configuration json
// ////////////////////////////////////////////////////////////////////////////

export async function TKFDFReadTrafficLights(
  file: string
): Promise<TKFDFTrafficLightsConfiguration> {
  const json: TKFDFTrafficLightsConfiguration = await fetch(file, {
    cache: "no-store"
  }).then(response => response.json());

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

  applyDefaultProperty(json, DEFAULT_PROPERTIES);

  // ////////////////////////////////////////////////////////////////////////////
  // Default traffic light properties
  // ////////////////////////////////////////////////////////////////////////////
  for (const trafficlightname in json.trafficLights) {
    applyDefaultProperty(
      json.trafficLights[trafficlightname],
      json.properties ?? DEFAULT_PROPERTIES
    );
  }
  return json;
}
