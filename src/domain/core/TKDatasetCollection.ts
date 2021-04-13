import { TKDataset } from "./TKDataset"

export interface TKDatasetCollection {
    [fdf: string]: TKDataset;
}