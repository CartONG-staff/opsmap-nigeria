import { TKMapboxConfiguration } from "@/domain/opsmapConfig/TKMapboxConfiguration";
import { TKLabel } from "@/domain/ui/TKLabel";
import { TKSurveyInfos } from "@/domain/opsmapConfig/TKSurveyInfos";
import { TKFooterLogosDescription } from "@/domain/opsmapConfig/TKFooterLogos";
import { TKSpatialDescription } from "@/domain/opsmapConfig/TKSpatialDescription";
import { TKIndicatorsDescription } from "@/domain/opsmapConfig/TKIndicatorsDescription";
import { TKCSVRead } from "@/domain/csv/TKCSVReader";
import { TKSurveyInfosGSheet } from "../domain/gsheet/TKSurveyInfosGSheet";

// ////////////////////////////////////////////////////////////////////////////
// Global Opsmap configuration
// ////////////////////////////////////////////////////////////////////////////
export interface TKOpsmapConfiguration {
  readonly name: TKLabel;
  readonly languages: string[];
  readonly iso3: string;
  readonly surveyDescription: TKSurveyInfos[];
  readonly opsmapDescr: TKLabel;
  readonly footerLogos: TKFooterLogosDescription;
  readonly mapConfig: TKMapboxConfiguration;
  readonly spatialDescription: TKSpatialDescription;
  readonly indicatorsDescription: TKIndicatorsDescription;
}

function readAllLocalesValues(
  basename: string,
  config: { [key: string]: string },
  languages: string[]
): TKLabel {
  const label: TKLabel = {};
  languages.forEach(lang => {
    if (config[basename + "_" + lang]) {
      label[lang] = config[basename + "_" + lang];
    }
  });
  return label;
}

// ////////////////////////////////////////////////////////////////////////////
// Read configuration from CSV file
//
// Watch for default values here.
//
// ////////////////////////////////////////////////////////////////////////////
interface TKOpsmapConfigurationLabelCSV {
  config_type: string;
  info: string;
}

