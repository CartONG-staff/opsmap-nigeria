// ////////////////////////////////////////////////////////////////////////////
// Definition of the FDF object
// this is a description of the submission data structure
// It is needed to create an actual survey

import { TKFDF } from "@/domain/fdf/TKFDF";
import {
  TKSurveyInfos,
  TKSurveyInfosType
} from "@/domain/opsmapConfig/TKSurveyInfos";
import { TKFDFFiles } from "@/secondary/fdf/TKFDFFiles";
import { TKReadFDFLabelCollection } from "@/secondary/fdf/TKFDFParseMultiLang";
import { TKReadSubmissionsRulesCollection } from "@/secondary/fdf/TKFDFSubmissionsRules";
import { TKReadFDFTerminologyCollection } from "@/secondary/fdf/TKFDFTerminology";
import { TKReadFDFThematicsCollection } from "@/secondary/fdf/TKFDFThematics";
import { TKFDFReadTrafficLights } from "@/domain/fdf/TKFDFTrafficLights/TKFDFReadTrafficLights";
import { TKFDFReadGraphs } from "@/domain/fdf/TKFDFGraphs/TKFDFReadGraphs";
import { TKReadFDFURLsCollection } from "@/secondary/fdf/TKFDFURLs";
import { TKReadFDFSiteTypesCollection } from "./TKFDFSiteTypes";
import { TKGetRidlTranslationsData } from "@/secondary/ridl/TKGetRidlRawData";

// ////////////////////////////////////////////////////////////////////////////
// Method that creates the FDF object from the fdf folder
// ////////////////////////////////////////////////////////////////////////////
export async function TKReadFDF(infos: TKSurveyInfos): Promise<TKFDF> {
  let answersLabels = {};
  switch (infos.type) {
    case TKSurveyInfosType.GSHEET:
      answersLabels = await TKReadFDFLabelCollection(infos.submissionsTrUrl);
      break;
    case TKSurveyInfosType.CSV:
      answersLabels = await TKReadFDFLabelCollection(
        `${infos.submissionsTrLocalUrl}`
      );
      break;

    case TKSurveyInfosType.RIDL:
      answersLabels = await TKGetRidlTranslationsData(infos.submissionsTrUrl);
      break;
    case TKSurveyInfosType.KOBO:
      answersLabels = await TKReadFDFLabelCollection(
        `${process.env.VUE_APP_GENERAL_CONFIG_DIRECTORY}${infos.fdf.folder}/${TKFDFFiles.ANSWERS}.csv`
      );
      break;
  }

  return {
    name: infos.name,
    terminology: await TKReadFDFTerminologyCollection(infos.fdf),
    thematics: await TKReadFDFThematicsCollection(infos.fdf),
    trafficLights: await TKFDFReadTrafficLights(
      `${process.env.VUE_APP_GENERAL_CONFIG_DIRECTORY}${infos.fdf.folder}/${TKFDFFiles.TRAFFIC_LIGHTS}.json`
    ),
    graphs: await await TKFDFReadGraphs(
      `${process.env.VUE_APP_GENERAL_CONFIG_DIRECTORY}${infos.fdf.folder}/${TKFDFFiles.GRAPHS}.json`
    ),
    fieldsLabels: await TKReadFDFLabelCollection(
      `${process.env.VUE_APP_GENERAL_CONFIG_DIRECTORY}${infos.fdf.folder}/${TKFDFFiles.FIELDS}.csv`
    ),
    answersLabels: answersLabels,
    submissionsRules: await TKReadSubmissionsRulesCollection(infos.fdf),
    urls: await TKReadFDFURLsCollection(infos.fdf),
    indicators: infos.indicators,
    spatial: infos.spatial,
    siteTypes: await TKReadFDFSiteTypesCollection(infos.fdf)
  };
}
