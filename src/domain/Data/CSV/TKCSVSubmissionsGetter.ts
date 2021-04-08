import { TKCSVSurveyInfo } from "./TKCSVTypes";
import { TKCSVRead } from "./TKCSVReader";

export async function TKCSVSubmissionsGet(survey: TKCSVSurveyInfo) {
  const csvData = await TKCSVRead("submissions", survey.folder, true);
  return csvData;
}
