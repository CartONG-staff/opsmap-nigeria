import { TKCamp } from "@/domain/survey/TKCamp";
import { TKDataset } from "@/domain/survey/TKDataset";
import { TKSubmission } from "@/domain/survey/TKSubmission";
import { TKSubmissionEntryType } from "../../domain/survey/TKSubmissionEntry";
import { TKGetLocalValue } from "../../domain/utils/TKLabel";

// ////////////////////////////////////////////////////////////////////////////
// Helper methods
// ////////////////////////////////////////////////////////////////////////////

function computeCurrentCampCSVContent(
  submission: TKSubmission,
  locale: string
): string {
  if (submission) {
    const rows = [["thematic", "label", "value", "trafficlight"]];

    for (const thematic in submission.thematics) {
      const thematicName = TKGetLocalValue(
        submission.thematics[thematic].nameLabel,
        locale
      );

      for (const submissionItem in submission.thematics[thematic].data) {
        const item = submission.thematics[thematic].data[submissionItem];
        if (item.type === TKSubmissionEntryType.TEXT) {
          const itemName = TKGetLocalValue(item.fieldLabel, locale);
          const answer = TKGetLocalValue(item.answerLabel, locale).replaceAll(
            ";",
            ","
          );
          const trafficlight = item.trafficLight ? item.trafficLightColor : "";

          rows.push([thematicName, itemName, answer, trafficlight]);
        } else if (item.type === TKSubmissionEntryType.CHART_PYRAMID) {
          const itemName = "age_pyramid";
          for (const [index, value] of item.malesEntries.entries()) {
            const chartItemName =
              itemName +
              " -- " +
              TKGetLocalValue(item.malesLabels[index], locale);
            rows.push([thematicName, chartItemName, value.toString(), ""]);
          }

          for (const [index, value] of item.femalesEntries.entries()) {
            const chartItemName =
              itemName +
              " -- " +
              TKGetLocalValue(item.femalesLabels[index], locale);
            rows.push([thematicName, chartItemName, value.toString(), ""]);
          }
        }
      }

      // Inser indicators right after group_general_info
      if (thematic === "group_general_info") {
        for (const index in submission.indicators) {
          const thematicName = "indicators";
          const field = TKGetLocalValue(
            submission.indicators[index].nameLabel,
            locale
          );
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
  camps: TKCamp[],
  locale: string
): string {
  const rows = [["name", "admin1", "admin2", "admin3", "submissionDate"]];
  for (const camp of camps) {
    for (const submission of camp.submissions) {
      rows.push([
        camp.name,
        camp.admin1.name,
        camp.admin2.name,
        camp.admin3.name,
        submission.date.toString()
      ]);
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
  locale: string
) {
  if (dataset.currentSubmission) {
    const csvContent = computeCurrentCampCSVContent(
      dataset.currentSubmission,
      locale
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
  locale: string
) {
  const csvContent = computeCurrentSelectionCSVContent(
    dataset.filteredTypedCampsList,
    locale
  );
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename); // filename
  document.body.appendChild(link); // Required for FF ?
  link.click();
}
