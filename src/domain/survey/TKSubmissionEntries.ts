import TKVisualizerOptionsModule from "@/store/modules/visualizeroptions/TKVisualizerOptionsModule";
import { TKSubmissionEntry, TKSubmissionEntryType } from "./TKSubmissionEntry";
import { TKSubmissionThematic } from "./TKSubmissionThematic";
import { UNDEFINED_RANK_VALUE } from "../fdf/TKFDFTrafficLights/TKFDFTrafficLightRank";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type TKSubmissionEntries = Record<string, TKSubmissionEntry>;

// ////////////////////////////////////////////////////////////////////////////
// helper: entries for thematic
// ////////////////////////////////////////////////////////////////////////////

export function getEntriesForThematic(
  entries: TKSubmissionEntries,
  thematic: TKSubmissionThematic
): Array<TKSubmissionEntry> {
  return Object.values(entries).filter(
    entry => entry.thematic.id === thematic.id
  );
}

// ////////////////////////////////////////////////////////////////////////////
// helper:Sorting
// ////////////////////////////////////////////////////////////////////////////

function sortEntriesByTrafficLight(
  entries: TKSubmissionEntry[]
): TKSubmissionEntry[] {
  return [...entries].sort(
    (a: TKSubmissionEntry, b: TKSubmissionEntry): number => {
      const rankA =
        "trafficLight" in a && a.trafficLight
          ? a.trafficLight?.rank
          : UNDEFINED_RANK_VALUE;
      const rankB =
        "trafficLight" in b && b.trafficLight
          ? b.trafficLight?.rank
          : UNDEFINED_RANK_VALUE;

      if (rankA < rankB) {
        return 1;
      }
      if (rankA === rankB) {
        return 0;
      }
      return -1;
    }
  );
}

// ////////////////////////////////////////////////////////////////////////////
// helper: search
// ////////////////////////////////////////////////////////////////////////////

function filterEntriesBySearch(
  entries: TKSubmissionEntry[],
  searchFilter: string
): TKSubmissionEntry[] {
  return entries.filter((entry: TKSubmissionEntry) => {
    if (entry.type !== TKSubmissionEntryType.TEXT) {
      return true;
    }
    for (const value of Object.values(entry.answerLabel)) {
      if (value.toLowerCase().includes(searchFilter)) {
        return true;
      }
    }
    for (const value of Object.values(entry.fieldLabel)) {
      if (value.toLowerCase().includes(searchFilter)) {
        return true;
      }
    }

    return false;
  });
}

// ////////////////////////////////////////////////////////////////////////////
// helper: filter not answered
// ////////////////////////////////////////////////////////////////////////////

function filterEntriesNotAnswered(
  entries: TKSubmissionEntry[]
): TKSubmissionEntry[] {
  return entries.filter((entry: TKSubmissionEntry) => {
    return entry.isAnswered;
  });
}

// ////////////////////////////////////////////////////////////////////////////
// helper: visualizer options
// ////////////////////////////////////////////////////////////////////////////

export function applyVisualizerOptions(
  entries: TKSubmissionEntry[]
): TKSubmissionEntry[] {
  const hideUnanswered = TKVisualizerOptionsModule.hideUnanswered;
  const sortByTrafficLight = TKVisualizerOptionsModule.sortByTrafficLight;
  const searchFilter = TKVisualizerOptionsModule.searchFilter.toLowerCase();

  let entriesProcessed = entries;
  if (sortByTrafficLight) {
    entriesProcessed = sortEntriesByTrafficLight(entries);
  } else {
    entriesProcessed = entries;
  }
  if (searchFilter) {
    entriesProcessed = filterEntriesBySearch(
      entriesProcessed,
      searchFilter.toLowerCase()
    );
  }
  if (hideUnanswered) {
    entriesProcessed = filterEntriesNotAnswered(entriesProcessed);
  }
  return entriesProcessed;
}
