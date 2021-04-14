import { TKTrafficLightColors } from "@/domain/core/TKTrafficLightColors";

export type TrafficLightTypes = "string" | "math" | "list";

export interface TKTrafficLightItem {
  traffic_light_name: string;
  type: TrafficLightTypes;
  value: string;
  color: TKTrafficLightColors;
}
export interface TKTrafficLightGrouped {
  type: TrafficLightTypes;
  values: [
    {
      value: string;
      color: TKTrafficLightColors;
    }
  ];
}
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
