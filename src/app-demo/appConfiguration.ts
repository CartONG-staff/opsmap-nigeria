import { TKKoboSurveyInfo } from "@/domain/Data/Kobo/TKKoboSurveyInfo";
import { TKFooterLogos } from "@/domain/UI/TKFooterLogos";
import { TKCSVSurveyInfo } from "@/domain/Data/CSV/TKCSVTypes";
import { TKLanguageDescription } from "@/domain/Config/TKLanguageDescription";

import { TKLogo } from "@/domain/UI/TKLogo";
import { TKLOGO_CARTONG, TKLOGO_CCCM, TKLOGO_REACH, TKLOGO_UNHCR  } from "@/domain/Data/Logos"
export const koboInfo: TKKoboSurveyInfo[] = [
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

export const csvInfo: TKCSVSurveyInfo[] = [
  {
    name: "demo1",
    folder: "demo1",
  },
];

export const languages: TKLanguageDescription[] = [
  {
    name: "English",
    code: "en",
    flag: "https://www.countryflags.io/gb/flat/64.png",
  },
  {
    name: "Français",
    code: "fr",
    flag: "https://www.countryflags.io/fr/flat/64.png",
  },
];

export const headerLogo: TKLogo[] = [
  TKLOGO_CCCM
];

export const footerLogos: TKFooterLogos = {
  clusterLed: [
    TKLOGO_UNHCR,
    TKLOGO_CCCM
    ],
  coordinationAndIMSupport: [
    TKLOGO_CCCM
  ],
  Fieldwork: [
    TKLOGO_REACH
  ],
  Webdev: [
    TKLOGO_CARTONG,
  ],
};
