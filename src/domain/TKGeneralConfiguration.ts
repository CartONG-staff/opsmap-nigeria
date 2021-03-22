import { TKMapboxConfiguration } from "./TKMapboxConfiguration";

export interface TKKoboSurveyInfo {
  name: string;
  url: string;
  token: string;
}

export interface TKCSVSurveyInfo {
  name: string;
}

export interface TKLogo {
  name: string;
  urlLogo: string;
  urlRedirection: string;
}

export interface TKFooterLogos {
  clusterLed: TKLogo[];
  coordinationAndIMSupport: TKLogo[];
  Fieldwork: TKLogo[];
  Webdev: TKLogo[];
}

export interface TKGeneralConfiguration {
  readonly name: string;
  readonly iso3: string;
  readonly surveyFormat: "csv" | "kobo";
  readonly surveyDescription: TKKoboSurveyInfo[] | TKCSVSurveyInfo[];
  readonly headerLogo: TKLogo[];
  readonly footerLogos: TKFooterLogos;
  readonly mapConfig: TKMapboxConfiguration;
}
