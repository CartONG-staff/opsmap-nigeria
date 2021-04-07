import { TKCSVSurveyInfo } from "./TKCSVTypes";
import { TKCSVReader } from "./TKCSVReader";

export async function TKCSVSubmissionsGetter(survey: TKCSVSurveyInfo) {
  const csvData = await TKCSVReader("submissions", survey.folder, true);
  return csvData;
}
