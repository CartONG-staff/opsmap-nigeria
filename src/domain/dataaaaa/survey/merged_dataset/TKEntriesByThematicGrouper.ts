import { TKSurveyConfiguration } from "@/domain/dataaaaa/survey/raw_data/TKSurveyConfigurationBuilder";
import { TKSubmissionsRulesCollection } from "../raw_data/TKSubmissionsRulesBuilder";
import { TKSetSubmissionVisualisationProfile } from "./TKSubmissionProfiler";

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
  surveyConfiguration: TKSurveyConfiguration
) {
  const thematics: { [index: string]: any } = {};

  for (const thematic in surveyConfiguration.thematics) {
    thematics[thematic] = {
      ...surveyConfiguration.thematics[thematic],
      data: [],
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
            TKSetSubmissionVisualisationProfile(
              submissionItem[field],
              field,
              surveyConfiguration
            )
          );
        }
      }
    }
  }
  return thematics;
}
