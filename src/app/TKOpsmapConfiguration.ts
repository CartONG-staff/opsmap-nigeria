import { TKMapboxConfiguration } from "@/domain/opsmapConfig/TKMapboxConfiguration";
import { TKLabel } from "@/domain/ui/TKLabel";
import { TKSurveyInfos } from "@/domain/opsmapConfig/TKSurveyInfos";
import { TKFooterLogosDescription } from "@/domain/opsmapConfig/TKFooterLogos";
import { TKSpatialDescription } from "@/domain/opsmapConfig/TKSpatialDescription";
import {
  TKIndicatorDescription,
  TKIndicatorDescriptionSiteOccupation,
  TKIndicatorsDescription
} from "@/domain/opsmapConfig/TKIndicatorsDescription";
import { TKCSVRead } from "@/domain/csv/TKCSVReader";
import { TKSurveyInfosKobo } from "../domain/kobo/TKSurveyInfosKobo";
import { FeatureCollection } from "geojson";
import { string } from "mathjs";
import { TKSurveyInfosGSheet } from "@/domain/gsheet/TKSurveyInfosGSheet";

// ////////////////////////////////////////////////////////////////////////////
// Global Opsmap configuration
// ////////////////////////////////////////////////////////////////////////////
export interface TKOpsmapConfiguration {
  readonly name: TKLabel;
  readonly languages: string[];
  readonly iso3: string;
  readonly iframe: string;
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

// Parse the indicator 'index'
// Sample TKIndicatorDescriptionSiteOccupation:
//    ikey4_sitepage;SITE_OCCUPATION,cccm_site_at_full_capacity,demo_num_indv,cccm_shelter_max_capacity:
function readSiteIndicator(
  dict: { [key: string]: string },
  languages: string[],
  index: string
): TKIndicatorDescription {
  if (dict["ikey" + index + "_sitepage"]?.startsWith("SITE_OCCUPATION")) {
    const fields = (dict["ikey" + index + "_sitepage"] ?? "").split(",");
    if (fields.length > 3) {
      return new TKIndicatorDescriptionSiteOccupation(
        readAllLocalesValues(
          "ikey" + index + "_sitepage_label",
          dict,
          languages
        ),
        fields[1],
        fields[2],
        fields[3],
        dict["ikey" + index + "_sitepage_picto"] ?? ""
      );
    }
  }

  return new TKIndicatorDescription(
    readAllLocalesValues("ikey" + index + "_sitepage_label", dict, languages),
    dict["ikey" + index + "_sitepage"] ?? "",
    dict["ikey" + index + "_sitepage_picto"] ?? ""
  );
}

// ////////////////////////////////////////////////////////////////////////////
// Read configuration from CSV file
//
// Watch for default values here.
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
  const dict: {
    [key: string]: string;
  } = labels.reduce(
    (dictionnary, item) => ({
      ...dictionnary,
      [item.config_type]: item.info
    }),
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

  // ////////////////////////////////////////////////////////////////////////////
  // survey collection analysis
  // For now, it only allows a single survey
  const surveys: Array<TKSurveyInfos> = [];
  let hasFoundSurvey = true;
  let i = 0;
  while (hasFoundSurvey) {
    const surveyName = dict["survey_name_" + string(i)] ?? "";
    const surveyType = dict["survey_type_" + string(i)] ?? "";
    hasFoundSurvey = surveyName !== "" && surveyType !== "";

    if (hasFoundSurvey) {
      if (surveyType === "gsheet") {
        surveys.push(
          new TKSurveyInfosGSheet(
            surveyName,
            { folder: dict["fdf_id_" + string(i)] ?? "" },
            dict["survey_url_" + string(i)] ?? "",
            dict["survey_tr_url_" + string(i)] ?? ""
          )
        );
      } else if (surveyType === "kobo") {
        surveys.push(
          new TKSurveyInfosKobo(
            dict["survey_name_" + string(i)] ?? "",
            { folder: dict["fdf_id_" + string(i)] ?? "" },
            dict["survey_url_" + string(i)] ?? "",
            dict["survey_kobo_token_" + string(i)] ?? ""
          )
        );
      }
    }

    i++;
  }

  // Lack:
  // - iso3
  // - csv
  // - useBoundariesMasks
  const config: TKOpsmapConfiguration = {
    languages: languages,
    name: readAllLocalesValues("name", dict, languages),
    iso3: dict["iso3"] ?? "",
    iframe: dict["iframe"] ?? "",
    opsmapDescr: readAllLocalesValues("project_overview", dict, languages),
    spatialDescription: {
      siteIDField: dict["mp_site_id"] ?? "",
      siteNameField: dict["mp_site_name"] ?? "",
      siteTypeField: dict["mp_shelter_type"] ?? "",
      siteLastUpdateField: dict["mp_last_date"] ?? "",
      siteLatitudeField: dict["mp_latitude"] ?? "",
      siteLongitudeField: dict["mp_longitude"] ?? "",
      adm1Pcode: dict["adm1_unhcr"] ?? "",
      adm1DBPcode: dict["adm1_dbField"] ?? "",
      adm1Name: dict["adm1Name"] ?? "",
      adm2Pcode: dict["adm2_unhcr"] ?? "",
      adm2DBPcode: dict["adm2_dbField"] ?? "",
      adm2Name: dict["adm2Name"] ?? "",
      adm2RefInAdm1: dict["adm2RefInAdm1"] ?? "",
      adm3Pcode: dict["adm3Pcode"] ?? "",
      adm3Name: dict["adm3Name"] ?? "",
      useBoundariesMasks: true,
      admin0LocalURL: dict["admin0_local_url"] ?? "",
      admin1LocalURL: dict["admin1_local_url"] ?? ""
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
        readSiteIndicator(dict, languages, "4"),
        readSiteIndicator(dict, languages, "5"),
        readSiteIndicator(dict, languages, "6")
      ]
    },
    footerLogos: {
      Fieldwork: [
        {
          name: dict["fieldwork_name_1"] ?? "1",
          urlLogo: process.env.BASE_URL + dict["fieldwork_logo_1"] ?? "1",
          urlRedirection: dict["fieldwork_link_1"] ?? "1"
        },
        {
          name: dict["fieldwork_name_2"] ?? "2",
          urlLogo: process.env.BASE_URL + dict["fieldwork_logo_2"] ?? "2",
          urlRedirection: dict["fieldwork_link_2"] ?? "2"
        },
        {
          name: dict["fieldwork_name_3"] ?? "3",
          urlLogo: process.env.BASE_URL + dict["fieldwork_logo_3"] ?? "3",
          urlRedirection: dict["fieldwork_link_3"] ?? "3"
        }
      ],
      clusterLed: [
        {
          name: dict["led_name_1"] ?? "1",
          urlLogo: process.env.BASE_URL + dict["led_logo_1"] ?? "1",
          urlRedirection: dict["led_link_1"] ?? "1"
        },
        {
          name: dict["led_name_2"] ?? "2",
          urlLogo: process.env.BASE_URL + dict["led_logo_2"] ?? "2",
          urlRedirection: dict["led_link_2"] ?? "2"
        }
      ],
      coordinationAndIMSupport: [
        {
          name: dict["coord_name_1"] ?? "",
          urlLogo: process.env.BASE_URL + dict["coord_logo_1"] ?? "",
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
    surveyDescription: surveys,
    mapConfig: {
      token:
        "pk.eyJ1IjoidW5oY3IiLCJhIjoiY2tveWJlcDV5MDVycTJ2and3ZXllcW1leCJ9.Vp5XDh5OhDXxZCZUvgEuDg",
      style: "mapbox://styles/unhcr/ckok20x8h03ma18qp76mxi3u4",
      padding: 100,
      zoomspeed: 2,
      bounds: (dict["spatial_boundaries"] ?? "")
        .split(",")
        .map(item => parseFloat(item))
    }
  };

  return config;
}
