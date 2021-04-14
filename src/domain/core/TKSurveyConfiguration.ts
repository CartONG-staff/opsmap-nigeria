import { TKThematicsCollection } from "@/domain/survey/surveyconfiguration/TKThematicsCollectionBuilder";
import { TKTrafficLightsCollection } from "@/domain/survey/surveyconfiguration/TKTrafficLightsCollectionBuilder";
import {
  TKFieldLabelsCollection,
  TKAnswerLabelsCollection
} from "@/domain/survey/surveyconfiguration/TKLabelsCollectionBuilder";

import { TKSubmissionsRulesCollection } from "@/domain/survey/surveyconfiguration/TKSubmissionsRulesBuilder";

export interface TKSurveyConfiguration {
  thematics: TKThematicsCollection;
  trafficLights: TKTrafficLightsCollection;
  fieldsLabels: TKFieldLabelsCollection;
  answersLabels: TKAnswerLabelsCollection;
  submissionsRules: TKSubmissionsRulesCollection;
}
