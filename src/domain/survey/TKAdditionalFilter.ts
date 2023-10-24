import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import { TKGetLocalValue, TKLabel } from "@/domain/utils/TKLabel";
import { TKSite } from "./TKSite";
import { TKSubmissionEntryTextType } from "./TKSubmissionEntry";

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
      if (entry.type !== TKSubmissionEntryTextType.TEXT) {
        continue;
      }
      const key = TKGetLocalValue(
        entry.answerLabel,
        TKConfigurationModule.configuration.locale.default
      );
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
    if (!entry || entry.type !== TKSubmissionEntryTextType.TEXT) {
      return false;
    }

    const answerInDefaultLocale = TKGetLocalValue(
      entry.answerLabel,
      TKConfigurationModule.configuration.locale.default
    );
    if (
      !filter.filterValues
        .map(value =>
          TKGetLocalValue(
            value,
            TKConfigurationModule.configuration.locale.default
          )
        )
        .includes(answerInDefaultLocale)
    ) {
      return false;
    }

    return true;
  });
}
