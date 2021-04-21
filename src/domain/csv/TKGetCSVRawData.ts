import { TKSurveyInfosCSV } from "./TKSurveyInfosCSV";
import { TKCSVRead } from "./TKCSVReader";

// ////////////////////////////////////////////////////////////////////////////
// Retrieve raw data from csv
// ////////////////////////////////////////////////////////////////////////////

export async function TKGetCSVRawData(survey: TKSurveyInfosCSV) {
  const csvData = await TKCSVRead(
    survey.submissionsFile,
    survey.submissionsFolder,
    true
  );
  return csvData;
}
