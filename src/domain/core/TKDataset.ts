import { TKCampDescription } from "./TKCampDescription"
import { TKBoundariesCollection } from "./TKBoundariesCollection"

export interface TKDataset {
    submissionsByCamps: {[key: string]: object};
    campsList: TKCampDescription[];
    boundariesList: TKBoundariesCollection;
}

