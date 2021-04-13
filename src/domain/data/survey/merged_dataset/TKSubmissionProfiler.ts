/* eslint-disable @typescript-eslint/camelcase */
import {
  TKTrafficLightGrouped,
} from "../raw_data/TKTrafficLightsCollectionBuilder";
import { TKSurveyConfiguration } from "@/domain/data/survey/raw_data/TKSurveyConfigurationBuilder";
import { TKTrafficLightColors } from "@/domain/core/TKTrafficLightColors";

interface TKSubmissionVisualisationProfile {
  fieldLabel_en: string;
  fieldLabel_fr?: string;
  fieldLabel_pt?: string;
  answerLabel_en: string;
  answerLabel_fr?: string;
  answerLabel_pt?: string;
  trafficLight: boolean;
  trafficLightColor: TKTrafficLightColors;
}

function getTrafficLightColor(
  value: string,
  trafficLight: TKTrafficLightGrouped
): TKTrafficLightColors {
  if (trafficLight.type === "string") {
    const match = trafficLight.values
      .filter((x) => x.value.toLowerCase() === value.toLowerCase())
      .map((x) => x.color)
      .pop();
    return match === undefined ? TKTrafficLightColors.UNDEFINED : match;
  }
  return TKTrafficLightColors.UNDEFINED;
}

export function TKSetSubmissionVisualisationProfile(
  value: string,
  field: string,
  surveyConfiguration: TKSurveyConfiguration
) {
  const profil: TKSubmissionVisualisationProfile = {
    fieldLabel_en: surveyConfiguration.fieldsLabels[field].field_label_en,
    answerLabel_en:
      surveyConfiguration.answersLabels[field]?.choice_name_en || value,
    trafficLight:
      surveyConfiguration.submissionsRules[field].traffic_light_name.length > 0,
    trafficLightColor:
      surveyConfiguration.submissionsRules[field].traffic_light_name.length > 0
        ? getTrafficLightColor(
            value,
            surveyConfiguration.trafficLights[
              surveyConfiguration.submissionsRules[field].traffic_light_name
            ]
          )
        : TKTrafficLightColors.UNDEFINED,
  };
  return profil;
}
