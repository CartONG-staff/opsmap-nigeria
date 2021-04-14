import { TKKoboSurveyInfo } from "./TKKoboSurveyInfo";

export async function TKGetKoboSubmissions(config: TKKoboSurveyInfo) {
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
