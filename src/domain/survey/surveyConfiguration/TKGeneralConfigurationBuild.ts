import { TKGeneralConfiguration } from "@/domain/core/TKGeneralConfiguration";

import { TKSurveyFormat } from "@/domain/core/TKSurveyFormat";
import { TKCSVSurveyInfo } from "@/domain/survey/surveyRawData/csv/TKCSVTypes"
import { TKCSVRead } from "../surveyRawData/csv/TKCSVReader";
export interface TKGeneralConfigurationLabelCSV{
    config_type:string;
    info: string;
}

export async function  TKGeneralConfigurationBuild(): Promise<TKGeneralConfiguration> {

    const labels: TKGeneralConfigurationLabelCSV[] = await TKCSVRead(
        "General_config",
        "demo1",
        true
      );
    const dict : {[key: string] : string} = labels.reduce( (dictionnary, item) => ({...dictionnary, [item.config_type]: item.info}), {});

    // SurveyFormat
    // TODO : improve this.
    let surveyFormat: TKSurveyFormat = TKSurveyFormat.CSV;
    if(dict["survey_format"]){
        if(dict["survey_format"] === "kobo"){
            surveyFormat = TKSurveyFormat.KOBO
        }
    }

    // Ignore:
    //  {config_type: "fdf_id", info: "BR_FDF_s1_080421"}
    //  {config_type: "csv_data_id", info: "BR_DATA_080421_FDF_s1"}
    //  {config_type: "project_overview_en", info: "More than 260,000 refugees and migrants have trave…itizenship, in partnership with the Armed Forces."}
    //  {config_type: "project_overview_fr", info: "Plus de 260 000 réfugiés et migrants se sont rendu…toyenneté, en partenariat avec les Forces Armées."}
    //  {config_type: "project_overview_pt", info: "Mais de 260 mil refugiados e migrantes deslocaram-…a Cidadania, em parceria com as Forças Armadas.

    // Lack:
    // - iso3
    // - csv
    const config: TKGeneralConfiguration = {
        name: "brazil",
        iso3: dict["iso3"] ?? "BRA",
        surveyFormat: surveyFormat,
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
            adm3Name: dict["adm3Name"] ?? "ggi_address"
        },
        indicatorsDescription:{
            home:[{
                name: dict["ikey1_homepage_label"] ?? "",
                entryCode: dict["ikey1_homepage"] ?? "",
                iconOchaName: dict["ikey1_homepage_picto"] ?? ""
            }, {
                name: dict["ikey2_homepage_label"] ?? "",
                entryCode: dict["ikey2_homepage"] ?? "",
                iconOchaName: dict["ikey2_homepage_picto"] ?? ""
            },{
                name: dict["ikey3_homepage_label"] ?? "",
                entryCode: dict["ikey3_homepage"] ?? "",
                iconOchaName: dict["ikey3_homepage_picto"] ?? ""
            }
            ],
            site:[{
                name: dict["ikey4_sitepage_label"] ?? "",
                entryCode: dict["ikey4_sitepage"] ?? "",
                iconOchaName: dict["ikey4_sitepage_picto"] ?? ""
            },
            {
                name: dict["ikey5_sitepage_label"] ?? "",
                entryCode: dict["ikey5_sitepage"] ?? "",
                iconOchaName: dict["ikey5_sitepage_picto"] ?? ""
            },
            {
                name: dict["ikey6_sitepage_label"] ?? "",
                entryCode: dict["ikey6_sitepage"] ?? "",
                iconOchaName: dict["ikey6_sitepage_picto"] ?? ""
            }
            ]
        },
        footerLogos:{
            Fieldwork:[{
                name: dict["fieldwork_name_1"] ?? "",
                urlLogo: dict["fieldwork_logo_1"] ?? "",
                urlRedirection: dict["fieldwork_link_1"] ?? ""
            },
            {
                name: dict["fieldwork_name_2"] ?? "",
                urlLogo: dict["fieldwork_logo_2"] ?? "",
                urlRedirection: dict["fieldwork_link_2"] ?? ""
            },
            {
                name: dict["fieldwork_name_3"] ?? "",
                urlLogo: dict["fieldwork_logo_3"] ?? "",
                urlRedirection: dict["fieldwork_link_3"] ?? ""
            }],
            clusterLed:[{
                name: dict["led_name_1"] ?? "",
                urlLogo: dict["led_logo_1"] ?? "",
                urlRedirection: dict["led_link_1"] ?? ""
            },
            {
                name: dict["led_name_2"] ?? "",
                urlLogo: dict["led_logo_2"] ?? "",
                urlRedirection: dict["led_link_2"] ?? ""
            }],
            coordinationAndIMSupport:[{
                name: dict["coord_name_1"] ?? "",
                urlLogo: dict["coord_logo_1"] ?? "",
                urlRedirection: dict["coord_link_1"] ?? ""
            }],
            Webdev:[{
                name: dict["webdev_name_1"] ?? "CartONG",
                urlLogo: dict["webdev_logo_1"] ??  "https://www.cartong.org/sites/cartong/files/images/CartONG_logo_long_0_0_0.png",
                urlRedirection: dict["webdev_link_1"] ?? "https://www.cartong.org/"
            }]
        },
        surveyDescription: [{
            name: "2021",
            folder: "demo1"
        }],
        headerLogo: [{
            name: "CCCM",
            urlLogo:
              "https://raw.githubusercontent.com/cccmiraq/RASP/master/img/CCCMClusterLogo.bmp",
            urlRedirection: "https://cccmcluster.org"
        }],
        mapConfig: {
            token:
              "pk.eyJ1Ijoib3BzbWFwcGVyIiwiYSI6ImNrbW5xMWFuYzBqejMydnBnN2VjMTBjcG8ifQ.OtWWd9kzJdJjogrY7gb-sw",
            style: "mapbox://styles/opsmapper/ckmnq4jfb12r217o7yon9r383",
            padding: 100,
            zoomspeed: 2
          }
        // iso3: string;
        // surveyFormat: TKSurveyFormat;
        // surveyDescription: TKKoboSurveyInfo[] | TKCSVSurveyInfo[];
        // headerLogo: TKLogo[];
        // footerLogos: TKFooterLogos;
        // mapConfig: TKMapboxConfiguration;
        // spatialDescription: TKSpatialDescription;
        // indicatorsDescription: TKIndicatorsDescription;
    }
    return config;
}