// Informations to add in configuration

import { TKLabel } from "../utils/TKLabel";

// Union of interface if others are added
export type TKSiteMapVisualisation = TKSitePopulationMapVisualisation;

// Proportional circles based on population number
interface TKSitePopulationMapVisualisation {
  type: TKSiteMapVisualisationType.POPULATION_COUNT;
  field: string;
  label: TKLabel;
}

export enum TKSiteMapVisualisationType {
  SITE_TYPES = "siteTypes",
  POPULATION_COUNT = "populationCount"
}
