import { TKMapboxConfiguration } from "@/domain/map/TKMapboxConfiguration";
import { TKLogo } from "@/domain/ui/TKLogo";
import { TKKoboSurveyInfo } from "@/domain/dataaaaa/kobo/TKKoboSurveyInfo";
import { TKFooterLogos } from "@/domain/ui/TKFooterLogos";
import { TKCSVSurveyInfo } from "@/domain/dataaaaa/csv/TKCSVTypes";
import { TKLanguageDescription } from "@/domain/config/TKLanguageDescription";
import { TKSpatialDescription } from "@/domain/config/TKSpatialDescription";

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
