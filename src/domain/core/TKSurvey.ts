import { TKCampDescription } from "./TKCampDescription"
import { TKBoundariesCollection } from "./TKBoundariesCollection"
import { TKSubmission } from "./TKSubmission";
export interface TKSurvey {
    submissionsByCamps: {[campId: string]: {[date: string]: TKSubmission};};
    campsList: TKCampDescription[];
    boundariesList: TKBoundariesCollection;
}

