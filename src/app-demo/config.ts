import { TKGeneralConfiguration } from "@/domain/core/TKGeneralConfiguration";
import {
  languages,
  koboSurveyInfo,
  csvSurveyInfo,
  spatialDescription,
  headerLogo,
  footerLogos,
} from "@/app-demo/appConfiguration";
import { TKMapboxConfiguration } from "@/domain/map/TKMapboxConfiguration";

const mapConfig: TKMapboxConfiguration = {
  token:
    "pk.eyJ1Ijoib3BzbWFwcGVyIiwiYSI6ImNrbW5xMWFuYzBqejMydnBnN2VjMTBjcG8ifQ.OtWWd9kzJdJjogrY7gb-sw",
  style: "mapbox://styles/opsmapper/ckmnq4jfb12r217o7yon9r383",
  padding: 100,
  zoomspeed: 2,
};

export const APPCONFIG: TKGeneralConfiguration = {
  name: "brazil",
  iso3: "BRA",
  language: languages,
  surveyFormat: "csv",
  // surveyDescription: koboInfo,
  surveyDescription: csvSurveyInfo,
  spatialDescription: spatialDescription,
  headerLogo: headerLogo,
  footerLogos: footerLogos,
  mapConfig: mapConfig,
};
