import { TKCSVReader } from "../CSV/TKCSVReader";
import { TKCSVSurveyInfo } from "../CSV/TKCSVTypes";
import { TKKoboSurveyInfo } from "../Kobo/TKKoboSurveyInfo";
import {
  TKCategory,
  TKCategoriesCollection,
  TKCategoriesCollectionBuilder,
} from "./TKCategoriesCollectionBuilder";
import {
  TKTrafficLightsRaw,
  TKTrafficLightsCollection,
  TKTrafficLightsCollectionBuilder,
} from "./TKTrafficLightsCollectionBuilder";
import {
  TKLabel,
  TKLabelsCollection,
  TKLabelsCollectionBuilder,
} from "./TKLabelsCollectionBuilder";

interface SurveyConfiguration {
  categories: TKCategoriesCollection;
  trafficLights: TKTrafficLightsCollection;
  labels: TKLabelsCollection;
}

export async function TKSurveyConfigurationBuilder(
  survey: TKKoboSurveyInfo | TKCSVSurveyInfo
): SurveyConfiguration {
  const rawCategories: TKCategory[] = await TKCSVReader(
    "categories",
    survey.folder,
    true
  );
  const rawTrafficLights: TKTrafficLightsRaw[] = await TKCSVReader(
    "traffic_lights",
    survey.folder,
    true
  );
  const rawLabels: TKLabel[] = await TKCSVReader("labels", survey.folder, true);
  return {
    categories: TKCategoriesCollectionBuilder(rawCategories),
    trafficLights: TKTrafficLightsCollectionBuilder(rawTrafficLights),
    labels: TKLabelsCollectionBuilder(rawLabels),
  };
}
