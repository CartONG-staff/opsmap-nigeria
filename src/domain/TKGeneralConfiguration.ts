import { TKMapboxConfiguration } from "./TKMapboxConfiguration";
import { TKLogo } from "./TKLogo";
import { TKKoboSurveyInfo } from "./TKKoboSurveyInfo";
import { TKFooterLogos } from "./TKFooterLogos";
import { TKCSVSurveyInfo } from "./TKCSVSurveyInfo";

export interface TKGeneralConfiguration {
  readonly name: string;
  readonly iso3: string;
  readonly surveyFormat: "csv" | "kobo";
  readonly surveyDescription: TKKoboSurveyInfo[] | TKCSVSurveyInfo[];
  readonly headerLogo: TKLogo[];
  readonly footerLogos: TKFooterLogos;
  readonly mapConfig: TKMapboxConfiguration;
}
