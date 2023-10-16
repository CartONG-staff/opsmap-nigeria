// Informations to add in configuration
export interface TKSurveySitesMapVisualisation {
  label: string;
  visualisationType: TKSiteMapVisualisation;
}

// Union of interface if others are added
export type TKSiteMapVisualisation = TKSitePopulationMapVisualisation;

// Proportional circles based on population number
interface TKSitePopulationMapVisualisation {
  type: TKSiteMapVisualisationType.POPULATION_COUNT;
  field: string;
  color: string;
}

enum TKSiteMapVisualisationType {
  POPULATION_COUNT = "population_count"
}
