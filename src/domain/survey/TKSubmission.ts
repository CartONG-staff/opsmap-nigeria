/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TKIndicatorsDescription,
  TKIndicatorDescription,
  TKIndicatorDescriptionSiteOccupation
} from "@/domain/opsmapConfig/TKIndicatorsDescription";
import { TKFDF } from "@/domain/fdf/TKFDF";
import {
  TKCreateSubmissionEntryAgePyramid,
  TKSubmissionEntryAgePyramidItem,
  TKCreateSubmissionEntryText,
  TKCreateSubmissionEntryDoughnut,
  TKSubmissionEntryDoughnutItem,
  TKSubmissionEntryPolarItem,
  TKCreateSubmissionEntryPolar
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

function getValue(
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

function getLabel(
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
    const labelIsMaxCapacity = getLabel(data, descr.entryCodeMaxCapacity);

    // Should be two integers
    const peopleCount = getValue(data, descr.entryCodePeopleCount);
    const maxPeopleCount = getValue(data, descr.entryCodeMaxPeopleCount);

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
    const label = getLabel(data, descr.entryCode);
    return {
      iconOchaName: descr.iconOchaName,
      nameLabel: descr.name,
      valueLabel: label
    };
  }
}

function computeSubmissionIndicators(
  descr: TKIndicatorsDescription,
  data: Record<string, TKSubmissionThematic>
): [TKIndicator, TKIndicator, TKIndicator] {
  return [
    computeSubmissionIndicator(descr.site[0], data),
    computeSubmissionIndicator(descr.site[1], data),
    computeSubmissionIndicator(descr.site[2], data)
  ];
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

  let agePyramidThematic = "";
  let agePyramidId = "";
  let agePyramidData: Array<TKSubmissionEntryAgePyramidItem> = [];

  let doughnutThematic = "";
  let doughnutId = "";
  let doughnutData: Array<TKSubmissionEntryDoughnutItem> = [];

  let polarThematic = "";
  let polarId = "";
  let polarData: Array<TKSubmissionEntryPolarItem> = [];

  for (const key in surveyConfiguration.submissionsRules) {
    const rule = surveyConfiguration.submissionsRules[key];
    const value = submissionItem[rule.fieldName];

    if (value) {
      // If age pyramid -- accumulate process
      if (rule.chartId && rule.chartId.includes("age_pyramid")) {
        // If it's a new chart - create current chart, then cleanup
        if (agePyramidId && agePyramidId !== rule.chartId) {
          submission[rule.thematicGroup].data.push(
            TKCreateSubmissionEntryAgePyramid(
              agePyramidData,
              surveyConfiguration
            )
          );
          agePyramidThematic = "";
          agePyramidId = "";
          agePyramidData = [];
        }

        // If no previous chart, init
        if (!agePyramidId) {
          agePyramidThematic = rule.thematicGroup;
          agePyramidId = rule.chartId;
          agePyramidData = [];
        }

        // accumulate
        agePyramidData.push({
          field: rule.fieldName,
          value: value,
          type: rule.chartData
        });
      }
      // If age pyramid -- accumulate process
      else if (rule.chartId && rule.chartId.includes("doughnut")) {
        // If it's a new chart - create current chart, then cleanup
        if (doughnutId && doughnutId !== rule.chartId) {
          submission[rule.thematicGroup].data.push(
            TKCreateSubmissionEntryDoughnut(doughnutData, surveyConfiguration)
          );
          doughnutThematic = "";
          doughnutId = "";
          doughnutData = [];
        }

        // If no previous chart, init
        if (!doughnutId) {
          doughnutThematic = rule.thematicGroup;
          doughnutId = rule.chartId;
          doughnutData = [];
        }

        // accumulate
        doughnutData.push({
          field: rule.fieldName,
          value: value
        });
      }

      // If polar chart -- accumulate process
      else if (rule.chartId && rule.chartId.includes("polar_area_chart")) {
        // If it's a new chart - create current chart, then cleanup
        if (polarId && polarId !== rule.chartId) {
          submission[rule.thematicGroup].data.push(
            TKCreateSubmissionEntryPolar(polarData, surveyConfiguration)
          );
          polarThematic = "";
          polarId = "";
          polarData = [];
        }

        // If no previous chart, init
        if (!polarId) {
          polarThematic = rule.thematicGroup;
          polarId = rule.chartId;
          polarData = [];
        }

        // accumulate
        polarData.push({
          field: rule.fieldName,
          value: value
        });
      }

      // If text item
      else {
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

  // if a current pyramid is ongoing - push it before ending
  if (agePyramidId) {
    submission[agePyramidThematic].data.push(
      TKCreateSubmissionEntryAgePyramid(agePyramidData, surveyConfiguration)
    );
  }

  // if a current pyramid is ongoing - push it before ending
  if (doughnutId) {
    submission[doughnutThematic].data.push(
      TKCreateSubmissionEntryDoughnut(doughnutData, surveyConfiguration)
    );
  }

  // if a current pyramid is ongoing - push it before ending
  if (polarId) {
    submission[polarThematic].data.push(
      TKCreateSubmissionEntryPolar(polarData, surveyConfiguration)
    );
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
    indicators: computeSubmissionIndicators(indicatorsDescription, submission)
  };
}
