import {
  TKReadFDFThematicsCollection,
  TKTFDFhematicsCollection
} from "./TKFDFThematics";
import {
  TKFDFTrafficLightsCollection,
  TKReadFDFTrafficLightsCollection
} from "./TKFDFTrafficLight";
import {
  TKFDFAnswerLabelCollection,
  TKReadFDFAnswerLabelCollection
} from "./TKFDFAnswerLabel";
import {
  TKFDFSubmissionsRulesCollection,
  TKReadSubmissionsRulesCollection
} from "./TKFDFSubmissionsRules";
import {
  TKFDFLabelCollection,
  TKReadFDFLabelsCollection
} from "./TKFDFFieldLabel";

import { TKFDFInfos } from "./TKFDFInfos";

// ////////////////////////////////////////////////////////////////////////////
// Definition of the FDF object
// this is a description of the submission data structure
// It is needed to create an actual survey
// ////////////////////////////////////////////////////////////////////////////
export interface TKFDF {
  thematics: TKTFDFhematicsCollection;
  trafficLights: TKFDFTrafficLightsCollection;
  fieldsLabels: TKFDFLabelCollection;
  answersLabels: TKFDFAnswerLabelCollection;
  submissionsRules: TKFDFSubmissionsRulesCollection;
}

// ////////////////////////////////////////////////////////////////////////////
// Method that creates the FDF object from the fdf folder
// ////////////////////////////////////////////////////////////////////////////

export async function TKCreateFDF(infos: TKFDFInfos): Promise<TKFDF> {
  return {
    thematics: await TKReadFDFThematicsCollection(infos),
    trafficLights: await TKReadFDFTrafficLightsCollection(infos),
    fieldsLabels: await TKReadFDFLabelsCollection(infos),
    answersLabels: await TKReadFDFAnswerLabelCollection(infos),
    submissionsRules: await TKReadSubmissionsRulesCollection(infos)
  };
}
