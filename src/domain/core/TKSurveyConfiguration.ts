import { TKThematicsCollection } from "@/domain/survey/surveyConfiguration/TKThematicsCollectionBuilder";
import { TKTrafficLightsCollection } from "@/domain/survey/surveyConfiguration/TKTrafficLightsCollectionBuilder";
import {
  TKFieldLabelsCollection,
  TKAnswerLabelsCollection
} from "@/domain/survey/surveyConfiguration/TKLabelsCollectionBuilder";

import { TKSubmissionsRulesCollection } from "@/domain/survey/surveyConfiguration/TKSubmissionsRulesBuilder";

export interface TKSurveyConfiguration {
  thematics: TKThematicsCollection;
  trafficLights: TKTrafficLightsCollection;
  fieldsLabels: TKFieldLabelsCollection;
  answersLabels: TKAnswerLabelsCollection;
  submissionsRules: TKSubmissionsRulesCollection;
}
