import { TKReadFDFThematicsCollection, TKTFDFhematicsCollection } from "@/domain/fdf/TKFDFThematics";
import { TKFDFTrafficLightsCollection, TKReadFDFTrafficLightsCollection } from "@/domain/fdf/TKFDFTrafficLight";
import { TKFDFAnswerLabelCollection, TKReadFDFAnswerLabelCollection } from "@/domain/fdf/TKFDFAnswerLabel";
import { TKFDFSubmissionsRulesCollection, TKReadSubmissionsRulesCollection } from "@/domain/fdf/TKFDFSubmissionsRules";
import { TKFDFFieldLabelCollection, TKReadFDFLabelsCollection } from "./TKFDFFieldLabel";


export interface TKFDF {
  thematics: TKTFDFhematicsCollection;
  trafficLights: TKFDFTrafficLightsCollection;
  fieldsLabels: TKFDFFieldLabelCollection;
  answersLabels: TKFDFAnswerLabelCollection;
  submissionsRules: TKFDFSubmissionsRulesCollection;
}

export interface TKFDFInfos {
  folder: string;
}

export async function TKCreateFDF(
  infos: TKFDFInfos
): Promise<TKFDF> {

  const thematics = TKReadFDFThematicsCollection(infos);
  const trafficLights = TKReadFDFTrafficLightsCollection(infos);
  const fieldsLabels = TKReadFDFLabelsCollection(infos);
  const answerLabels = TKReadFDFAnswerLabelCollection(infos);
  const submissionsRules = TKReadSubmissionsRulesCollection(infos);

  return {
    thematics: await thematics,
    trafficLights: await trafficLights,
    fieldsLabels: await fieldsLabels,
    answersLabels: await answerLabels,
    submissionsRules: await submissionsRules
  };
}
