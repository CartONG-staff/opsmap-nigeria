import { TKCSVSurveyInfo } from "./surveyraws/csv/TKCSVTypes";
import { TKKoboSurveyInfo } from "./surveyraws/kobo/TKKoboSurveyInfo";
import { TKCreateSurveyConfiguration } from "./surveyconfiguration/TKCreateSurveyConfiguration";
import { TKGetCSVRawData } from "@/domain/survey/surveyraws/csv/TKGetCSVRawData";
import { TKGetKoboRawData } from "./surveyraws/kobo/TKGetKoboRawData";
import { TKSpatialDescription } from "@/domain/core/TKSpatialDescription";
import { TKCreateSurvey } from "./TKCreateSurvey";
import { TKSurveyCollection } from "@/domain/core/TKSurveyCollection";
import { TKLanguageDescription } from "@/domain/core/TKLanguageDescription";
import { TKSurveyFormat } from "@/domain/core/TKSurveyFormat";

export async function TKCreateSurveyCollection(
  surveyDescription: TKKoboSurveyInfo[] | TKCSVSurveyInfo[],
  surveyFormat: TKSurveyFormat,
  spatialDescription: TKSpatialDescription,
  languages: TKLanguageDescription[]
): Promise<TKSurveyCollection> {
  // prepare output
  const surveyCollection: TKSurveyCollection = {};

  // foreach survey info
  for (const info of surveyDescription) {
    // Retrieve raw data
    let rawData;
    if (surveyFormat === TKSurveyFormat.CSV) {
      rawData = await TKGetCSVRawData(info as TKCSVSurveyInfo);
    } else if (surveyFormat === TKSurveyFormat.KOBO) {
      rawData = await TKGetKoboRawData(info as TKKoboSurveyInfo);
    }

    // Retrieve config
    const surveyConfig = await TKCreateSurveyConfiguration(info);

    // Create survey
    surveyCollection[info.name] = TKCreateSurvey(
      rawData,
      surveyConfig,
      spatialDescription,
      languages
    );
  }
  return surveyCollection;
}
