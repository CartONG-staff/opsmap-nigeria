/* eslint-disable @typescript-eslint/camelcase */
import {
  TrafficLightColors,
  TKTrafficLightGrouped,
} from "../raw_data/TKTrafficLightsCollectionBuilder";
import { TKSurveyConfiguration } from "@/domain/dataaaaa/survey/raw_data/TKSurveyConfigurationBuilder";

interface TKSubmissionVisualisationProfile {
  fieldLabel_en: string;
  fieldLabel_fr?: string;
  fieldLabel_pt?: string;
  answerLabel_en: string;
  answerLabel_fr?: string;
  answerLabel_pt?: string;
  trafficLight: boolean;
  trafficLightColor: TrafficLightColors;
}

function getTrafficLightColor(
  value: string,
  trafficLight: TKTrafficLightGrouped
): TrafficLightColors {
  if (trafficLight.type === "string") {
    const match = trafficLight.values
      .filter((x) => x.value.toLowerCase() === value.toLowerCase())
      .map((x) => x.color)
      .pop();
    return match === undefined ? "" : match;
  }
  return "";
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
        : "",
  };
  return profil;
}
