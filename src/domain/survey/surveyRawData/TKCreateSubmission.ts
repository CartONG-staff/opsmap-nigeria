import { TKLanguageDescription } from "@/domain/core/TKLanguageDescription";
import {
  TKSubmissionThematic,
  TK_SUBMISSION_THEMATIC_DEFAULT
} from "@/domain/core/TKSubmissionThematic";

import { TKSubmission } from "@/domain/core/TKSubmission";

import { TKSurveyConfiguration } from "@/domain/core/TKSurveyConfiguration";
import { TKSubmissionsRulesCollection } from "../surveyConfiguration/TKSubmissionsRulesBuilder";
import { TKCreateSubmissionItem } from "./TKCreateSubmissionItem";

// TO DEVELOP
function TKIsSubmissionIsRelevant(): boolean {
  return true;
}
// TO DEVELOP
// const thematics: TKSubmissionThematic = TK_SUBMISSION_THEMATIC_DEFAULT; //{ [index: string]: any } = {};

function TKIsSubmissionInThematic(
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

export function TKCreateSubmission(
  submissionItem: any,
  surveyConfiguration: TKSurveyConfiguration,
  languages: TKLanguageDescription[]
) {
  // const thematics: { [index: string]: any } = {};
  const submission: TKSubmission = {};
  for (const thematic in surveyConfiguration.thematics) {
    console.log("-- thematic: " + surveyConfiguration.thematics[thematic]);
    submission[thematic] = {
      ...surveyConfiguration.thematics[thematic],
      data: []
    };
    for (const field in submissionItem) {
      if (
        TKIsSubmissionInThematic(
          field,
          thematic,
          surveyConfiguration.submissionsRules
        )
      ) {
        if (TKIsSubmissionIsRelevant()) {
          submission[thematic].data.push(
            TKCreateSubmissionItem(
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
  return submission;
}
