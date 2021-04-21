import { TKThematicsCollection } from "@/domain/fdf/TKThematicsCollectionBuilder";
import { TKTrafficLightsCollection } from "@/domain/fdf/TKFDFTrafficLight";
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

import { TKReadFDFTrafficLightsCollection } from "@/domain/fdf/TKFDFTrafficLight";
import { TKCSVRead } from "@/domain/csv/TKCSVReader";
import { TKCSVSurveyInfo } from "@/domain/csv/TKCSVTypes";
import { TKKoboSurveyInfo } from "@/domain/kobo/TKKoboSurveyInfo";
import {
  TKThematic,
  TKThematicsCollectionBuild
} from "./TKThematicsCollectionBuilder";
import { TKLabelsCollectionBuild } from "./TKLabelsCollectionBuilder";

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

  const trafficLights = await TKReadFDFTrafficLightsCollection(survey);

  const rawFieldsLabels: TKFieldLabelCSV[] = await TKCSVRead(
    "field_labels",
    survey.fdfFolder,
    true
  );

  const answerLabels = await TKReadFDFAnswerLabelCollection(survey);

  const rawSubmissionsRules: TKSubmissionRule[] = await TKCSVRead<
    TKSubmissionRule[]
  >("submissions_rules", survey.fdfFolder, true);

  return {
    thematics: TKThematicsCollectionBuild(rawThematics),
    trafficLights: trafficLights,
    fieldsLabels: TKLabelsCollectionBuild(rawFieldsLabels),
    answersLabels: answerLabels,
    submissionsRules: TKSubmissionsRulesCollectionBuild(rawSubmissionsRules)
  };
}
