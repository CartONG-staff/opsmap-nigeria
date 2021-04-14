import { TKThematicsCollection } from "@/domain/data/survey/raw_data/TKThematicsCollectionBuilder";
import { TKTrafficLightsCollection } from "@/domain/data/survey/raw_data/TKTrafficLightsCollectionBuilder";
import {
  TKFieldLabelsCollection,
  TKAnswerLabelsCollection
} from "@/domain/data/survey/raw_data/TKLabelsCollectionBuilder";

import { TKSubmissionsRulesCollection } from "@/domain/data/survey/raw_data/TKSubmissionsRulesBuilder";

export interface TKSurveyConfiguration {
  thematics: TKThematicsCollection;
  trafficLights: TKTrafficLightsCollection;
  fieldsLabels: TKFieldLabelsCollection;
  answersLabels: TKAnswerLabelsCollection;
  submissionsRules: TKSubmissionsRulesCollection;
}
