import { ArcgisServerDataGetter } from "@/secondary/arcgis/TKArcgisServerDataGetter";
import { TKGeoDataset } from "@/domain/map/TKGeoDataset";
import { TKDataset } from "@/domain/survey/TKDataset";
import { TKFDFSpatialDescription } from "@/domain/fdf/TKFDFSpatialDescription";

function computeAdmin1Query(admin1List: string[], adm1Ref: string): string {
  return admin1List.map(adm1 => `${adm1Ref} = '${adm1}'`).join(" OR ");
}

function computeAdmin2Query(
  admin1List: string[],
  adm2RefInAdm1: string
): string {
  let admin2WhereClause = "";
  admin1List.map(x => (admin2WhereClause += `${adm2RefInAdm1} = '${x}' OR `));
  admin2WhereClause = admin2WhereClause.substring(
    0,
    admin2WhereClause.length - 3
  );
  return admin2WhereClause;
}

export async function TKGetGeoBoundaries(
  dataset: TKDataset,
  spatialDescription: TKFDFSpatialDescription
): Promise<TKGeoDataset> {
  const before = Date.now();

  // Get full admin1 List
  let admin1List: string[] = [];
  for (const survey of dataset.surveys) {
    survey.boundaries.admin1.map(x => admin1List.push(x.pcode));
  }
  admin1List = [...new Set(admin1List)];

  const admin1Query = computeAdmin1Query(admin1List, "pcode");
  const admin1GeoData = await new ArcgisServerDataGetter(
    encodeURI("core/wrl_adm1_polbnd_a_unhcr/FeatureServer/0"),
    encodeURI(admin1Query),
    true,
    "geojson"
  ).getData();

  // Get Admin2 from unhcr server
  const admin2Query = computeAdmin2Query(
    [...new Set(admin1List)],
    spatialDescription.adm2RefInAdm1
  );
  const admin2GeoData = await new ArcgisServerDataGetter(
    encodeURI("core/wrl_adm2_polbnd_a_unhcr/FeatureServer/0"),
    encodeURI(admin2Query),
    true,
    "geojson"
  ).getData();

  console.log(
    `GeoBoundaries retrieved in ${(Date.now() - before) / 1000} seconds.`
  );

  return {
    admin1: admin1GeoData,
    admin2: admin2GeoData
  };
}
