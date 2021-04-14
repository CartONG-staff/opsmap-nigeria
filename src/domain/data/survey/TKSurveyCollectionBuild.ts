import { TKCSVSurveyInfo } from "../csv/TKCSVTypes";
import { TKKoboSurveyInfo } from "../kobo/TKKoboSurveyInfo";
import { TKSurveyConfigurationBuild } from "./raw_data/TKSurveyConfigurationBuilder";
import { TKGetCSVSubmissions } from "@/domain/data/csv/TKGetCSVSubmissions";
import { TKGetKoboSubmissions } from "../kobo/TKGetKoboSubmissions";
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
    let rawData;
    if (surveyFormat === "csv") {
      rawData = await TKGetCSVSubmissions(info as TKCSVSurveyInfo);
    } else {
      rawData = await TKGetKoboSubmissions(info as TKKoboSurveyInfo);
    }

    const surveyConfig = await TKSurveyConfigurationBuild(info);

    surveyCollection[info.name] = TKGroupSubmissionsByCamp(
      rawData,
      surveyConfig,
      spatialDescription,
      languages
    );
  }
  return surveyCollection;
}
