import { TKGeneralConfiguration } from "@/domain/config/TKGeneralConfiguration";
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
    "pk.eyJ1IjoiY2FydG9uZyIsImEiOiJjazJldzVobGkwOWRxM2hzNTB1M3o2cG94In0.w7FyG31FWqXm3vXSh6WtxQ",
  style: "mapbox://styles/mapbox/streets-v11",
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
