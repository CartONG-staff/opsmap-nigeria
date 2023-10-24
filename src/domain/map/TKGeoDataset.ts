import { FeatureCollection } from "geojson";
import { TKAdminLevel } from "@/domain/opsmapConfig/TKAdminLevel";

export type TKGeoDataset = Partial<Record<TKAdminLevel, FeatureCollection>>;
