import { TKCSVSurveyInfo } from "../CSV/TKCSVTypes";
import { TKKoboSurveyInfo } from "../Kobo/TKKoboSurveyInfo";
import { TKSurveyInfoGetter } from "../Survey/TKSurveyInfoGetter";
import { TKCSVDataGetter } from "../CSV/TKCSVDataGetter";
import { TKKoboDataGetter } from "../Kobo/TKKoboDataGetter";

export async function TKDatasetBuilder(
  surveyDescription: TKKoboSurveyInfo[] | TKCSVSurveyInfo[],
  surveyFormat: "csv" | "kobo"
) {
  for (const item of surveyDescription) {
    const plop = await TKSurveyInfoGetter(item);
    console.log(plop);
    if (surveyFormat === "csv") {
      const flop = await TKCSVDataGetter(item);
      console.log(flop);
    } else {
      const flap = await TKKoboDataGetter(item);
      console.log(flap);
    }
  }
}
