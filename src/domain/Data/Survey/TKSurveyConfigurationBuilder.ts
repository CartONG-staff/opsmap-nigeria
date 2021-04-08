import { TKCSVRead } from "../CSV/TKCSVReader";
import { TKCSVSurveyInfo } from "../CSV/TKCSVTypes";
import { TKKoboSurveyInfo } from "../Kobo/TKKoboSurveyInfo";
import {
  TKCategory,
  TKCategoriesCollection,
  TKCategoriesCollectionBuild,
} from "./TKCategoriesCollectionBuilder";
import {
  TKTrafficLightItem,
  TKTrafficLightsCollection,
  TKTrafficLightsCollectionBuild,
} from "./TKTrafficLightsCollectionBuilder";
import {
  TKFieldLabel,
  TKAnswerLabel,
  TKLabelsCollection,
  TKLabelsCollectionBuild,
} from "./TKLabelsCollectionBuilder";

import {
  TKSubmissionRule,
  TKSubmissionsRulesCollection,
  TKSubmissionsRulesCollectionBuild,
} from "./TKSubmissionsRulesBuilder";

interface SurveyConfiguration {
  categories: TKCategoriesCollection;
  trafficLights: TKTrafficLightsCollection;
  fieldsLabels: TKLabelsCollection;
  answersLabels: TKLabelsCollection;
  submissionsRules: TKSubmissionsRulesCollection;
}

export async function TKSurveyConfigurationBuild(
  survey: TKKoboSurveyInfo | TKCSVSurveyInfo
): Promise<SurveyConfiguration> {
  const rawCategories: TKCategory[] = await TKCSVRead<TKCategory[]>(
    "thematic_config",
    survey.folder,
    true
  );

  const rawTrafficLights: TKTrafficLightItem[] = await TKCSVRead<
    TKTrafficLightItem[]
  >("traffic_light_config", survey.folder, true);

  const rawFieldsLabels: TKFieldLabel[] = await TKCSVRead<TKFieldLabel[]>(
    "field_labels",
    survey.folder,
    true
  );

  const rawAnswerLabels: TKAnswerLabel[] = await TKCSVRead<TKAnswerLabel[]>(
    "answer_labels",
    survey.folder,
    true
  );

  const rawSubmissionsRules: TKSubmissionRule[] = await TKCSVRead<
    TKSubmissionRule[]
  >("submissions_rules", survey.folder, true);

  return {
    categories: TKCategoriesCollectionBuild(rawCategories),
    trafficLights: TKTrafficLightsCollectionBuild(rawTrafficLights),
    fieldsLabels: TKLabelsCollectionBuild(rawFieldsLabels),
    answersLabels: TKLabelsCollectionBuild(rawAnswerLabels),
    submissionsRules: TKSubmissionsRulesCollectionBuild(rawSubmissionsRules),
  };
}
