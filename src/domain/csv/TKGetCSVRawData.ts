import { TKCSVSurveyInfo } from "./TKCSVSurveyInfo";
import { TKCSVRead } from "./TKCSVReader";

export async function TKGetCSVRawData(survey: TKCSVSurveyInfo) {
  const csvData = await TKCSVRead(survey.submissionsFile, survey.submissionsFolder, true);
  return csvData;
}
