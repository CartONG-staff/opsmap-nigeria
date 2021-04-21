import { TKCampDescription } from "./TKCampDescription"
import { TKBoundariesCollection } from "./TKBoundariesCollection"
import { TKSubmission } from "./TKSubmission";
import { TKIndicator } from "../ui/TKIndicator";
export interface TKSurvey {
    submissionsByCamps: {[campId: string]: {[date: string]: TKSubmission};};
    campsList: TKCampDescription[];
    boundariesList: TKBoundariesCollection;
    indicators: [TKIndicator, TKIndicator, TKIndicator];
}

