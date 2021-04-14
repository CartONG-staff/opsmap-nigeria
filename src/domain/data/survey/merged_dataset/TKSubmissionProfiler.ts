/* eslint-disable @typescript-eslint/camelcase */
import { TKTrafficLightGrouped } from "../raw_data/TKTrafficLightsCollectionBuilder";
import { TKSurveyConfiguration } from "@/domain/data/survey/raw_data/TKSurveyConfigurationBuilder";
import { TKTrafficLightColors } from "@/domain/core/TKTrafficLightColors";
import {
  LanguageCode,
  TKLanguageDescription,
} from "@/domain/config/TKLanguageDescription";

interface TKSubmissionVisualisationProfile {
  field: string;
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
  surveyConfiguration: TKSurveyConfiguration,
  languages: TKLanguageDescription[]
): TKSubmissionVisualisationProfile {
  const languagesList = [...new Set(languages.map((x) => x.code))];
  const profil: TKSubmissionVisualisationProfile = {
    field: field,
    fieldLabel_en: surveyConfiguration.fieldsLabels[field].field_label_en,
    fieldLabel_fr: languagesList.includes(LanguageCode.FR)
      ? surveyConfiguration.fieldsLabels[field].field_label_fr
      : undefined,
    fieldLabel_pt: languagesList.includes(LanguageCode.PT)
      ? surveyConfiguration.fieldsLabels[field].field_label_pt
      : undefined,
    answerLabel_en:
      surveyConfiguration.answersLabels[field]?.choice_name_en || value,
    answerLabel_fr: languagesList.includes(LanguageCode.FR)
      ? surveyConfiguration.answersLabels[field]?.choice_name_fr || value
      : undefined,
    answerLabel_pt: languagesList.includes(LanguageCode.PT)
      ? surveyConfiguration.answersLabels[field]?.choice_name_pt || value
      : undefined,
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
