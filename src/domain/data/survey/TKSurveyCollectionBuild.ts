import { TKCSVSurveyInfo } from "../csv/TKCSVTypes";
import { TKKoboSurveyInfo } from "../kobo/TKKoboSurveyInfo";
import { TKSurveyConfigurationBuild } from "./raw_data/TKSurveyConfigurationBuilder";
import { TKCSVSubmissionsGet } from "@/domain/data/csv/TKCSVSubmissionsGetter";
import { TKKoboSubmissionsGet } from "../kobo/TKKoboSubmissionsGetter";
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
  const surveyCollection: TKSurveyCollection = {};
  for (const item of surveyDescription) {
    let rawData;
    if (surveyFormat === "csv") {
      rawData = await TKCSVSubmissionsGet(item as TKCSVSurveyInfo);
    } else {
      rawData = await TKKoboSubmissionsGet(item as TKKoboSurveyInfo);
    }
    const surveyConfig = await TKSurveyConfigurationBuild(item);
    surveyCollection[item.name] = TKGroupSubmissionsByCamp(
      rawData,
      surveyConfig,
      spatialDescription,
      languages
    );
  }
  return surveyCollection;
}
