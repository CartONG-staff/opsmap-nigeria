import { TKCSVReader } from "../CSV/TKCSVReader";
import { TKCSVSurveyInfo } from "../CSV/TKCSVTypes";
import { TKKoboSurveyInfo } from "../Kobo/TKKoboSurveyInfo";

export async function TKSurveyInfoGetter(
  survey: TKKoboSurveyInfo | TKCSVSurveyInfo
) {
  const labelsData = await TKCSVReader("labels", survey.folder);
  return labelsData;

  // const labelsRaw = await labelsData.getData()

  // const questions
}
