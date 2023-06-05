import { FeatureCollection } from "geojson";
import { TKAdminLevel } from "../opsmapConfig/TKAdminLevel";

export type TKGeoDataset = Partial<Record<TKAdminLevel, FeatureCollection>>;
