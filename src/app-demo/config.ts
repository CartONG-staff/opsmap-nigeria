import { TKGeneralConfiguration } from "@/domain/TKGeneralConfiguration";
import { koboInfo, headerLogo, footerLogos } from "@/app-demo/appConfiguration";

import { TKMapboxConfiguration } from "@/domain/TKMapboxConfiguration";

const mapConfig: TKMapboxConfiguration = {
  token:
    "pk.eyJ1IjoiY2FydG9uZyIsImEiOiJjazJldzVobGkwOWRxM2hzNTB1M3o2cG94In0.w7FyG31FWqXm3vXSh6WtxQ",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-68.48130213973545, -54.8458772648677],
  zoom: 15,
};

export const APPCONFIG: TKGeneralConfiguration = {
  name: "SYLDAVIE",
  iso3: "NGA",
  surveyFormat: "kobo",
  surveyDescription: koboInfo,
  headerLogo: headerLogo,
  footerLogos: footerLogos,
  mapConfig: mapConfig,
};
