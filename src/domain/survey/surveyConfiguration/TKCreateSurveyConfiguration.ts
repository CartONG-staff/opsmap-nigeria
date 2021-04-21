import { TKSurveyConfiguration } from "@/domain/core/TKSurveyConfiguration";
import { TKTrafficLightItem } from "@/domain/core/TKTrafficLight";
import { TKCSVRead } from "../surveyRawData/csv/TKCSVReader";
import { TKCSVSurveyInfo } from "../surveyRawData/csv/TKCSVTypes";
import { TKKoboSurveyInfo } from "../surveyRawData/kobo/TKKoboSurveyInfo";
import {
  TKThematic,
  TKThematicsCollectionBuild
} from "./TKThematicsCollectionBuilder";
import { TKTrafficLightsCollectionBuild } from "./TKTrafficLightsCollectionBuilder";
import {
  TKLabelsCollectionBuild,
  TKAnswerLabelsCollectionBuild
} from "./TKLabelsCollectionBuilder";

import {
  TKSubmissionRule,
  TKSubmissionsRulesCollectionBuild
} from "./TKSubmissionsRulesBuilder";

import { TKAnswerLabelCSV }  from "@/domain/survey/surveyConfiguration/TKAnswerLabelCSV";
import { TKFieldLabelCSV } from "./TKFieldLabelCSV";

export async function TKCreateSurveyConfiguration(
  survey: TKKoboSurveyInfo | TKCSVSurveyInfo
): Promise<TKSurveyConfiguration> {
  const rawThematics: TKThematic[] = await TKCSVRead<TKThematic[]>(
    "thematic_config",
    survey.fdfFolder,
    true
  );

  const rawTrafficLights: TKTrafficLightItem[] = await TKCSVRead<
    TKTrafficLightItem[]
  >("traffic_light_config", survey.fdfFolder, true);

  const rawFieldsLabels: TKFieldLabelCSV[] = await TKCSVRead(
    "field_labels",
    survey.fdfFolder,
    true
  );

  const rawAnswerLabels: TKAnswerLabelCSV[] = await TKCSVRead(
    "answer_labels",
    survey.fdfFolder,
    true
  );

  const rawSubmissionsRules: TKSubmissionRule[] = await TKCSVRead<
    TKSubmissionRule[]
  >("submissions_rules", survey.fdfFolder, true);

  return {
    thematics: TKThematicsCollectionBuild(rawThematics),
    trafficLights: TKTrafficLightsCollectionBuild(rawTrafficLights),
    fieldsLabels: TKLabelsCollectionBuild(rawFieldsLabels),
    answersLabels: TKAnswerLabelsCollectionBuild(rawAnswerLabels),
    submissionsRules: TKSubmissionsRulesCollectionBuild(rawSubmissionsRules)
  };
}
