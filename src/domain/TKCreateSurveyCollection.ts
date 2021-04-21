import { TKSurveyInfosCSV } from "./csv/TKSurveyInfosCSV";
import { TKCreateFDF } from "@/domain/fdf/TKFDF";
import { TKGetCSVRawData } from "@/domain/csv/TKGetCSVRawData";
import { TKGetKoboRawData } from "./kobo/TKGetKoboRawData";
import { TKSpatialDescription } from "@/domain/core/TKSpatialDescription";
import { TKCreateSurvey } from "./survey/TKCreateSurvey";
import { TKSurveyCollection } from "@/domain/core/TKSurveyCollection";
import { TKIndicatorsDescription } from "./core/TKIndicatorsDescription";
import { TKSurveyInfos } from "./core/TKSurveyInfos";
import { TKSurveyInfosKobo } from "./kobo/TKSurveyInfosKobo";

export async function TKCreateSurveyCollection(
  surveyDescription: TKSurveyInfos[],
  spatialDescription: TKSpatialDescription,
  indicatorsDescription: TKIndicatorsDescription
  ): Promise<TKSurveyCollection> {
  // prepare output
  const surveyCollection: TKSurveyCollection = {};

  // foreach survey info
  for (const info of surveyDescription) {
    // Retrieve raw data
    let rawData;
    if(info instanceof TKSurveyInfosCSV){
      rawData = await TKGetCSVRawData(info);
    } else if (info instanceof TKSurveyInfosKobo) {
      rawData = await TKGetKoboRawData(info);
    }

    // Retrieve config
    const surveyConfig = await TKCreateFDF(info.fdf);
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
