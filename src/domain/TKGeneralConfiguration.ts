import { TKMapboxConfiguration } from "./Map/TKMapboxConfiguration";
import { TKLogo } from "./UI/TKLogo";
import { TKKoboSurveyInfo } from "./Data/Kobo/TKKoboSurveyInfo";
import { TKFooterLogos } from "./UI/TKFooterLogos";
import { TKCSVSurveyInfo } from "./Data/CSV/TKCSVSurveyInfo";

export interface TKGeneralConfiguration {
  readonly name: string;
  readonly iso3: string;
  readonly surveyFormat: "csv" | "kobo";
  readonly surveyDescription: TKKoboSurveyInfo[] | TKCSVSurveyInfo[];
  readonly headerLogo: TKLogo[];
  readonly footerLogos: TKFooterLogos;
  readonly mapConfig: TKMapboxConfiguration;
}
