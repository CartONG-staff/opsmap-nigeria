import { TKCSVSurveyInfo } from "../CSV/TKCSVTypes";
import { TKKoboSurveyInfo } from "../Kobo/TKKoboSurveyInfo";
import { TKSurveyConfigurationBuilder } from "./TKSurveyConfigurationBuilder";
import { TKCSVDataGetter } from "../CSV/TKCSVDataGetter";
import { TKKoboDataGetter } from "../Kobo/TKKoboDataGetter";

export async function TKDatasetBuilder(
  surveyDescription: TKKoboSurveyInfo[] | TKCSVSurveyInfo[],
  surveyFormat: "csv" | "kobo"
) {
  for (const item of surveyDescription) {
    const surveyConfiguration = await TKSurveyConfigurationBuilder(item);
    console.log(surveyConfiguration);
    if (surveyFormat === "csv") {
      const flop = await TKCSVDataGetter(item);
      console.log(flop);
    } else {
      const flap = await TKKoboDataGetter(item);
      console.log(flap);
    }
  }
}
