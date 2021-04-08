import { TKMapboxConfiguration } from "@/domain/Map/TKMapboxConfiguration";
import { TKLogo } from "@/domain/UI/TKLogo";
import { TKKoboSurveyInfo } from "@/domain/Data/Kobo/TKKoboSurveyInfo";
import { TKFooterLogos } from "@/domain/UI/TKFooterLogos";
import { TKCSVSurveyInfo } from "@/domain/Data/CSV/TKCSVTypes";
import { TKLanguageDescription } from "@/domain/Config/TKLanguageDescription";
import { TKSpatialDescription } from "@/domain/Config/TKSpatialDescription";

export interface TKGeneralConfiguration {
  readonly name: string;
  readonly iso3: string;
  readonly language: TKLanguageDescription[];
  readonly surveyFormat: "csv" | "kobo";
  readonly surveyDescription: TKKoboSurveyInfo[] | TKCSVSurveyInfo[];
  readonly headerLogo: TKLogo[];
  readonly footerLogos: TKFooterLogos;
  readonly mapConfig: TKMapboxConfiguration;
  readonly spatialDescription: TKSpatialDescription;
}
