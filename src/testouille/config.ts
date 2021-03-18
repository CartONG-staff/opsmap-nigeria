import { GeneralConfiguration } from "@/domain/GeneralConfiguration";
import { koboInfo, headerLogo, footerLogo } from "@/constants/appConfiguration";

export const APPCONFIG: GeneralConfiguration = {
  name: "CCCM SITE TRACKER SYLDAVIE",
  iso3: "NGA",
  surveyFormat: "kobo",
  surveyDescription: koboInfo,
  headerLogo: headerLogo,
  footerLogo: footerLogo,
};
