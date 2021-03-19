import { GeneralConfiguration } from "@/domain/TKGeneralConfiguration";
import {
  koboInfo,
  headerLogo,
  footerLogos,
} from "@/constants/appConfiguration";

export const APPCONFIG: GeneralConfiguration = {
  name: "SYLDAVIE",
  iso3: "NGA",
  surveyFormat: "kobo",
  surveyDescription: koboInfo,
  headerLogo: headerLogo,
  footerLogos: footerLogos,
};
