import { TKCSVSurveyInfo } from "./TKCSVTypes";
import { TKCSVReader } from "./TKCSVReader";

export async function TKCSVDataGetter(survey: TKCSVSurveyInfo) {
  const csvData = await TKCSVReader("data", survey.folder);
  return csvData;
}
