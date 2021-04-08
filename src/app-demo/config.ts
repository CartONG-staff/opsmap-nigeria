import { TKGeneralConfiguration } from "@/domain/Config/TKGeneralConfiguration";
import {
  languages,
  koboInfo,
  // csvInfo,
  headerLogo,
  footerLogos
} from "@/app-demo/appConfiguration";
import { TKMapboxConfiguration } from "@/domain/Map/TKMapboxConfiguration";

const mapConfig: TKMapboxConfiguration = {
  token:
    "pk.eyJ1IjoiY2FydG9uZyIsImEiOiJjazJldzVobGkwOWRxM2hzNTB1M3o2cG94In0.w7FyG31FWqXm3vXSh6WtxQ",
  style: "mapbox://styles/mapbox/streets-v11",
  padding: 100,
  zoomspeed: 2
};

export const APPCONFIG: TKGeneralConfiguration = {
  name: "brazil",
  iso3: "SOM",
  language: languages,
  surveyFormat: "kobo",
  surveyDescription: koboInfo,
  // surveyDescription: csvInfo,
  headerLogo: headerLogo,
  footerLogos: footerLogos,
  mapConfig: mapConfig
};
