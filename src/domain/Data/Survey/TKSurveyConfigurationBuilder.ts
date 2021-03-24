import { TKCSVReader } from "../CSV/TKCSVReader";
import { TKCSVSurveyInfo } from "../CSV/TKCSVTypes";
import { TKKoboSurveyInfo } from "../Kobo/TKKoboSurveyInfo";
import {
  TKTrafficLightsCollectionBuilder,
  TKTrafficLightsRaw,
  TKTrafficLightsCollection,
} from "./TKTrafficLightsCollectionBuilder";

interface SurveyConfiguration {
  trafficLights: TKTrafficLightsCollection;
}

export async function TKSurveyConfigurationBuilder(
  survey: TKKoboSurveyInfo | TKCSVSurveyInfo
): SurveyConfiguration {
  const rawTrafficLights: TKTrafficLightsRaw[] = await TKCSVReader(
    "traffic_lights",
    survey.folder,
    true
  );
  return {
    trafficLights: TKTrafficLightsCollectionBuilder(rawTrafficLights),
  };
}
