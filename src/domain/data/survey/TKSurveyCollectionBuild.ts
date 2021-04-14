import { TKCSVSurveyInfo } from "../csv/TKCSVTypes";
import { TKKoboSurveyInfo } from "../kobo/TKKoboSurveyInfo";
import { TKCreateSurveyConfiguration } from "./raw_data/TKCreateSurveyConfiguration";
import { TKGetCSVRawData } from "@/domain/data/csv/TKGetCSVRawData";
import { TKGetKoboRawData } from "../kobo/TKGetKoboRawData";
import { TKSpatialDescription } from "@/domain/config/TKSpatialDescription";
import { TKGroupSubmissionsByCamp } from "./merged_surveys/TKGroupSubmissionsByCamp";

import { TKSurveyCollection } from "@/domain/core/TKSurveyCollection";
import { TKLanguageDescription } from "@/domain/config/TKLanguageDescription";

export async function TKSurveyCollectionBuild(
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
    surveyCollection[info.name] = TKGroupSubmissionsByCamp(
      rawData,
      surveyConfig,
      spatialDescription,
      languages
    );
  }
  return surveyCollection;
}
