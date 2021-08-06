/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TKIndicatorsDescription,
  TKIndicatorDescription,
  TKIndicatorDescriptionSiteOccupation
} from "@/domain/opsmapConfig/TKIndicatorsDescription";
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
import { TKIndicator } from "@/domain/ui/TKIndicator";
import { TKLabel } from "../ui/TKLabel";
import { isNumber } from "@turf/turf";

// ////////////////////////////////////////////////////////////////////////////
//  Submission concept definition
// ////////////////////////////////////////////////////////////////////////////

export interface TKSubmission {
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
  descr: TKIndicatorDescription | TKIndicatorDescriptionSiteOccupation,
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
      const percent = Math.round(
        (peopleCount / maxPeopleCount) * 100
      ).toString();
      const valueLabel: TKLabel = {};
      for (const k in labelIsMaxCapacity) {
        valueLabel[k] = labelIsMaxCapacity[k] + " (" + percent + " %)";
      }
      return {
        iconOchaName: descr.iconOchaName,
        nameLabel: descr.name,
        valueLabel: valueLabel
      };
    } else {
      return {
        iconOchaName: descr.iconOchaName,
        nameLabel: descr.name,
        valueLabel: { en: "-" }
      };
    }
  } else {
    const label = getLabelForIndicator(data, descr.entryCode);
    return {
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
  surveyConfiguration: TKFDF,
  indicatorsDescription: TKIndicatorsDescription
): TKSubmission {
  const submission: Record<string, TKSubmissionThematic> = {};

  for (const thematic in surveyConfiguration.thematics) {
    submission[thematic] = TKCreateSubmissionThematic(
      surveyConfiguration.thematics[thematic]
    );
  }

  const currentChart: ChartData = {
    id: "",
    thematic: "",
    data: []
  };

  for (const key in surveyConfiguration.submissionsRules) {
    const rule = surveyConfiguration.submissionsRules[key];
    const value = submissionItem[rule.fieldName];

    // If charts
    if (rule.chartId) {
      // If exists chart
      if (currentChart.id && rule.chartId !== currentChart.id) {
        createChartInSubmission(currentChart, submission, surveyConfiguration);

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

      // accumulate
      currentChart.data.push({
        field: rule.fieldName,
        value: value,
        type: rule.chartData
      });
    }

    // If text item
    else {
      // If exists chart
      if (currentChart.id) {
        createChartInSubmission(currentChart, submission, surveyConfiguration);

        // Clear current submission
        currentChart.id = "";
        currentChart.thematic = "";
        currentChart.data = [];
      }

      if (value) {
        // push it before switching to text item
        submission[rule.thematicGroup].data.push(
          TKCreateSubmissionEntryText(
            value,
            rule.fieldName,
            surveyConfiguration
          )
        );
      }
    }
  }
  // }

  // if a current pyramid is ongoing - push it before ending
  if (currentChart.id) {
    createChartInSubmission(currentChart, submission, surveyConfiguration);
  }

  //  Solution to filter thematics if nothing has been answered. ////////////////////////
  const submissionFiltered: Record<string, TKSubmissionThematic> = {};
  for (const key in submission) {
    if (submission[key].data.length > 0) {
      submissionFiltered[key] = submission[key];
    }
  }

  return {
    thematics: submissionFiltered,
    indicators: [
      computeSubmissionIndicator(indicatorsDescription.site[0], submission),
      computeSubmissionIndicator(indicatorsDescription.site[1], submission),
      computeSubmissionIndicator(indicatorsDescription.site[2], submission)
    ]
  };
}
