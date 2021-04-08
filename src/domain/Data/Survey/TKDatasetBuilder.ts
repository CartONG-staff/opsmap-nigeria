import { TKCSVSurveyInfo } from "../CSV/TKCSVTypes";
import { TKKoboSurveyInfo } from "../Kobo/TKKoboSurveyInfo";
import { TKSurveyConfigurationBuild } from "./TKSurveyConfigurationBuilder";
import { TKCSVSubmissionsGet } from "@/domain/Data/CSV/TKCSVSubmissionsGetter";
import { TKKoboSubmissionsGet } from "../Kobo/TKKoboSubmissionsGetter";
import { TKSpatialDescription } from "@/domain/Config/TKSpatialDescription";

export async function TKDatasetBuild(
  surveyDescription: TKKoboSurveyInfo[] | TKCSVSurveyInfo[],
  surveyFormat: "csv" | "kobo",
  spatialDescription: TKSpatialDescription
) {
  console.log(spatialDescription);

  for (const item of surveyDescription) {
    const promises = [];
    if (surveyFormat === "csv") {
      promises.push(TKCSVSubmissionsGet(item as TKCSVSurveyInfo));
    } else {
      promises.push(TKKoboSubmissionsGet(item as TKKoboSurveyInfo));
    }
    promises.push(TKSurveyConfigurationBuild(item));
    Promise.allSettled(promises).then((results: PromiseSettledResult<T>[]) => {
      if (
        results[0].status === "fulfilled" &&
        results[1].status === "fulfilled"
      ) {
        console.log(results[0].value);
      }
    });
  }
}
