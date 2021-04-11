import { TKCSVRead } from "../../csv/TKCSVReader";
import { TKCSVSurveyInfo } from "../../csv/TKCSVTypes";
import { TKKoboSurveyInfo } from "../../kobo/TKKoboSurveyInfo";
import {
  TKThematic,
  TKThematicsCollection,
  TKThematicsCollectionBuild,
} from "./TKThematicsCollectionBuilder";
import {
  TKTrafficLightItem,
  TKTrafficLightsCollection,
  TKTrafficLightsCollectionBuild,
} from "./TKTrafficLightsCollectionBuilder";
import {
  TKFieldLabel,
  TKAnswerLabel,
  TKFieldLabelsCollection,
  TKAnswerLabelsCollection,
  TKFieldLabelsCollectionBuild,
  TKAnswerLabelsCollectionBuild,
} from "./TKLabelsCollectionBuilder";

import {
  TKSubmissionRule,
  TKSubmissionsRulesCollection,
  TKSubmissionsRulesCollectionBuild,
} from "./TKSubmissionsRulesBuilder";

export interface TKSurveyConfiguration {
  thematics: TKThematicsCollection;
  trafficLights: TKTrafficLightsCollection;
  fieldsLabels: TKFieldLabelsCollection;
  answersLabels: TKAnswerLabelsCollection;
  submissionsRules: TKSubmissionsRulesCollection;
}

export async function TKSurveyConfigurationBuild(
  survey: TKKoboSurveyInfo | TKCSVSurveyInfo
): Promise<TKSurveyConfiguration> {
  const rawThematics: TKThematic[] = await TKCSVRead<TKThematic[]>(
    "thematic_config",
    survey.folder,
    true
  );

  const rawTrafficLights: TKTrafficLightItem[] = await TKCSVRead<
    TKTrafficLightItem[]
  >("traffic_light_config", survey.folder, true);

  const rawFieldsLabels: TKFieldLabel[] = await TKCSVRead(
    "field_labels",
    survey.folder,
    true
  );

  const rawAnswerLabels: TKAnswerLabel[] = await TKCSVRead(
    "answer_labels",
    survey.folder,
    true
  );

  const rawSubmissionsRules: TKSubmissionRule[] = await TKCSVRead<
    TKSubmissionRule[]
  >("submissions_rules", survey.folder, true);

  return {
    thematics: TKThematicsCollectionBuild(rawThematics),
    trafficLights: TKTrafficLightsCollectionBuild(rawTrafficLights),
    fieldsLabels: TKFieldLabelsCollectionBuild(rawFieldsLabels),
    answersLabels: TKAnswerLabelsCollectionBuild(rawAnswerLabels),
    submissionsRules: TKSubmissionsRulesCollectionBuild(rawSubmissionsRules),
  };
}
