import { TKSurvey } from "./TKSurvey"
import { TKSurveyInfosCSV } from "../csv/TKSurveyInfosCSV";
import { TKCreateFDF } from "@/domain/fdf/TKFDF";
import { TKGetCSVRawData } from "@/domain/csv/TKGetCSVRawData";
import { TKGetKoboRawData } from "../kobo/TKGetKoboRawData";
import { TKSpatialDescription } from "@/domain/opsmapConfig/TKSpatialDescription";
import { TKCreateSurvey } from "./TKSurvey";
import { TKIndicatorsDescription } from "@/domain/opsmapConfig/TKIndicatorsDescription";
import { TKSurveyInfos } from "../opsmapConfig/TKSurveyInfos";
import { TKSurveyInfosKobo } from "../kobo/TKSurveyInfosKobo";

// ////////////////////////////////////////////////////////////////////////////
// SurveyCollection concept definition
// ////////////////////////////////////////////////////////////////////////////
export interface TKSurveyCollection {
    [fdf: string]: TKSurvey;
}

// ////////////////////////////////////////////////////////////////////////////
// Create all the survey based on the surveys infos
// ////////////////////////////////////////////////////////////////////////////

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
