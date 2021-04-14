import { TKCSVSurveyInfo } from "./csv/TKCSVTypes";
import { TKKoboSurveyInfo } from "./kobo/TKKoboSurveyInfo";
import { TKCreateSurveyConfiguration } from "./surveyconfiguration/TKCreateSurveyConfiguration";
import { TKGetCSVRawData } from "@/domain/survey/csv/TKGetCSVRawData";
import { TKGetKoboRawData } from "./kobo/TKGetKoboRawData";
import { TKSpatialDescription } from "@/domain/core/TKSpatialDescription";
import { TKCreateSurvey } from "./survey/TKCreateSurvey";

import { TKSurveyCollection } from "@/domain/core/TKSurveyCollection";
import { TKLanguageDescription } from "@/domain/core/TKLanguageDescription";

export async function TKCreateSurveyCollection(
  surveyDescription: TKKoboSurveyInfo[] | TKCSVSurveyInfo[],
  surveyFormat: "csv" | "kobo",
  spatialDescription: TKSpatialDescription,
  languages: TKLanguageDescription[]
): Promise<TKSurveyCollection> {
  // prepare output
  const surveyCollection: TKSurveyCollection = {};

  // foreach survey info
  for (const info of surveyDescription) {
    // Retrieve raw data
    let rawData;
    if (surveyFormat === "csv") {
      rawData = await TKGetCSVRawData(info as TKCSVSurveyInfo);
    } else {
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
