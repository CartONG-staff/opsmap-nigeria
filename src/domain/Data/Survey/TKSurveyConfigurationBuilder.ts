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
  TKFieldLabel,
  TKAnswerLabel,
  TKLabelsCollection,
  TKLabelsCollectionBuilder,
} from "./TKLabelsCollectionBuilder";

import {
  TKSubmissionRule,
  TKSubmissionsRulesCollection,
  TKSubmissionsRulesCollectionBuilder,
} from "./TKSubmissionsRulesBuilder";

interface SurveyConfiguration {
  categories: TKCategoriesCollection;
  trafficLights: TKTrafficLightsCollection;
  fieldsLabels: TKLabelsCollection;
  answersLabels: TKLabelsCollection;
  submissionsRules: TKSubmissionsRulesCollection;
}

export async function TKSurveyConfigurationBuilder(
  survey: TKKoboSurveyInfo | TKCSVSurveyInfo
): Promise<SurveyConfiguration> {
  const rawCategories: TKCategory[] = await TKCSVReader<TKCategory[]>(
    "categories",
    survey.folder,
    true
  );

  const rawTrafficLights: TKTrafficLightsRaw[] = await TKCSVReader<
    TKTrafficLightsRaw[]
  >("traffic_lights", survey.folder, true);

  const rawFieldsLabels: TKFieldLabel[] = await TKCSVReader<TKFieldLabel[]>(
    "field_labels",
    survey.folder,
    true
  );

  const rawAnswerLabels: TKAnswerLabel[] = await TKCSVReader<TKAnswerLabel[]>(
    "answer_labels",
    survey.folder,
    true
  );

  const rawSubmissionsRules: TKSubmissionRule[] = await TKCSVReader<
    TKSubmissionRule[]
  >("submissions_rules", survey.folder, true);

  return {
    categories: TKCategoriesCollectionBuilder(rawCategories),
    trafficLights: TKTrafficLightsCollectionBuilder(rawTrafficLights),
    fieldsLabels: TKLabelsCollectionBuilder(rawFieldsLabels),
    answersLabels: TKLabelsCollectionBuilder(rawAnswerLabels),
    submissionsRules: TKSubmissionsRulesCollectionBuilder(rawSubmissionsRules),
  };
}
