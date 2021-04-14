import { TKThematicsCollection } from "@/domain/survey/surveyconfiguratio/TKThematicsCollectionBuilder";
import { TKTrafficLightsCollection } from "@/domain/survey/surveyconfiguratio/TKTrafficLightsCollectionBuilder";
import {
  TKFieldLabelsCollection,
  TKAnswerLabelsCollection
} from "@/domain/survey/surveyconfiguratio/TKLabelsCollectionBuilder";

import { TKSubmissionsRulesCollection } from "@/domain/survey/surveyconfiguratio/TKSubmissionsRulesBuilder";

export interface TKSurveyConfiguration {
  thematics: TKThematicsCollection;
  trafficLights: TKTrafficLightsCollection;
  fieldsLabels: TKFieldLabelsCollection;
  answersLabels: TKAnswerLabelsCollection;
  submissionsRules: TKSubmissionsRulesCollection;
}
