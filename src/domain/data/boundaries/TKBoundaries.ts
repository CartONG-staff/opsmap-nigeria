export async function TKRetrieveAdmin0Boundaries(iso3: string) {
  // 15m - instant
  const request =
    "https://gis.unhcr.org/arcgis/rest/services/core/core_prod/MapServer/7/query?where=iso_3+%3D+%27" +
    iso3 +
    "%27&outFields=*&f=geojson";
  // 1m - few secs
  // const request = 'https://gis.unhcr.org/arcgis/rest/services/core/core_prod/MapServer/6/query?where=iso3+%3D+%27' + iso3 + '%27&outFields=*&f=geojson';

  const boundaries = await fetch(request);

  return boundaries.json();
}

// async function TKRetrieveLGABoundaries(iso3: string) {
//     const request = 'https://gis.unhcr.org/arcgis/rest/services/core/wrl_adm1_polbnd_unhcr/FeatureServer/0/query?where=iso3+%3D+%27' + iso3 + '%27&outFields=*&f=geojson';
//     const boundaries = await fetch(request);
//     return boundaries.json();
// }
