import { TKSurvey } from "./TKSurvey";
import { TKCreateFDF } from "@/domain/fdf/TKFDF";
import { TKGetCSVRawData } from "@/domain/csv/TKGetCSVRawData";
import { TKGetGSheetRawData } from "@/domain/gsheet/TKGetGSheetRawData";
import { TKGetKoboRawData } from "@/domain/kobo/TKGetKoboRawData";
import { TKSpatialDescription } from "@/domain/opsmapConfig/TKSpatialDescription";
import { TKCreateSurvey } from "./TKSurvey";
import { TKIndicatorsDescription } from "@/domain/opsmapConfig/TKIndicatorsDescription";
import { TKSurveyInfos } from "@/domain/opsmapConfig/TKSurveyInfos";

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
  indicatorsDescription: TKIndicatorsDescription,
  languages: Array<string>
): Promise<TKSurveyCollection> {
  // prepare output
  const surveyCollection: TKSurveyCollection = {};

  // foreach survey info
  for (const info of surveyDescription) {
    // Retrieve raw data
    let rawData;
    const before = Date.now();
    if (info.type === "csv") {
      rawData = await TKGetCSVRawData(info);
    } else if (info.type === "gsheet") {
      rawData = await TKGetGSheetRawData(info);
    } else if (info.type === "kobo") {
      rawData = await TKGetKoboRawData(info);
    }
    console.log(
      `Raw data ${info.name} retrieved in ${(Date.now() - before) /
        1000} seconds.`
    );

    const beforeFDF = Date.now();

    // Retrieve config
    const surveyConfig = await TKCreateFDF(info);

    console.log(
      `FDF  ${info.name} retrieved in ${(Date.now() - beforeFDF) /
        1000} seconds.`
    );

    const beforeSurvey = Date.now();

    // Create survey
    surveyCollection[info.name] = TKCreateSurvey(
      rawData,
      surveyConfig,
      spatialDescription,
      indicatorsDescription,
      languages
    );

    console.log(
      `Survey  ${info.name} computed in ${(Date.now() - beforeSurvey) /
        1000} seconds.`
    );
  }
  return surveyCollection;
}
