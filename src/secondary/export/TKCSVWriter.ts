import { TKSite } from "@/domain/survey/TKSite";
import { TKDataset } from "@/domain/survey/TKDataset";
import { TKSubmission } from "@/domain/survey/TKSubmission";
import {
  TKSubmissionEntry,
  TKSubmissionEntryTextType
} from "@/domain/survey/TKSubmissionEntry";
import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import {
  applyVisualizerOptions,
  getEntriesForThematic
} from "@/domain/survey/TKSubmissionEntries";
import { TKFDFChartType } from "@/domain/fdf/TKFDFCharts/TKFDFChartConfiguration";

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
    // console.log("-");
    // console.log(translationMethod("trafficlight.ok"));
    // console.log("------");
    if (typeof entry.trafficLight.value.label == "string") {
      // return translationMethod(entry.trafficLight.value.label).toString();
      return entry.trafficLight.value.label;
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
        if (entry.type === TKSubmissionEntryTextType.TEXT) {
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
        else if (entry.type === TKSubmissionEntryTextType.BULLET) {
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
        else if (entry.type === TKFDFChartType.AGE_PYRAMID) {
          const itemName = "age_pyramid";
          // Iterate through labels index
          for (const entryType in entry.values) {
            const config = entry.config.population.find(
              item => item.id === entryType
            );

            if (config) {
              const configName =
                typeof config.label == "string"
                  ? config.label //translationMethod(config.label, locale)
                  : TKGetLocalValue(config.label, locale);
              for (let i = 0; i < entry.labels.length; i++) {
                // iterate through fields
                const labelBefore = entry.labels[i];
                const label =
                  typeof labelBefore == "string"
                    ? labelBefore // translationMethod(entry.labels[i], locale)
                    : TKGetLocalValue(labelBefore, locale);
                const chartItemName =
                  itemName + " -- " + configName + " " + label;
                rows.push([
                  thematicName,
                  chartItemName,
                  entry.values[entryType][i].toString(),
                  ""
                ]);
              }
            }
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
      ).filter(entry => entry.thematic && entry.thematic.id === thematic.id);
      for (const entry of entriesForThematic) {
        switch (entry.type) {
          case TKSubmissionEntryTextType.TEXT:
          case TKSubmissionEntryTextType.BULLET:
            rows[0].push(
              TKGetLocalValue(thematic.nameLabel, locale) +
                "/" +
                TKGetLocalValue(entry.fieldLabel, locale)
            );
            break;
          case TKFDFChartType.AGE_PYRAMID:
          case TKFDFChartType.DOUGHNUT:
          case TKFDFChartType.POLAR_AREA:
          case TKFDFChartType.RADAR:
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
            case TKSubmissionEntryTextType.TEXT:
              row.push(
                TKGetLocalValue(entry.answerLabel, locale).replaceAll(";", ",")
              );
              break;
            case TKSubmissionEntryTextType.BULLET:
              row.push(
                entry.answersLabels
                  .map(label =>
                    TKGetLocalValue(label, locale).replaceAll(";", ",")
                  )
                  .join(", ")
              );
              break;
            case TKFDFChartType.AGE_PYRAMID:
              val = Object.keys(entry.values)
                .map(key => {
                  return (
                    key +
                    ":" +
                    entry.values[key].map(value => value.toString()).join(",")
                  );
                })
                .join(" ");
              row.push(val);
              break;
            case TKFDFChartType.DOUGHNUT:
            case TKFDFChartType.POLAR_AREA:
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
