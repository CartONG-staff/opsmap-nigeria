import { TKSurveyConfiguration } from "@/domain/core/TKSurveyConfiguration";
import { TKTrafficLightItem } from "@/domain/core/TKTrafficLight";
import { TKCSVRead } from "@/domain/csv/TKCSVReader";
import { TKCSVSurveyInfo } from "@/domain/csv/TKCSVTypes";
import { TKKoboSurveyInfo } from "@/domain/kobo/TKKoboSurveyInfo";
import {
  TKThematic,
  TKThematicsCollectionBuild
} from "./TKThematicsCollectionBuilder";
import { TKTrafficLightsCollectionBuild } from "./TKTrafficLightsCollectionBuilder";
import {
  TKLabelsCollectionBuild,

} from "./TKLabelsCollectionBuilder";

import {
  TKSubmissionRule,
  TKSubmissionsRulesCollectionBuild
} from "./TKSubmissionsRulesBuilder";

import { TKReadFDFAnswerLabelCollection }  from "@/domain/fdf/TKFDFAnswerLabel";
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

  const labels = await TKReadFDFAnswerLabelCollection(survey);

  const rawSubmissionsRules: TKSubmissionRule[] = await TKCSVRead<
    TKSubmissionRule[]
  >("submissions_rules", survey.fdfFolder, true);

  return {
    thematics: TKThematicsCollectionBuild(rawThematics),
    trafficLights: TKTrafficLightsCollectionBuild(rawTrafficLights),
    fieldsLabels: TKLabelsCollectionBuild(rawFieldsLabels),
    answersLabels: labels,
    submissionsRules: TKSubmissionsRulesCollectionBuild(rawSubmissionsRules)
  };
}
