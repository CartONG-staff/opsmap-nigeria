import { TKFDFTrafficLightsConfiguration } from "./TKFDFTrafficLightConfiguration";
import { TKFDFTrafficLights } from "./TKFDFTrafficLights";
import { defaultProperties } from "./TKFDFTrafficLightsDefaultProperties";

// ////////////////////////////////////////////////////////////////////////////
// Default property
// ////////////////////////////////////////////////////////////////////////////

function applyDefaultProperty(
  json: TKFDFTrafficLightsConfiguration | TKFDFTrafficLights
) {
  // Properties undefined
  if (!json.properties) {
    json.properties = defaultProperties;
  } else {
    // Properties.colormap undefined
    if (!json.properties.colormap) {
      json.properties.colormap = defaultProperties.colormap;
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
    console.warn("[FDF] The trafficLights field is missing in the json field");
    return json;
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Default properties
  // ////////////////////////////////////////////////////////////////////////////

  applyDefaultProperty(json);

  // ////////////////////////////////////////////////////////////////////////////
  // Default traffic light properties
  // ////////////////////////////////////////////////////////////////////////////
  for (const trafficlightname in json.trafficLights) {
    applyDefaultProperty(json.trafficLights[trafficlightname]);
  }
  console.log({ trafficLight: json });
  return json;
}
