import { TKLanguageDescription } from "@/domain/core/TKLanguageDescription";
import { TKSubmission } from "@/domain/core/TKSubmission";
import { TKSubmissionThematic } from "@/domain/core/TKSubmissionThematic";

import { TKIndicator } from "@/domain/core/TKIndicator";
import { TKIndicatorsDescription, TKIndicatorDescription } from "@/domain/core/TKIndicatorsDescription";
import { TKSurveyConfiguration } from "@/domain/core/TKSurveyConfiguration";
import { TKSubmissionsRulesCollection } from "../surveyConfiguration/TKSubmissionsRulesBuilder";
import { TKCreateSubmissionEntry } from "./TKCreateSubmissionEntry";
import { findPoint } from "@turf/meta";
import { TKSubmissionEntryText } from "@/domain/core/TKSubmissionEntry";


// ////////////////////////////////////////////////////////////////////////////
// checks
// ////////////////////////////////////////////////////////////////////////////

// TO DEVELOP
function isSubmissionRelevant(): boolean {
  return true;
}

function isSubmissionInThematic(
  submission: string,
  thematic: string,
  submissionsRules: TKSubmissionsRulesCollection
): boolean {
  return submissionsRules[submission]
    ? submissionsRules[submission].thematic_group === thematic
      ? true
      : false
    : false;
}

// ////////////////////////////////////////////////////////////////////////////
// indicators management
// ////////////////////////////////////////////////////////////////////////////

function computeSubmissionIndicator(descr: TKIndicatorDescription, data: Record<string, TKSubmissionThematic>) : TKIndicator{
  const splitted = descr.entryCode.split("_")
  if(splitted){
    const thematic = "group_"+splitted[0];
    const entry = data[thematic].data.find(item => item.field === descr.entryCode);
    if(entry instanceof TKSubmissionEntryText){
      return {
        iconOchaName: descr.iconOchaName,
        nameEn: descr.name,
        namePt: descr.name,
        valueEn: entry.answerLabelEn,
        valuePt: entry.answerLabelPt ? entry.answerLabelPt : "",
      }
    }
  }
  return {
    iconOchaName: descr.iconOchaName,
    nameEn: descr.name,
    namePt: descr.name,
    valueEn: "NotFound",
    valuePt: "NotFound",
  }
}

function computeSubmissionIndicators(descr: TKIndicatorsDescription, data: Record<string, TKSubmissionThematic>) : [TKIndicator, TKIndicator, TKIndicator] {
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
  surveyConfiguration: TKSurveyConfiguration,
  indicatorsDescription: TKIndicatorsDescription,
  languages: TKLanguageDescription[]
) : TKSubmission {
  const submission: Record<string, TKSubmissionThematic> = {};
  for (const thematic in surveyConfiguration.thematics) {
    submission[thematic] = {
      ...surveyConfiguration.thematics[thematic],
      data: []
    };
    for (const field in submissionItem) {
      if (
        isSubmissionInThematic(
          field,
          thematic,
          surveyConfiguration.submissionsRules
        )
      ) {
        if (isSubmissionRelevant()) {
          submission[thematic].data.push(
            TKCreateSubmissionEntry(
              submissionItem[field],
              field,
              surveyConfiguration,
              languages
            )
          );
        }
      }
    }
  }

  const result: TKSubmission = {
    thematics: submission,
    indicators: computeSubmissionIndicators(indicatorsDescription, submission)
  }

  return result;
}
