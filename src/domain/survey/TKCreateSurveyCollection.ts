import { TKCSVSurveyInfo } from "../csv/TKCSVSurveyInfo";
import { TKKoboSurveyInfo } from "../kobo/TKKoboSurveyInfo";
import { TKCreateSurveyConfiguration } from "@/domain/fdf/TKFDF";
import { TKGetCSVRawData } from "@/domain/csv/TKGetCSVRawData";
import { TKGetKoboRawData } from "../kobo/TKGetKoboRawData";
import { TKSpatialDescription } from "@/domain/core/TKSpatialDescription";
import { TKCreateSurvey } from "./TKCreateSurvey";
import { TKSurveyCollection } from "@/domain/core/TKSurveyCollection";
import { TKSurveyFormat } from "@/domain/core/TKSurveyFormat";
import { TKIndicatorsDescription } from "../core/TKIndicatorsDescription";

export async function TKCreateSurveyCollection(
  surveyDescription: TKKoboSurveyInfo[] | TKCSVSurveyInfo[],
  surveyFormat: TKSurveyFormat,
  spatialDescription: TKSpatialDescription,
  indicatorsDescription: TKIndicatorsDescription
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
    const surveyConfig = await TKCreateSurveyConfiguration(info.fdf);
    // Create survey
    surveyCollection[info.name] = TKCreateSurvey(
      rawData,
      surveyConfig,
      spatialDescription,
      indicatorsDescription
    );
  }
  return surveyCollection;
}
