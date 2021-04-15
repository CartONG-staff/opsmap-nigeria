import { TKKoboSurveyInfo } from "@/domain/survey/surveyRawData/kobo/TKKoboSurveyInfo";
import { TKFooterLogos } from "@/domain/ui/TKFooterLogos";
import { TKCSVSurveyInfo } from "@/domain/survey/surveyRawData/csv/TKCSVTypes";
import { TKIndicatorComputationType, TKIndicatorsDescription } from "@/domain/core/TKIndicatorsDescription";
import {
  LanguageCode,
  TKLanguageDescription
} from "@/domain/core/TKLanguageDescription";
import { TKLogo } from "@/domain/ui/TKLogo";
import { TKSpatialDescription } from "@/domain/core/TKSpatialDescription";

import {
  TKLOGO_CARTONG,
  TKLOGO_CCCM,
  TKLOGO_REACH,
  TKLOGO_UNHCR
} from "@/domain/ui/TKLogosConst";

export const spatialDescription: TKSpatialDescription = {
  siteIDField: "mp_site_id",
  siteNameField: "mp_site_name",
  siteTypeField: "mp_shelter_type",
  siteLastUpdateField: "mp_last_date",
  siteLatitudeField: "mp_latitude",
  siteLongitudeField: "mp_longitude",
  adm1Pcode: "adm1pcode",
  adm1Name: "ggi_state",
  adm2Pcode: "adm2pcode",
  adm2Name: "ggi_city",
  adm3Pcode: "",
  adm3Name: "ggi_address"
};

export const indicatorsDescription: TKIndicatorsDescription = {
  home: [{
    iconOchaName: "IDP-refugee-camp",
    name: "Site",
    entryCode: "mp_site_id"
  },
  {
    iconOchaName: "People-in-need",
    name: "People",
    entryCode: "demo_num_indv",
    computationType: TKIndicatorComputationType.SUM
  },
  {
    iconOchaName: "Camp-Coordination-and-Camp-Management",
    name: "Shelter Max Capacity",
    entryCode: "cccm_shelter_max_capacity",
    computationType: TKIndicatorComputationType.MEAN
  }],
  site: [{
    iconOchaName: "Camp-Coordination-and-Camp-Management",
    name: "Site at Full Capacity",
    entryCode: "cccm_site_at_full_capacity"
  },
  {
    iconOchaName: "Camp-Coordination-and-Camp-Management",
    name: "Shelter Type",
    entryCode: "cccm_shelter_type"
  },
  {
    iconOchaName: "People-in-need",
    name: "No. of Individuals",
    entryCode: "demo_num_indv"
  }]
};

export const koboSurveyInfo: TKKoboSurveyInfo[] = [
  {
    name: "survey1",
    folder: "demo1",
    url:
      "https://kobo.humanitarianresponse.info/api/v2/assets/aJ7uW4DUnpfsn6kRjvQWFq/data.json",
    token: "ab46c724b720d44c4c8d44e86241219ce5cec6d6"
  },
  {
    name: "survey2",
    folder: "demo1",
    url:
      "https://kobo.humanitarianresponse.info/api/v2/assets/aJ7uW4DUnpfsn6kRjvQWFq/data.json",
    token: "ab46c724b720d44c4c8d44e86241219ce5cec6d6"
  }
];

export const csvSurveyInfo: TKCSVSurveyInfo[] = [
  {
    name: "2021",
    folder: "demo1"
  }
];

export const languages: TKLanguageDescription[] = [
  {
    name: "English",
    code: LanguageCode.EN,
    flag: "https://www.countryflags.io/gb/flat/64.png"
  },
  {
    name: "Português",
    code: LanguageCode.PT,
    flag: "https://www.countryflags.io/br/flat/64.png"
  }
];

export const headerLogo: TKLogo[] = [TKLOGO_CCCM];

export const footerLogos: TKFooterLogos = {
  clusterLed: [TKLOGO_UNHCR, TKLOGO_CCCM],
  coordinationAndIMSupport: [TKLOGO_CCCM],
  Fieldwork: [TKLOGO_REACH],
  Webdev: [TKLOGO_CARTONG]
};
