import { TKThematicsCollection } from "@/domain/fdf/TKThematicsCollectionBuilder";
import { TKTrafficLightsCollection } from "@/domain/fdf/TKTrafficLightsCollectionBuilder";
import { TKFDFAnswerLabelCollection } from "@/domain/fdf/TKFDFAnswerLabel";
import { TKSubmissionsRulesCollection } from "@/domain/fdf/TKSubmissionsRulesBuilder";
import { TKLabelsCollection } from "@/domain/fdf/TKLabelsCollectionBuilder";

export interface TKFDF {
  thematics: TKThematicsCollection;
  trafficLights: TKTrafficLightsCollection;
  fieldsLabels: TKLabelsCollection;
  answersLabels: TKFDFAnswerLabelCollection;
  submissionsRules: TKSubmissionsRulesCollection;
}