export async function TKReadGeneralConfiguration(
  configFileName: string,
  configFileFolder: string
): Promise<TKOpsmapConfiguration> {
  const labels: TKOpsmapConfigurationLabelCSV[] = await TKCSVRead<
    TKOpsmapConfigurationLabelCSV[]
  >(configFileName, configFileFolder, true);
  const dict: { [key: string]: string } = labels.reduce(
    (dictionnary, item) => ({ ...dictionnary, [item.config_type]: item.info }),
    {}
  );

  // Ignore:
  //  {config_type: "fdf_id", info: "BR_FDF_s1_080421"}
  //  {config_type: "csv_data_id", info: "BR_DATA_080421_FDF_s1"}
  //  {config_type: "project_overview_fr", info: "Plus de 260 000 réfugiés et migrants se sont rendu…toyenneté, en partenariat avec les Forces Armées."}

  // ////////////////////////////////////////////////////////////////////////////
  // Languages
  const languages = (dict["languages"] ?? "").split(",");
  if (!languages.length) {
    // ensure at least english
    languages.push("en");
  }

  // Lack:
  // - iso3
  // - csv
  // - useBoundariesMasks
  const config: TKOpsmapConfiguration = {
    languages: languages,
    name: readAllLocalesValues("name", dict, languages),
    iso3: dict["iso3"] ?? "",
    opsmapDescr: readAllLocalesValues("project_overview", dict, languages),
    spatialDescription: {
      siteIDField: dict["mp_site_id"] ?? "mp_site_id",
      siteNameField: dict["mp_site_name"] ?? "mp_site_name",
      siteTypeField: dict["mp_shelter_type"] ?? "mp_shelter_type",
      siteLastUpdateField: dict["mp_last_date"] ?? "mp_last_date",
      siteLatitudeField: dict["mp_latitude"] ?? "mp_latitude",
      siteLongitudeField: dict["mp_longitude"] ?? "mp_longitude",
      adm1Pcode: dict["adm1_unhcr"] ?? "adm1pcode",
      adm1Name: dict["adm1Name"] ?? "ggi_state",
      adm2Pcode: dict["adm2_unhcr"] ?? "adm2pcode",
      adm2Name: dict["adm2Name"] ?? "ggi_city",
      adm3Pcode: dict["adm3Pcode"] ?? "",
      adm3Name: dict["adm3Name"] ?? "ggi_address",
      useBoundariesMasks: true
    },
    indicatorsDescription: {
      home: [
        {
          name: readAllLocalesValues("ikey1_homepage_label", dict, languages),
          entryCode: dict["ikey1_homepage"] ?? "",
          iconOchaName: dict["ikey1_homepage_picto"] ?? ""
        },
        {
          name: readAllLocalesValues("ikey2_homepage_label", dict, languages),
          entryCode: dict["ikey2_homepage"] ?? "",
          iconOchaName: dict["ikey2_homepage_picto"] ?? ""
        },
        {
          name: readAllLocalesValues("ikey3_homepage_label", dict, languages),
          entryCode: dict["ikey3_homepage"] ?? "",
          iconOchaName: dict["ikey3_homepage_picto"] ?? ""
        }
      ],
      site: [
        {
          name: readAllLocalesValues("ikey4_sitepage_label", dict, languages),
          entryCode: dict["ikey4_sitepage"] ?? "",
          iconOchaName: dict["ikey4_sitepage_picto"] ?? ""
        },
        {
          name: readAllLocalesValues("ikey5_sitepage_label", dict, languages),
          entryCode: dict["ikey5_sitepage"] ?? "",
          iconOchaName: dict["ikey5_sitepage_picto"] ?? ""
        },
        {
          name: readAllLocalesValues("ikey6_sitepage_label", dict, languages),
          entryCode: dict["ikey6_sitepage"] ?? "",
          iconOchaName: dict["ikey6_sitepage_picto"] ?? ""
        }
      ]
    },
    footerLogos: {
      Fieldwork: [
        {
          name: dict["fieldwork_name_1"] ?? "1",
          urlLogo: dict["fieldwork_logo_1"] ?? "1",
          urlRedirection: dict["fieldwork_link_1"] ?? "1"
        },
        {
          name: dict["fieldwork_name_2"] ?? "2",
          urlLogo: dict["fieldwork_logo_2"] ?? "2",
          urlRedirection: dict["fieldwork_link_2"] ?? "2"
        },
        {
          name: dict["fieldwork_name_3"] ?? "3",
          urlLogo: dict["fieldwork_logo_3"] ?? "3",
          urlRedirection: dict["fieldwork_link_3"] ?? "3"
        }
      ],
      clusterLed: [
        {
          name: dict["led_name_1"] ?? "1",
          urlLogo: dict["led_logo_1"] ?? "1",
          urlRedirection: dict["led_link_1"] ?? "1"
        },
        {
          name: dict["led_name_2"] ?? "2",
          urlLogo: dict["led_logo_2"] ?? "2",
          urlRedirection: dict["led_link_2"] ?? "2"
        }
      ],
      coordinationAndIMSupport: [
        {
          name: dict["coord_name_1"] ?? "",
          urlLogo: dict["coord_logo_1"] ?? "",
          urlRedirection: dict["coord_link_1"] ?? ""
        }
      ],
      Webdev: [
        {
          name: dict["webdev_name_1"] ?? "",
          urlLogo: dict["webdev_logo_1"] ?? "",
          urlRedirection: dict["webdev_link_1"] ?? ""
        }
      ]
    },
    surveyDescription: [
      new TKSurveyInfosGSheet(
        dict["survey_name"] ?? "",
        { folder: "brazil/" + dict["fdf_id"] },
        dict["survey_url"] ?? ""
      )
    ],
    mapConfig: new TKMapboxConfiguration()
  };

  return config;
}
