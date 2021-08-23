/* eslint-disable @typescript-eslint/no-explicit-any */
import { TKFDF } from "@/domain/fdf/TKFDF";
import {
  TKCreateSubmissionEntryText,
  TKSubmissionEntryPolar,
  TKSubmissionEntryDoughnut,
  TKSubmissionEntryAgePyramid
} from "./TKSubmissionEntry";
import {
  TKSubmissionThematic,
  TKCreateSubmissionThematic
} from "./TKSubmissionThematic";
import { TKIndicator } from "@/domain/survey/TKIndicator";
import { TKLabel } from "../utils/TKLabel";
import { isNumber } from "@turf/turf";
import { TKFDFSubmissionItemType } from "../fdf/TKFDFSubmissionsRules";
import { TKCompare, TKCompute } from "../utils/TKOperator";
import { TKOperatorComputation } from "../utils/TKOperator";
import { TKOperatorComparison } from "../utils/TKOperator";
import {
  TKFDFIndicatorSiteOccupation,
  TKFDFIndicatorStandard
} from "../fdf/TKFDFIndicators";

// ////////////////////////////////////////////////////////////////////////////
//  Submission concept definition
// ////////////////////////////////////////////////////////////////////////////

export interface TKSubmission {
  date: string;
  thematics: Record<string, TKSubmissionThematic>;
  indicators: [TKIndicator, TKIndicator, TKIndicator];
}

// ////////////////////////////////////////////////////////////////////////////
// indicators management
// ////////////////////////////////////////////////////////////////////////////

function getValueForIndicator(
  data: Record<string, TKSubmissionThematic>,
  entryCode: string
): number | undefined {
  for (const thematic in data) {
    const them = data[thematic];
    const item = them.data.find(
      item => item.type === "text" && item.field === entryCode
    );
    if (
      item &&
      item.type === "text" &&
      item.answerLabel &&
      isNumber(item.answerLabel.en)
    ) {
      return Number(item.answerLabel.en);
    }
  }
  return undefined;
}

function getLabelForIndicator(
  data: Record<string, TKSubmissionThematic>,
  entryCode: string
): TKLabel {
  for (const thematic in data) {
    const them = data[thematic];
    const item = them.data.find(
      item => item.type === "text" && item.field === entryCode
    );
    if (item && item.type === "text" && item.answerLabel) {
      return item.answerLabel;
    }
  }
  return { en: "-" };
}
function computeSubmissionIndicator(
  descr: TKFDFIndicatorStandard | TKFDFIndicatorSiteOccupation,
  data: Record<string, TKSubmissionThematic>
): TKIndicator {
  if (descr.type === "site_occupation") {
    const labelIsMaxCapacity = getLabelForIndicator(
      data,
      descr.entryCodeMaxCapacity
    );

    // Should be two integers
    const peopleCount = getValueForIndicator(data, descr.entryCodePeopleCount);
    const maxPeopleCount = getValueForIndicator(
      data,
      descr.entryCodeMaxPeopleCount
    );

    if (
      peopleCount !== undefined &&
      maxPeopleCount !== undefined &&
      maxPeopleCount !== 0
    ) {
      const percentValue = Math.round((peopleCount / maxPeopleCount) * 100);
      const percentText = percentValue.toString();
      const valueLabel: TKLabel = {};
      for (const k in labelIsMaxCapacity) {
        valueLabel[k] = labelIsMaxCapacity[k] + " (" + percentText + "%)";
      }
      return {
        type: descr.type,
        iconOchaName: descr.iconOchaName,
        nameLabel: descr.name,
        valueNumber: percentValue,
        valueLabel: valueLabel,
        valueYesNoLabel: labelIsMaxCapacity
      };
    } else {
      return {
        type: descr.type,
        iconOchaName: descr.iconOchaName,
        nameLabel: descr.name,
        valueLabel: { en: "-" },
        valueNumber: -1,
        valueYesNoLabel: { en: "-" }
      };
    }
  } else {
    const label = getLabelForIndicator(data, descr.entryCode);
    return {
      type: descr.type,
      iconOchaName: descr.iconOchaName,
      nameLabel: descr.name,
      valueLabel: label
    };
  }
}

// ////////////////////////////////////////////////////////////////////////////
// Create the chart associated to the submission
// ////////////////////////////////////////////////////////////////////////////

type ChartData = {
  id: string;
  thematic: string;
  data: Array<{
    field: string;
    value: string;
    type: string;
  }>;
};

