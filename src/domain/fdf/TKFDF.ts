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
  TKReadFDFLabelCollection,
  TKReadFDFLabelCollectionFromGSheet
} from "./TKFDFParseMultiLang";
import {
  TKFDFSubmissionsRulesCollection,
  TKReadSubmissionsRulesCollection
} from "./TKFDFSubmissionsRules";

import { TKFDFFiles } from "./TKFDFInfos";
import { TKFDFUrlsCollection, TKReadFDFURLsCollection } from "./TKFDFURLs";
import { TKSurveyInfos } from "../opsmapConfig/TKSurveyInfos";
import { TKSurveyInfosGSheet } from "../gsheet/TKSurveyInfosGSheet";
import {
  TKFDFTerminologyCollection,
  TKReadFDFTerminologyCollection
} from "./TKFDFTerminology";

// ////////////////////////////////////////////////////////////////////////////
// Definition of the FDF object
// this is a description of the submission data structure
// It is needed to create an actual survey
// ////////////////////////////////////////////////////////////////////////////
export interface TKFDF {
  terminology: TKFDFTerminologyCollection;
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
export async function TKCreateFDF(infos: TKSurveyInfos): Promise<TKFDF> {
  let answersLabels = {};
  if (infos instanceof TKSurveyInfosGSheet) {
    answersLabels = await TKReadFDFLabelCollectionFromGSheet(
      infos.submissionsTrUrl
    );
  } else {
    answersLabels = await TKReadFDFLabelCollection(
      TKFDFFiles.ANSWERS,
      infos.fdf
    );
  }

  return {
    terminology: await TKReadFDFTerminologyCollection(infos.fdf),
    thematics: await TKReadFDFThematicsCollection(infos.fdf),
    trafficLights: await TKReadFDFTrafficLightsCollection(infos.fdf),
    fieldsLabels: await TKReadFDFLabelCollection(TKFDFFiles.FIELDS, infos.fdf),
    answersLabels: answersLabels,
    submissionsRules: await TKReadSubmissionsRulesCollection(infos.fdf),
    urls: await TKReadFDFURLsCollection(infos.fdf)
  };
}
