import { TKCSVSurveyInfo } from "./surveyRawData/csv/TKCSVTypes";
import { TKKoboSurveyInfo } from "./surveyRawData/kobo/TKKoboSurveyInfo";
import { TKCreateSurveyConfiguration } from "./surveyConfiguration/TKCreateSurveyConfiguration";
import { TKGetCSVRawData } from "@/domain/survey/surveyRawData/csv/TKGetCSVRawData";
import { TKGetKoboRawData } from "./surveyRawData/kobo/TKGetKoboRawData";
import { TKSpatialDescription } from "@/domain/core/TKSpatialDescription";
import { TKCreateSurvey } from "./TKCreateSurvey";
import { TKSurveyCollection } from "@/domain/core/TKSurveyCollection";
import { TKLanguageDescription } from "@/domain/core/TKLanguageDescription";
import { TKSurveyFormat } from "@/domain/core/TKSurveyFormat";
import { TKIndicatorsDescription } from "../core/TKIndicatorsDescription";

export async function TKCreateSurveyCollection(
  surveyDescription: TKKoboSurveyInfo[] | TKCSVSurveyInfo[],
  surveyFormat: TKSurveyFormat,
  spatialDescription: TKSpatialDescription,
  indicatorsDescription: TKIndicatorsDescription,
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
      indicatorsDescription,
      languages
    );
  }
  return surveyCollection;
}
