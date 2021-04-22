import { TKSurveyInfos } from "@/domain/opsmapConfig/TKSurveyInfos";
import { TKSurveyInfosKobo } from "./TKSurveyInfosKobo";

// ////////////////////////////////////////////////////////////////////////////
// Retrieve raw data from kobo
// ////////////////////////////////////////////////////////////////////////////

export async function TKGetKoboRawData(config: TKSurveyInfos) {
  if (config instanceof TKSurveyInfosKobo) {
    try {
      const response = await fetch(config.url, {
        method: "get",
        headers: new Headers({
          Authorization: `Token ${config.token}`
        })
      });
      const result = await response.json();
      return result.results;
    } catch (error) {
      console.log(error);
    }
  }
}