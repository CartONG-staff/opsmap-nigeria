import { TKCampDescription } from "./TKCampDescription"
import { TKBoundariesCollection } from "./TKBoundariesCollection"
import { TKSubmissions } from "./TKSubmissions";
export interface TKSurvey {
    submissionsByCamps: {[campId: string]: TKSubmissions};
    campsList: TKCampDescription[];
    boundariesList: TKBoundariesCollection;
}

