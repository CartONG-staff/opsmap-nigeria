import { TKSubmissionThematic } from "./TKSubmissionThematic";
import { TKIndicator } from "@/domain/core/TKIndicator";
export interface TKSubmission {
    thematics: Record<string, TKSubmissionThematic>;
    indicators: [TKIndicator, TKIndicator, TKIndicator];
}
