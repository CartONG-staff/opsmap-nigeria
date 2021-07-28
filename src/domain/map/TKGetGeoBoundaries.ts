import { TKSurveyCollection } from "@/domain/survey/TKSurveyCollection";
import { ArcgisServerDataGetter } from "@/domain/map/TKArcgisServerDataGetter";
import { TKGeoDataset } from "@/domain/map/TKGeoDataset";
import { FeatureCollection } from "geojson";

export async function TKGetGeoBoundaries(
  admin1: FeatureCollection,
  surveys: TKSurveyCollection
): Promise<TKGeoDataset> {
  let admin1List: string[] = [];
  for (const key in surveys) {
    surveys[key].boundariesList.admin1.map(x => admin1List.push(x.pcode));
  }
  admin1List = [...new Set(admin1List)];
  // const admin1GeoData = await new ArcgisServerDataGetter(
  //   encodeURI("core/wrl_adm1_polbnd_unhcr/FeatureServer/0"),
  //   `iso3 = '${iso3}'`,
  //   true,
  //   "geojson"
  // ).getData();

  let admin2WhereClause = "";
  admin1List.map(x => (admin2WhereClause += `adm1pcode = '${x}' OR `));
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
    console.log(admin1);
    
  return {
    admin1: admin1,
    admin2: admin2GeoData
  };
}
