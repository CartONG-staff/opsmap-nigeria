import { TKLanguageDescription } from "@/domain/config/TKLanguageDescription";
import { TKSurveyConfiguration } from "@/domain/data/survey/raw_data/TKSurveyConfigurationBuilder";
import { TKSubmissionsRulesCollection } from "../raw_data/TKSubmissionsRulesBuilder";
import { TKCreateSubmissionItem } from "./TKCreateSubmissionItem";

// TO DEVELOP
function TKIsSubmissionIsRelevant(): boolean {
  return true;
}
// TO DEVELOP

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

export function TKGroupAnswersByThematics(
  submissionItem: any,
  surveyConfiguration: TKSurveyConfiguration,
  languages: TKLanguageDescription[]
) {
  const thematics: { [index: string]: any } = {};

  for (const thematic in surveyConfiguration.thematics) {
    thematics[thematic] = {
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
          thematics[thematic].data.push(
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
  return thematics;
}