function createChartInSubmission(
  chartData: ChartData,
  submission: Record<string, TKSubmissionThematic>,
  surveyConfiguration: TKFDF
) {
  if (chartData.id.includes("age_pyramid")) {
    const malesEntries = chartData.data
      .filter(item => item.type === "m")
      .reverse();
    const femalesEntries = chartData.data
      .filter(item => item.type === "f")
      .reverse();

    const entry: TKSubmissionEntryAgePyramid = {
      type: "age_pyramid",
      chartid: chartData.id,
      isAnswered: true,
      title: surveyConfiguration.fieldsLabels[chartData.id],
      malesEntries: malesEntries.map(item => Number(item.value)),
      femalesEntries: femalesEntries.map(item => Number(item.value)),
      malesLabels: malesEntries.map(
        item => surveyConfiguration.fieldsLabels[item.field]
      ),
      femalesLabels: femalesEntries.map(
        item => surveyConfiguration.fieldsLabels[item.field]
      )
    };
    submission[chartData.thematic].data.push(entry);
  } else if (chartData.id.includes("doughnut")) {
    const entry: TKSubmissionEntryDoughnut = {
      type: "doughnut",
      chartid: chartData.id,
      isAnswered: true,
      title: surveyConfiguration.fieldsLabels[chartData.id],
      entries: chartData.data.map(item => {
        return {
          value: Number(item.value),
          label: surveyConfiguration.fieldsLabels[item.field]
        };
      })
    };
    submission[chartData.thematic].data.push(entry);
  } else if (chartData.id.includes("polar_area_chart")) {
    const entry: TKSubmissionEntryPolar = {
      type: "polar",
      chartid: chartData.id,
      isAnswered: true,
      title: surveyConfiguration.fieldsLabels[chartData.id],
      entries: chartData.data.map(item => {
        return {
          value: Number(item.value),
          label: surveyConfiguration.fieldsLabels[item.field]
        };
      })
    };
    submission[chartData.thematic].data.push(entry);
  }
}

// ////////////////////////////////////////////////////////////////////////////
// Create the submission
// ////////////////////////////////////////////////////////////////////////////

export function TKCreateSubmission(
  submissionItem: Record<string, string>,
  fdf: TKFDF,
  languages: string[]
): TKSubmission {
  // Init all the thematics
  const submission: Record<string, TKSubmissionThematic> = {};
  for (const thematic in fdf.thematics) {
    submission[thematic] = TKCreateSubmissionThematic(fdf.thematics[thematic]);
  }

  // Init chart
  const currentChart: ChartData = {
    id: "",
    thematic: "",
    data: []
  };

  for (const key in fdf.submissionsRules) {
    const rule = fdf.submissionsRules[key];

    // Handle display status
    let display = true;
    if (rule.displayCondition) {
      try {
        display = TKCompare(
          submissionItem[rule.displayCondition.field],
          rule.displayCondition.operator as TKOperatorComparison,
          rule.displayCondition.value
        );
      } catch (error) {
        display = false;
      }
    }
    if (display) {
      // If charts
      if (rule.chartId) {
        const value = submissionItem[rule.fieldName];

        // If exists chart
        if (currentChart.id && rule.chartId !== currentChart.id) {
          createChartInSubmission(currentChart, submission, fdf);

          // Clear current submission
          currentChart.id = "";
          currentChart.thematic = "";
          currentChart.data = [];
        }

        // Init currentChart
        if (!currentChart.id) {
          currentChart.id = rule.chartId;
          currentChart.thematic = rule.thematicGroup;
          currentChart.data = [];
        }

        // Accumulate Chart data
        currentChart.data.push({
          field: rule.fieldName,
          value: value,
          type: rule.chartData
        });
      }

      // If text item
      else {
        let value = undefined;
        try {
          if (rule.type === TKFDFSubmissionItemType.COMPUTED && rule.computed) {
            value = Math.round(
              TKCompute(
                Number(submissionItem[rule.computed.field1]),
                rule.computed.operator as TKOperatorComputation,
                Number(submissionItem[rule.computed.field2])
              )
            ).toString();
          } else {
            value = submissionItem[rule.fieldName];
          }
        } catch (error) {
          value = "-";
        }
        if (value) {
          // If exists chart
          if (currentChart.id) {
            createChartInSubmission(currentChart, submission, fdf);

            // Clear current submission
            currentChart.id = "";
            currentChart.thematic = "";
            currentChart.data = [];
          }
          // push it before switching to text item
          submission[rule.thematicGroup].data.push(
            TKCreateSubmissionEntryText(value, rule.fieldName, fdf, languages)
          );
        }
      }
    }
  }

  // if a current pyramid is ongoing - push it before ending
  if (currentChart.id) {
    createChartInSubmission(currentChart, submission, fdf);
  }

  //  Solution to filter thematics if nothing has been answered. ////////////////////////
  const submissionFiltered: Record<string, TKSubmissionThematic> = {};
  for (const key in submission) {
    if (submission[key].data.length > 0) {
      submissionFiltered[key] = submission[key];
    }
  }

  return {
    date: submissionItem[fdf.spatialDescription.siteLastUpdateField],
    thematics: submissionFiltered,
    indicators: [
      computeSubmissionIndicator(fdf.indicators.site[0], submission),
      computeSubmissionIndicator(fdf.indicators.site[1], submission),
      computeSubmissionIndicator(fdf.indicators.site[2], submission)
    ]
  };
}
