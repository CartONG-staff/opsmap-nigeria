export interface KoboSurveyInfo {
  name: string;
  url: string;
  token: string;
}

export interface CSVSurveyInfo {
  name: string;
}

export interface Logo {
  name: string;
  urlLogo: string;
  urlRedirection: string;
}

export interface FooterLogos {
  clusterLed: Logo[];
  coordinationAndIMSupport: Logo[];
  Fieldwork: Logo[];
  Webdev: Logo[];
}

export interface GeneralConfiguration {
  readonly name: string;
  readonly iso3: string;
  readonly surveyFormat: "csv" | "kobo";
  readonly surveyDescription: KoboSurveyInfo[] | CSVSurveyInfo[];
  readonly headerLogo: Logo[];
  readonly footerLogos: FooterLogos;
}
