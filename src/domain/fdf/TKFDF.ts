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
  return {
    thematics: await TKReadFDFThematicsCollection(infos),
    trafficLights: await TKReadFDFTrafficLightsCollection(infos),
    fieldsLabels: await  TKReadFDFLabelsCollection(infos),
    answersLabels: await TKReadFDFAnswerLabelCollection(infos),
    submissionsRules: await  TKReadSubmissionsRulesCollection(infos)
  };
}
