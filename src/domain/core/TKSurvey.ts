import { TKCampDescription } from "./TKCampDescription"
import { TKBoundariesCollection } from "./TKBoundariesCollection"
import { TKSubmissions } from "./TKSubmissions";
export interface TKSurvey {
    submissionsByCamps: {[campId: string]: {[date: string]: TKSubmissions};};
    campsList: TKCampDescription[];
    boundariesList: TKBoundariesCollection;
}

