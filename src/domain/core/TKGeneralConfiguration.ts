import { TKMapboxConfiguration } from "@/domain/core/TKMapboxConfiguration";
import { TKLogo } from "@/domain/ui/TKLogo";
import { TKKoboSurveyInfo } from "@/domain/survey/surveyRawData/kobo/TKKoboSurveyInfo";
import { TKFooterLogos } from "@/domain/ui/TKFooterLogos";
import { TKCSVSurveyInfo } from "@/domain/survey/surveyRawData/csv/TKCSVTypes";
import { TKSpatialDescription } from "@/domain/core/TKSpatialDescription";
import { TKSurveyFormat } from "@/domain/core/TKSurveyFormat";
import { TKIndicatorsDescription } from "@/domain/core/TKIndicatorsDescription";
import { TKLabel } from "./TKLabel";
export interface TKGeneralConfiguration {
  readonly name: string;
  readonly iso3: string;
  readonly surveyFormat: TKSurveyFormat;
  readonly surveyDescription: TKKoboSurveyInfo[] | TKCSVSurveyInfo[];
  readonly headerLogo: TKLogo[];
  readonly opsmapDescr: TKLabel;
  readonly footerLogos: TKFooterLogos;
  readonly mapConfig: TKMapboxConfiguration;
  readonly spatialDescription: TKSpatialDescription;
  readonly indicatorsDescription: TKIndicatorsDescription;
}
