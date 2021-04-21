import { TKThematicsCollection } from "@/domain/fdf/TKThematicsCollectionBuilder";
import { TKTrafficLightsCollection } from "@/domain/fdf/TKTrafficLightsCollectionBuilder";
import {
  TKLabelsCollection,
  TKAnswerLabelsCollection
} from "@/domain/fdf/TKLabelsCollectionBuilder";

import { TKSubmissionsRulesCollection } from "@/domain/fdf/TKSubmissionsRulesBuilder";

export interface TKSurveyConfiguration {
  thematics: TKThematicsCollection;
  trafficLights: TKTrafficLightsCollection;
  fieldsLabels: TKLabelsCollection;
  answersLabels: TKAnswerLabelsCollection;
  submissionsRules: TKSubmissionsRulesCollection;
}
