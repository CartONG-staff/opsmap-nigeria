import { TKCSVRead } from "@/domain/csv/TKCSVReader";
import { TKCSVSurveyInfo } from "@/domain/csv/TKCSVTypes";
import { TKKoboSurveyInfo } from "@/domain/kobo/TKKoboSurveyInfo";
import { TKTrafficLightValues } from "@/domain/core/TKTrafficLightValues";
export enum TrafficLightTypes {
  STRING = "string",
  MATH = "math",
  LIST = "list"
}

export interface TKTrafficLightItem {
  traffic_light_name: string;
  type: TrafficLightTypes;
  value: string;
  color: TKTrafficLightValues;
}

export interface TKTrafficLightGrouped {
  type: TrafficLightTypes;
  values: [
    {
      value: string;
      color: TKTrafficLightValues;
    }
  ];
}

export interface TKTrafficLightsCollection {
  [propName: string]: TKTrafficLightGrouped;
}

export async function TKReadFDFTrafficLightsCollection(survey: TKKoboSurveyInfo | TKCSVSurveyInfo): Promise<TKTrafficLightsCollection> {

  const rawTrafficLights: TKTrafficLightItem[] = await TKCSVRead<
    TKTrafficLightItem[]
  >("traffic_light_config", survey.fdfFolder, true);

  const trafficLights: TKTrafficLightsCollection = {};
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