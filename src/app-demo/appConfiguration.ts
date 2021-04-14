import { TKKoboSurveyInfo } from "@/domain/data/kobo/TKKoboSurveyInfo";
import { TKFooterLogos } from "@/domain/ui/TKFooterLogos";
import { TKCSVSurveyInfo } from "@/domain/data/csv/TKCSVTypes";
import {
  LanguageCode,
  TKLanguageDescription,
} from "@/domain/config/TKLanguageDescription";
import { TKLogo } from "@/domain/ui/TKLogo";
import { TKSpatialDescription } from "@/domain/config/TKSpatialDescription";
import {
  TKLOGO_CARTONG,
  TKLOGO_CCCM,
  TKLOGO_REACH,
  TKLOGO_UNHCR,
} from "@/domain/data/logos";

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
  adm3Name: "ggi_address",
};
export const koboSurveyInfo: TKKoboSurveyInfo[] = [
  {
    name: "dataset1",
    folder: "demo1",
    url:
      "https://kobo.humanitarianresponse.info/api/v2/assets/aJ7uW4DUnpfsn6kRjvQWFq/data.json",
    token: "ab46c724b720d44c4c8d44e86241219ce5cec6d6",
  },
  {
    name: "dataset2",
    folder: "demo1",
    url:
      "https://kobo.humanitarianresponse.info/api/v2/assets/aJ7uW4DUnpfsn6kRjvQWFq/data.json",
    token: "ab46c724b720d44c4c8d44e86241219ce5cec6d6",
  },
];

export const csvSurveyInfo: TKCSVSurveyInfo[] = [
  {
    name: "2021",
    folder: "demo1",
  },
];

export const languages: TKLanguageDescription[] = [
  {
    name: "English",
    code: LanguageCode.EN,
    flag: "https://www.countryflags.io/gb/flat/64.png",
  },
  {
    name: "Português",
    code: LanguageCode.PT,
    flag: "https://www.countryflags.io/br/flat/64.png",
  },
];

export const headerLogo: TKLogo[] = [TKLOGO_CCCM];

export const footerLogos: TKFooterLogos = {
  clusterLed: [TKLOGO_UNHCR, TKLOGO_CCCM],
  coordinationAndIMSupport: [TKLOGO_CCCM],
  Fieldwork: [TKLOGO_REACH],
  Webdev: [TKLOGO_CARTONG],
};
