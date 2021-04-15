import { TKLanguageDescription } from "@/domain/core/TKLanguageDescription";
import { TKSubmission } from "@/domain/core/TKSubmission";

import { TKSurveyConfiguration } from "@/domain/core/TKSurveyConfiguration";
import { TKSubmissionsRulesCollection } from "../surveyConfiguration/TKSubmissionsRulesBuilder";
import { TKCreateSubmissionEntry } from "./TKCreateSubmissionEntry";

// TO DEVELOP
function TKIsSubmissionIsRelevant(): boolean {
  return true;
}

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
  const submission: TKSubmission = {};
  for (const thematic in surveyConfiguration.thematics) {
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
  return submission;
}
