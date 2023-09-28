import { TKSite } from "@/domain/survey/TKSite";
import { TKDataset } from "@/domain/survey/TKDataset";
import { TKSubmission } from "@/domain/survey/TKSubmission";
import {
  TKSubmissionEntry,
  TKSubmissionEntryType
} from "../../domain/survey/TKSubmissionEntry";
import { TKGetLocalValue } from "../../domain/utils/TKLabel";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import {
  applyVisualizerOptions,
  getEntriesForThematic
} from "@/domain/survey/TKSubmissionEntries";

// ////////////////////////////////////////////////////////////////////////////
// get trafficlight text
// ////////////////////////////////////////////////////////////////////////////

function getTrafficLightText(
  entry: TKSubmissionEntry,
  locale: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translationMethod: any
): string {
  if ("trafficLight" in entry && entry.trafficLight) {
    if (typeof entry.trafficLight.value.label === "string") {
      return translationMethod(entry.trafficLight.value.label).toString();
    } else {
      return TKGetLocalValue(entry.trafficLight.value.label, locale);
    }
  }
  return "";
}

// ////////////////////////////////////////////////////////////////////////////
// Helper methods
// ////////////////////////////////////////////////////////////////////////////

function computeCurrentSiteCSVContent(
  submission: TKSubmission,
  locale: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translationMethod: any
): string {
  if (submission) {
    const rows = [["thematic", "label", "value", "trafficlight"]];

    for (const thematic of submission.thematics) {
      const thematicName = TKGetLocalValue(thematic.nameLabel, locale);

      const entriesForThematic = applyVisualizerOptions(
        getEntriesForThematic(submission.entries, thematic)
      );

      for (const entry of entriesForThematic) {
        // TEXT
        if (entry.type === TKSubmissionEntryType.TEXT) {
          const itemName = TKGetLocalValue(entry.fieldLabel, locale);
          const answer = TKGetLocalValue(entry.answerLabel, locale).replaceAll(
            ";",
            ","
          );
          const trafficLight = getTrafficLightText(
            entry,
            locale,
            translationMethod
          );
          rows.push([thematicName, itemName, answer, trafficLight]);
        }
        // BULLET
        else if (entry.type === TKSubmissionEntryType.BULLET) {
          const itemName = TKGetLocalValue(entry.fieldLabel, locale);
          const answer = entry.answersLabels
            .map(label => TKGetLocalValue(label, locale).replaceAll(";", ","))
            .join(", ");
          const trafficLight = getTrafficLightText(
            entry,
            locale,
            translationMethod
          );
          rows.push([thematicName, itemName, answer, trafficLight]);
        }
        // CHART_PYRAMID
        else if (entry.type === TKSubmissionEntryType.CHART_PYRAMID) {
          const itemName = "age_pyramid";
          for (const [index, value] of entry.malesEntries.entries()) {
            const chartItemName =
              itemName +
              " -- " +
              TKGetLocalValue(entry.malesLabels[index], locale);
            rows.push([thematicName, chartItemName, value.toString(), ""]);
          }

          for (const [index, value] of entry.femalesEntries.entries()) {
            const chartItemName =
              itemName +
              " -- " +
              TKGetLocalValue(entry.femalesLabels[index], locale);
            rows.push([thematicName, chartItemName, value.toString(), ""]);
          }
        }
      }

      // Inser indicators right after group_general_info
      if (thematic.id === "group_general_info") {
        for (const index in submission.indicators) {
          const thematicName = "indicators";

          const label = submission.indicators[index].nameLabel;
          let field = "";
          if (typeof label === "string") {
            field = translationMethod(label).toString();
          } else {
            field = TKGetLocalValue(label, locale);
          }
          const value = TKGetLocalValue(
            submission.indicators[index].valueLabel,
            locale
          );
          rows.push([thematicName, field, value, ""]);
        }
      }
    }

    return (
      "data:text/csv;charset=utf-8," + rows.map(e => e.join(";")).join("\n")
    );
  }

  return JSON.stringify([]);
}

// ////////////////////////////////////////////////////////////////////////////
// Helper methods
// ////////////////////////////////////////////////////////////////////////////

