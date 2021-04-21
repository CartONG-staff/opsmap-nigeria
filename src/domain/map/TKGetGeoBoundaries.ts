import { TKSurveyCollection } from "@/domain/core/TKSurveyCollection";
import { ArcgisServerDataGetter } from "@/domain/map/TKArcgisServerDataGetter";
import { TKGeoDataset } from "@/domain/core/TKGeoDataset";
import { admin1 } from "@/secondary/map/admin";
export async function TKGetGeoBoundaries(
  surveys: TKSurveyCollection,
  iso3: string
): Promise<TKGeoDataset> {
  let admin1List: string[] = [];
  for (const key in surveys) {
    surveys[key].boundariesList.admin1.map((x) => admin1List.push(x.pcode));
  }
  admin1List = [...new Set(admin1List)];
  // const admin1GeoData = await new ArcgisServerDataGetter(
  //   encodeURI("core/wrl_adm1_polbnd_unhcr/FeatureServer/0"),
  //   `iso3 = '${iso3}'`,
  //   true,
  //   "geojson"
  // ).getData();

  let admin2WhereClause = "";
  admin1List.map((x) => (admin2WhereClause += `adm1pcode = '${x}' OR `));
  admin2WhereClause = admin2WhereClause.substring(
    0,
    admin2WhereClause.length - 3
  );
  const admin2GeoData = await new ArcgisServerDataGetter(
    encodeURI("core/wrl_adm2_polbnd_a_unhcr/FeatureServer/0"),
    encodeURI(admin2WhereClause),
    true,
    "geojson"
  ).getData();

  return {
    admin1: admin1,
    admin2: admin2GeoData,
  };
}
