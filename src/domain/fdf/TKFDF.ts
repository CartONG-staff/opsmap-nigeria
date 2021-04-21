import { TKThematicsCollection } from "@/domain/fdf/TKThematicsCollectionBuilder";
import { TKTrafficLightsCollection } from "@/domain/fdf/TKTrafficLightsCollectionBuilder";
import { TKFDFAnswerLabelCollection } from "@/domain/fdf/TKFDFAnswerLabel";
import { TKSubmissionsRulesCollection } from "@/domain/fdf/TKSubmissionsRulesBuilder";
import { TKLabelsCollection } from "@/domain/fdf/TKLabelsCollectionBuilder";

export interface TKFDF {
  thematics: TKThematicsCollection;
  trafficLights: TKTrafficLightsCollection;
  fieldsLabels: TKLabelsCollection;
  answersLabels: TKFDFAnswerLabelCollection;
  submissionsRules: TKSubmissionsRulesCollection;
}

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
): Promise<TKFDF> {
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
