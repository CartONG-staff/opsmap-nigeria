import { FeatureCollection } from "geojson";
import { TKAdminLevel } from "../opsmapConfig/TKAdminLevel";

export type TKGeoDataset = {
  [key in TKAdminLevel]?: FeatureCollection;
};
