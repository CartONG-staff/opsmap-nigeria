import { TKSurveyConfiguration } from "@/domain/core/TKSurveyConfiguration";

import { TKCSVRead } from "../surveyraw/csv/TKCSVReader";
import { TKCSVSurveyInfo } from "../surveyraw/csv/TKCSVTypes";
import { TKKoboSurveyInfo } from "../surveyraw/kobo/TKKoboSurveyInfo";
import {
  TKThematic,
  TKThematicsCollectionBuild
} from "./TKThematicsCollectionBuilder";
import {
  TKTrafficLightItem,
  TKTrafficLightsCollectionBuild
} from "./TKTrafficLightsCollectionBuilder";
import {
  TKFieldLabel,
  TKAnswerLabel,
  TKFieldLabelsCollectionBuild,
  TKAnswerLabelsCollectionBuild
} from "./TKLabelsCollectionBuilder";

import {
  TKSubmissionRule,
  TKSubmissionsRulesCollectionBuild
} from "./TKSubmissionsRulesBuilder";

export async function TKCreateSurveyConfiguration(
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
    submissionsRules: TKSubmissionsRulesCollectionBuild(rawSubmissionsRules)
  };
}
