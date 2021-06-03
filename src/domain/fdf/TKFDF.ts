import {
  TKReadFDFThematicsCollection,
  TKTFDFhematicsCollection
} from "./TKFDFThematics";
import {
  TKFDFTrafficLightsCollection,
  TKReadFDFTrafficLightsCollection
} from "./TKFDFTrafficLight";
import {
  TKFDFLabelCollection,
  TKReadFDFLabelCollection
} from "./TKFDFParseMultiLang";
import {
  TKFDFSubmissionsRulesCollection,
  TKReadSubmissionsRulesCollection
} from "./TKFDFSubmissionsRules";

import { TKFDFFiles, TKFDFInfos } from "./TKFDFInfos";
import { TKFDFUrlsCollection, TKReadFDFURLsCollection } from "./TKFDFURLs";

// ////////////////////////////////////////////////////////////////////////////
// Definition of the FDF object
// this is a description of the submission data structure
// It is needed to create an actual survey
// ////////////////////////////////////////////////////////////////////////////
export interface TKFDF {
  thematics: TKTFDFhematicsCollection;
  trafficLights: TKFDFTrafficLightsCollection;
  fieldsLabels: TKFDFLabelCollection;
  answersLabels: TKFDFLabelCollection;
  submissionsRules: TKFDFSubmissionsRulesCollection;
  urls: TKFDFUrlsCollection;
}

// ////////////////////////////////////////////////////////////////////////////
// Method that creates the FDF object from the fdf folder
// ////////////////////////////////////////////////////////////////////////////

export async function TKCreateFDF(infos: TKFDFInfos): Promise<TKFDF> {
  return {
    thematics: await TKReadFDFThematicsCollection(infos),
    trafficLights: await TKReadFDFTrafficLightsCollection(infos),
    fieldsLabels: await TKReadFDFLabelCollection(TKFDFFiles.FIELDS, infos),
    answersLabels: await TKReadFDFLabelCollection(TKFDFFiles.ANSWERS, infos),
    submissionsRules: await TKReadSubmissionsRulesCollection(infos),
    urls: await TKReadFDFURLsCollection(infos)
  };
}
