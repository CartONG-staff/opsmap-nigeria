export class ArcgisServerDatasetGetter {
  constructor(
    public dataService: number,
    public fieldsMatchingService: number
  ) {
    this.dataService = dataService;
    this.fieldsMatchingService = fieldsMatchingService;
  }

  async getData() {
    const urls = [
      `https://gis.unhcr.org/arcgis/rest/services/opsmap/by_country/MapServer/${this.dataService}/query?where=1=1&outFields=*&returnGeometry=false&f=json`,
      `https://gis.unhcr.org/arcgis/rest/services/opsmap/by_country/MapServer/${this.fieldsMatchingService}/query?where=1=1&outFields=*&returnGeometry=false&f=json`
    ];

    try {
      const data = await Promise.all(
        urls.map(async url => {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Error fetching ${url}: ${response.statusText}`);
          }
          return response.json();
        })
      );
      const dataset: any[] = [];

      // Assign original field name to each data feature
      data[0]?.features.forEach((feature: any) => {
        const attributes = feature.attributes;

        if (!attributes) return;

        // Create a matching table between original field names and source
        const mappingTable = data[1]?.features.reduce(
          (map: Record<string, string>, item: any) => {
            if (item.attributes?.in_db && item.attributes?.source) {
              map[item.attributes.in_db] = item.attributes.source;
            }
            return map;
          },
          {}
        );

        if (!mappingTable) return;

        for (const key in attributes) {
          if (mappingTable[key]) {
            attributes[mappingTable[key]] = attributes[key];
            delete attributes[key];
          }
        }

        dataset.push(attributes);
      });

      return dataset;
    } catch (error) {
      console.error("Error fetching opsmap data:", error);
    }
  }
}
