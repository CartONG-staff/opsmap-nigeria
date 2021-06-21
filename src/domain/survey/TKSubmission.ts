/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  TKIndicatorsDescription,
  TKIndicatorDescription,
  TKIndicatorDescriptionSiteOccupation
} from "@/domain/opsmapConfig/TKIndicatorsDescription";
import { TKFDF } from "@/domain/fdf/TKFDF";
import { TKFDFSubmissionsRulesCollection } from "@/domain/fdf/TKFDFSubmissionsRules";
import {
  TKCreateSubmissionEntryAgePyramid,
  TKSubmissionEntryAgePyramidItem
} from "./TKSubmissionEntryAgePyramid";
import { TKCreateSubmissionEntryText } from "./TKSubmissionEntryText";
import { TKSubmissionEntryText } from "@/domain/survey/TKSubmissionEntryText";
import {
  TKSubmissionThematic,
  TKCreateSubmissionThematic
} from "./TKSubmissionThematic";
import { TKIndicator } from "@/domain/ui/TKIndicator";
import { TKLabel } from "../ui/TKLabel";

// ////////////////////////////////////////////////////////////////////////////
//  Submission concept definition
// ////////////////////////////////////////////////////////////////////////////

export interface TKSubmission {
  thematics: Record<string, TKSubmissionThematic>;
  indicators: [TKIndicator, TKIndicator, TKIndicator];
}

// ////////////////////////////////////////////////////////////////////////////
// helpers method
// ////////////////////////////////////////////////////////////////////////////

// TO DEVELOP
function isSubmissionRelevant(): boolean {
  return true;
}

function isSubmissionInThematic(
  submission: string,
  thematic: string,
  submissionsRules: TKFDFSubmissionsRulesCollection
): boolean {
  return submissionsRules[submission]
    ? submissionsRules[submission].thematicGroup === thematic
      ? true
      : false
    : false;
}

function isSubmissionAnAgePyramid(surveyConfiguration: TKFDF, field: string) {
  return (
    surveyConfiguration.submissionsRules[field].chartId &&
    surveyConfiguration.submissionsRules[field].chartId.includes("age_pyramid")
  );
}

// ////////////////////////////////////////////////////////////////////////////
// indicators management
// ////////////////////////////////////////////////////////////////////////////

function getValue(
  data: Record<string, TKSubmissionThematic>,
  entryCode: string
): number | undefined {
  const splitted = entryCode.split("_");
  if (splitted) {
    const thematic = "group_" + splitted[0];
    if (data[thematic]) {
      const entry = data[thematic].data.find(item => item.field === entryCode);
      if (entry instanceof TKSubmissionEntryText) {
        const result = parseInt(entry.answerLabel.en, 10);
        if (isNaN(result)) {
          return undefined;
        }
        return result;
      }
    }
  }
  return undefined;
}

function getLabel(
  data: Record<string, TKSubmissionThematic>,
  entryCode: string
): TKLabel {
  const splitted = entryCode.split("_");
  if (splitted) {
    const thematic = "group_" + splitted[0];
    if (data[thematic]) {
      const entry = data[thematic].data.find(item => item.field === entryCode);
      if (entry instanceof TKSubmissionEntryText) {
        return entry.answerLabel;
      }
    }
  }
  return { en: "-" };
}

function computeSubmissionIndicator(
  descr: TKIndicatorDescription,
  data: Record<string, TKSubmissionThematic>
): TKIndicator {
  if (descr instanceof TKIndicatorDescriptionSiteOccupation) {
    const labelIsMaxCapacity = getLabel(data, descr.entryCode);

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
  submissionItem: any,
  surveyConfiguration: TKFDF,
  indicatorsDescription: TKIndicatorsDescription
): TKSubmission {
  const submission: Record<string, TKSubmissionThematic> = {};
  for (const thematic in surveyConfiguration.thematics) {
    submission[thematic] = TKCreateSubmissionThematic(
      surveyConfiguration.thematics[thematic]
    );
    let agePyramidId = "";
    let agePyramidData: Array<TKSubmissionEntryAgePyramidItem> = [];
    for (const field in submissionItem) {
      if (
        isSubmissionInThematic(
          field,
          thematic,
          surveyConfiguration.submissionsRules
        )
      ) {
        if (isSubmissionRelevant()) {
          // If age pyramid -- accumulate process
          if (isSubmissionAnAgePyramid(surveyConfiguration, field)) {
            // If it's a new chart - create current chart, then cleanup
            if (
              agePyramidId &&
              agePyramidId !==
                surveyConfiguration.submissionsRules[field].chartId
            ) {
              submission[thematic].data.push(
                TKCreateSubmissionEntryAgePyramid(
                  agePyramidData,
                  surveyConfiguration
                )
              );
              agePyramidId = "";
              agePyramidData = [];
            }

            // If no previous chart, init
            if (!agePyramidId) {
              agePyramidId =
                surveyConfiguration.submissionsRules[field].chartId;
              agePyramidData = [];
            }

            // accumulate
            agePyramidData.push({
              field: field,
              value: submissionItem[field],
              type: surveyConfiguration.submissionsRules[field].chartData
            });
          } else {
            // if a current pyramid is ongoing - push it before switching to text item
            if (agePyramidId) {
              submission[thematic].data.push(
                TKCreateSubmissionEntryAgePyramid(
                  agePyramidData,
                  surveyConfiguration
                )
              );
              agePyramidId = "";
              agePyramidData = [];
            }
            submission[thematic].data.push(
              TKCreateSubmissionEntryText(
                submissionItem[field],
                field,
                surveyConfiguration
              )
            );
          }
        }
      }
    }
    // if a current pyramid is ongoing - push it before ending
    if (agePyramidId) {
      submission[thematic].data.push(
        TKCreateSubmissionEntryAgePyramid(agePyramidData, surveyConfiguration)
      );
      agePyramidId = "";
      agePyramidData = [];
    }
  }

  //  Solution to filter thematics if nothing has been answered. ////////////////////////
  Object.entries(submission).filter(item => item.length > 0);
  const submissionFiltered: Record<string, TKSubmissionThematic> = {};
  for (const key of Object.keys(submission)) {
    if (submission[key].data.length > 0) {
      submissionFiltered[key] = submission[key];
    }
  }

  return {
    thematics: submissionFiltered,
    indicators: computeSubmissionIndicators(indicatorsDescription, submission)
  };
}
