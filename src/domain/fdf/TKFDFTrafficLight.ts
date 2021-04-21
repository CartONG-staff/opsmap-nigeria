import { TKFDFInfos } from "@/domain/fdf/TKFDF";
import { TKTrafficLightValues } from "@/domain/core/TKTrafficLightValues";
import { TKCSVRead } from "../csv/TKCSVReader";

export enum TKFDFTrafficLightTypes {
  STRING = "string",
  MATH = "math",
  LIST = "list"
}

interface TKFDFTrafficLightItem {
  traffic_light_name: string;
  type: TKFDFTrafficLightTypes;
  value: string;
  color: TKTrafficLightValues;
}

export interface TKFDFTrafficLightGrouped {
  type: TKFDFTrafficLightTypes;
  values: [
    {
      value: string;
      color: TKTrafficLightValues;
    }
  ];
}

export interface TKFDFTrafficLightsCollection {
  [propName: string]: TKFDFTrafficLightGrouped;
}

export async function TKReadFDFTrafficLightsCollection(infos: TKFDFInfos) : Promise<TKFDFTrafficLightsCollection> {

  const rawTrafficLights: TKFDFTrafficLightItem[] = await TKCSVRead<
    TKFDFTrafficLightItem[]
  >("traffic_light_config", infos.folder, true);

  const trafficLights: TKFDFTrafficLightsCollection = {};
  for (const item of rawTrafficLights) {
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