function computeCurrentSelectionCSVContent(
  sites: TKSite[],
  locale: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translationMethod: any
): string {
  const adminRef: Array<string> =
    TKConfigurationModule.configuration.spatial.adminLevels;

  const rows = [["name", ...adminRef, "submissionDate"]];

  const firstSubmission =
    sites.length && sites[0].submissions.length
      ? sites[0].submissions[0]
      : null;

  if (firstSubmission) {
    // FILL HEADER

    for (const indicator of firstSubmission.indicators) {
      const label = indicator.nameLabel;
      let field = "";
      if (typeof label === "string") {
        field = translationMethod(label).toString();
      } else {
        field = TKGetLocalValue(label, locale);
      }
      rows[0].push("Indicator/" + field);
    }
    for (const thematic of firstSubmission.thematics) {
      const entriesForThematic: Array<TKSubmissionEntry> = Object.values(
        firstSubmission
      ).filter(entry => entry.thematic.id === thematic.id);
      for (const entry of entriesForThematic) {
        switch (entry.type) {
          case TKSubmissionEntryType.TEXT:
          case TKSubmissionEntryType.BULLET:
            rows[0].push(
              TKGetLocalValue(thematic.nameLabel, locale) +
                "/" +
                TKGetLocalValue(entry.fieldLabel, locale)
            );
            break;
          case TKSubmissionEntryType.CHART_PYRAMID:
          case TKSubmissionEntryType.CHART_DOUGHNUT:
          case TKSubmissionEntryType.CHART_POLAR:
          case TKSubmissionEntryType.CHART_RADAR:
            rows[0].push(
              TKGetLocalValue(thematic.nameLabel, locale) +
                "/" +
                TKGetLocalValue(entry.title, locale)
            );
            break;
          default:
            break;
        }
      }
    }
  }
  for (const site of sites) {
    for (const submission of site.submissions) {
      const adminRows: Array<string> = Object.values(site.admins).map(
        boundaries => boundaries?.name ?? ""
      );
      const row = [site.name, ...adminRows, submission.date.toString()];

      for (const indicator of submission.indicators) {
        row.push(TKGetLocalValue(indicator.valueLabel, locale));
      }

      for (const thematic of submission.thematics) {
        const entriesForThematic = getEntriesForThematic(
          submission.entries,
          thematic
        );
        for (const entry of entriesForThematic) {
          let val = "";
          switch (entry.type) {
            case TKSubmissionEntryType.TEXT:
              row.push(
                TKGetLocalValue(entry.answerLabel, locale).replaceAll(";", ",")
              );
              break;
            case TKSubmissionEntryType.BULLET:
              row.push(
                entry.answersLabels
                  .map(label =>
                    TKGetLocalValue(label, locale).replaceAll(";", ",")
                  )
                  .join(", ")
              );
              break;
            case TKSubmissionEntryType.CHART_PYRAMID:
              val =
                "females:" +
                entry.femalesEntries.join(",") +
                " males:" +
                entry.malesEntries.join(",");
              row.push(val);
              break;
            case TKSubmissionEntryType.CHART_DOUGHNUT:
            case TKSubmissionEntryType.CHART_POLAR:
              row.push(
                entry.entries
                  .map(
                    entry =>
                      TKGetLocalValue(entry.label, locale) + ":" + entry.value
                  )
                  .join(",")
              );
              break;
            default:
              break;
          }
        }
      }

      rows.push(row);
    }
  }

  return "data:text/csv;charset=utf-8," + rows.map(e => e.join(";")).join("\n");
}

// ////////////////////////////////////////////////////////////////////////////
// Temaplted Read method for csv inputs
// ////////////////////////////////////////////////////////////////////////////

export function TKCSVWrite(
  dataset: TKDataset,
  filename: string,
  locale: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translationMethod: any
) {
  if (dataset.currentSubmission) {
    const csvContent = computeCurrentSiteCSVContent(
      dataset.currentSubmission,
      locale,
      translationMethod
    );
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename); // filename
    document.body.appendChild(link); // Required for FF ?
    link.click();
  }
}

// ////////////////////////////////////////////////////////////////////////////
// Temaplted Read method for csv inputs
// ////////////////////////////////////////////////////////////////////////////

export function TKCSVWriteCurrentSelection(
  dataset: TKDataset,
  filename: string,
  locale: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translationMethod: any
) {
  const csvContent = computeCurrentSelectionCSVContent(
    dataset.filteredTypedSitesList,
    locale,
    translationMethod
  );
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename); // filename
  document.body.appendChild(link); // Required for FF ?
  link.click();
}
