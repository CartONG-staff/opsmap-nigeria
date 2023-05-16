import { TKGetLocalValue, TKLabel } from "../utils/TKLabel";
import { TKSite } from "./TKSite";
import { TKSubmissionEntryType } from "./TKSubmissionEntry";

export type TKAdditionalFilterDescription = string;

export interface TKAdditionalFilter {
  description: TKAdditionalFilterDescription;
  candidates: TKLabel[];
  filterValues: TKLabel[];
}

export function computeAdditionalFilterCandidates(
  sites: TKSite[],
  filter: TKAdditionalFilterDescription
): TKLabel[] {
  const labels: TKLabel[] = [];
  const labelsUnique: string[] = [];
  for (const site of sites) {
    for (const submissions of site.submissions) {
      const entries = submissions.entries;
      const entry = entries[filter];
      if (!entry) {
        continue;
      }
      if (entry.type !== TKSubmissionEntryType.TEXT) {
        continue;
      }
      const key = TKGetLocalValue(entry.answerLabel, "en");
      if (!labelsUnique.includes(key)) {
        labelsUnique.push(key);
        labels.push(entry.answerLabel);
      }
    }
  }

  return labels;
}
