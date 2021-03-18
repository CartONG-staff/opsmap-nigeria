interface KoboSurveyInfo {
  name: string;
  url: string;
  token: string;
}

interface CSVSurveyInfo {
  name: string;
}

interface Logo {
  name: string;
  urlLogo: string;
  urlRedirection: string;
}

export interface GeneralConfiguration {
  readonly name: string;
  readonly iso3: string;
  readonly surveyFormat: "csv" | "kobo";
  readonly surveyDescription: KoboSurveyInfo[] | CSVSurveyInfo[];
  readonly headerLogo: Logo[];
  readonly footerLogo: Logo[];
}
