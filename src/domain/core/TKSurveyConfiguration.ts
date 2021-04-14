import { TKThematicsCollection } from "@/domain/data/surveyconfiguration/TKThematicsCollectionBuilder";
import { TKTrafficLightsCollection } from "@/domain/data/surveyconfiguration/TKTrafficLightsCollectionBuilder";
import {
  TKFieldLabelsCollection,
  TKAnswerLabelsCollection
} from "@/domain/data/surveyconfiguration/TKLabelsCollectionBuilder";

import { TKSubmissionsRulesCollection } from "@/domain/data/surveyconfiguration/TKSubmissionsRulesBuilder";

export interface TKSurveyConfiguration {
  thematics: TKThematicsCollection;
  trafficLights: TKTrafficLightsCollection;
  fieldsLabels: TKFieldLabelsCollection;
  answersLabels: TKAnswerLabelsCollection;
  submissionsRules: TKSubmissionsRulesCollection;
}
