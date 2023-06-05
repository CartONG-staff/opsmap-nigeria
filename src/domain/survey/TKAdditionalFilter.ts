import { TKGetLocalValue, TKLabel } from "../utils/TKLabel";
import { TKSite } from "./TKSite";
import { TKSubmissionEntryType } from "./TKSubmissionEntry";

export interface TKAdditionalFilterDescription {
  field: string;
  name: TKLabel;
}

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
      const entry = entries[filter.field];
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

export function applyAdditionalFilter(
  sites: TKSite[],
  filter: TKAdditionalFilter
): TKSite[] {
  return sites.filter(site => {
    if (!site.submissions.length) {
      return false;
    }
    const entry = site.submissions[0].entries[filter.description.field];
    if (!entry || entry.type !== TKSubmissionEntryType.TEXT) {
      return false;
    }

    const answerInEnglish = TKGetLocalValue(entry.answerLabel, "en");
    if (
      !filter.filterValues
        .map(value => TKGetLocalValue(value, "en"))
        .includes(answerInEnglish)
    ) {
      return false;
    }

    return true;
  });
}
