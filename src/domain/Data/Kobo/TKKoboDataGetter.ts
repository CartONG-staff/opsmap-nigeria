import { TKKoboSurveyInfo } from "./TKKoboSurveyInfo";

export class TKKoboDataGetter {
  constructor(private config: TKKoboSurveyInfo) {
    this.config = config;
  }

  async getData() {
    try {
      const response = await fetch(this.config.url, {
        method: "get",
        headers: new Headers({
          Authorization: `Token ${this.config.token}`,
        }),
      });
      const result = await response.json();
      return result.results;
    } catch (error) {
      console.log(error);
    }
  }
}
