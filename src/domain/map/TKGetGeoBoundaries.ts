import { ArcgisServerDataGetter } from "@/secondary/arcgis/TKArcgisServerDataGetter";
import { TKGeoDataset } from "@/domain/map/TKGeoDataset";
import { TKDataset } from "@/domain/survey/TKDataset";
import { TKOpsmapSpatialConfiguration } from "../opsmapConfig/TKOpsmapConfiguration";
import { TKAdminLevel } from "../opsmapConfig/TKAdminLevel";
import { TKBoundaries } from "../survey/TKBoundaries";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import { FeatureCollection } from "geojson";

const DB_URL: Partial<Record<TKAdminLevel, string>> = {
  [TKAdminLevel.ADMIN1]: "core_v2/wrl_polbnd_adm1_a_unhcr/FeatureServer/0",
  [TKAdminLevel.ADMIN2]: "core_v2/wrl_polbnd_adm2_a_unhcr/FeatureServer/0"
};

async function queryAdmins(
  dbUrl: string,
  adminList: string[],
  primaryKey: string
): Promise<FeatureCollection> {
  const adminQuery =
    primaryKey + " in (" + adminList.map(adm => `'${adm}'`).join(", ") + ")";

  return await new ArcgisServerDataGetter(
    encodeURI(dbUrl),
    encodeURI(adminQuery),
    true,
    "geojson"
  ).getData();
}

export async function TKGetGeoBoundaries(
  dataset: TKDataset,
  spatialConfiguration: TKOpsmapSpatialConfiguration
): Promise<TKGeoDataset> {
  const before = Date.now();

  const geodataset: TKGeoDataset = {};
  for (const level of TKConfigurationModule.configuration.spatialConfiguration
    .adminLevelsMap) {
    if (DB_URL[level]) {
      // Admin
      const adminList = dataset.surveys.flatMap(survey =>
        (survey.boundaries[level] as TKBoundaries[]).map(x => x.pcode)
      );
      geodataset[level] = await queryAdmins(
        DB_URL[level] as string,
        adminList,
        spatialConfiguration.dbConfig[level]
      );
    }
  }

  console.log(
    `GeoBoundaries retrieved in ${(Date.now() - before) / 1000} seconds.`
  );

  return geodataset;
}
