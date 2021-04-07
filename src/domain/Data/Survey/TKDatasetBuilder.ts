import { TKCSVSurveyInfo } from "../CSV/TKCSVTypes";
import { TKKoboSurveyInfo } from "../Kobo/TKKoboSurveyInfo";
import { TKSurveyConfigurationBuilder } from "./TKSurveyConfigurationBuilder";
import { TKCSVSubmissionsGetter } from "@/domain/Data/CSV/TKCSVSubmissionsGetter";
import { TKKoboSubmissionsGetter } from "../Kobo/TKKoboSubmissionsGetter";

export async function TKDatasetBuilder(
  surveyDescription: TKKoboSurveyInfo[] | TKCSVSurveyInfo[],
  surveyFormat: "csv" | "kobo"
) {
  for (const item of surveyDescription) {
    const surveyConfiguration = await TKSurveyConfigurationBuilder(item);
    console.log(surveyConfiguration);
    if (surveyFormat === "csv") {
      const flop = await TKCSVSubmissionsGetter(item as TKCSVSurveyInfo);
      console.log(flop);
    } else {
      const flap = await TKKoboSubmissionsGetter(item as TKKoboSurveyInfo);
      console.log(flap);
    }
  }
}
