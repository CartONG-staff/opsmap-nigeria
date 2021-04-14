import { TKMapboxConfiguration } from "@/domain/map/TKMapboxConfiguration";
import { TKLogo } from "@/domain/ui/TKLogo";
import { TKKoboSurveyInfo } from "@/domain/survey/surveyraw/kobo/TKKoboSurveyInfo";
import { TKFooterLogos } from "@/domain/ui/TKFooterLogos";
import { TKCSVSurveyInfo } from "@/domain/survey/surveyraw/csv/TKCSVTypes";
import { TKLanguageDescription } from "@/domain/core/TKLanguageDescription";
import { TKSpatialDescription } from "@/domain/core/TKSpatialDescription";
import { TKSurveyFormat } from "@/domain/core/TKSurveyFormat";
export interface TKGeneralConfiguration {
  readonly name: string;
  readonly iso3: string;
  readonly language: TKLanguageDescription[];
  readonly surveyFormat: TKSurveyFormat;
  readonly surveyDescription: TKKoboSurveyInfo[] | TKCSVSurveyInfo[];
  readonly headerLogo: TKLogo[];
  readonly footerLogos: TKFooterLogos;
  readonly mapConfig: TKMapboxConfiguration;
  readonly spatialDescription: TKSpatialDescription;
}
