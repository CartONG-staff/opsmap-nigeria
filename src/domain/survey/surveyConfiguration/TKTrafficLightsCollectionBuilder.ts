import {
  TKTrafficLightColors,
  TKTrafficLightGrouped,
  TrafficLightTypes,
  TKTrafficLightItem
} from "@/domain/core/TKTrafficLight";

export interface TKTrafficLightsCollection {
  [propName: string]: TKTrafficLightGrouped;
}

export function TKTrafficLightsCollectionBuild(
  rawData: TKTrafficLightItem[]
): TKTrafficLightsCollection {
  const trafficLights: TKTrafficLightsCollection = {};
  for (const item of rawData) {
    if (trafficLights[item.traffic_light_name]) {
      trafficLights[item.traffic_light_name].values.push({
        value: item.value,
        color: item.color
      });
    } else {
      trafficLights[item.traffic_light_name] = {
        type: item.type,
        values: [
          {
            value: item.value,
            color: item.color
          }
        ]
      };
    }
  }
  return trafficLights;
}
