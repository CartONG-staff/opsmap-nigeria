import { TKSurveyInfosCSV } from "./TKSurveyInfosCSV";
import { TKCSVRead } from "./TKCSVReader";

export async function TKGetCSVRawData(survey: TKSurveyInfosCSV) {
  const csvData = await TKCSVRead(survey.submissionsFile, survey.submissionsFolder, true);
  return csvData;
}
