import { TKThematicsCollection } from "@/domain/fdf/TKThematicsCollectionBuilder";
import { TKTrafficLightsCollection } from "@/domain/fdf/TKFDFTrafficLight";
import { TKFDFAnswerLabelCollection } from "@/domain/fdf/TKFDFAnswerLabel";
import { TKSubmissionsRulesCollection } from "@/domain/fdf/TKSubmissionsRulesBuilder";
import { TKLabelsCollection } from "@/domain/fdf/TKLabelsCollectionBuilder";
import { TKReadFDFTrafficLightsCollection } from "@/domain/fdf/TKFDFTrafficLight";
import { TKCSVRead } from "@/domain/csv/TKCSVReader";
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


export interface TKFDF {
  thematics: TKThematicsCollection;
  trafficLights: TKTrafficLightsCollection;
  fieldsLabels: TKLabelsCollection;
  answersLabels: TKFDFAnswerLabelCollection;
  submissionsRules: TKSubmissionsRulesCollection;
}

export interface TKFDFInfos {
  folder: string;
}

export async function TKCreateFDF(
  infos: TKFDFInfos
): Promise<TKFDF> {
  const rawThematics: TKThematic[] = await TKCSVRead<TKThematic[]>(
    "thematic_config",
    infos.folder,
    true
  );

  const trafficLights = await TKReadFDFTrafficLightsCollection(infos);

  const rawFieldsLabels: TKFieldLabelCSV[] = await TKCSVRead(
    "field_labels",
    infos.folder,
    true
  );

  const answerLabels = await TKReadFDFAnswerLabelCollection(infos);

  const rawSubmissionsRules: TKSubmissionRule[] = await TKCSVRead<
    TKSubmissionRule[]
  >("submissions_rules", infos.folder, true);

  return {
    thematics: TKThematicsCollectionBuild(rawThematics),
    trafficLights: trafficLights,
    fieldsLabels: TKLabelsCollectionBuild(rawFieldsLabels),
    answersLabels: answerLabels,
    submissionsRules: TKSubmissionsRulesCollectionBuild(rawSubmissionsRules)
  };
}
