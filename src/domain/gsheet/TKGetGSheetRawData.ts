import { TKGSheetRead } from "./TKGSheetReader";
import { TKSurveyInfosGSheet } from "./TKSurveyInfosGSheet";

// ////////////////////////////////////////////////////////////////////////////
// Retrieve raw data from csv
// ////////////////////////////////////////////////////////////////////////////

export async function TKGetGSheetRawData(survey: TKSurveyInfosGSheet) {
  const csvData = await TKGSheetRead(survey.submissionsUrl, true);
  return csvData;
}
