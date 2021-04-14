/* eslint-disable @typescript-eslint/camelcase */
import { TKTrafficLightGrouped } from "../raw_data/TKTrafficLightsCollectionBuilder";
import { TKSurveyConfiguration } from "@/domain/data/survey/raw_data/TKSurveyConfigurationBuilder";
import { TKTrafficLightColors } from "@/domain/core/TKTrafficLightColors";
import { TKSubmissionItem } from "@/domain/core/TKSubmissionItem";

import {
  LanguageCode,
  TKLanguageDescription
} from "@/domain/config/TKLanguageDescription";

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

export function TKCreateSubmissionItem(
  value: string,
  field: string,
  surveyConfiguration: TKSurveyConfiguration,
  languages: TKLanguageDescription[]
): TKSubmissionItem {
  const languagesList = [...new Set(languages.map((x) => x.code))];
  return new TKSubmissionItem(
    field,
    surveyConfiguration.fieldsLabels[field].field_label_en,
    // (languagesList.includes(LanguageCode.PT) ? surveyConfiguration.fieldsLabels[field].field_label_pt : ""),
    languagesList.includes(LanguageCode.PT)
      ? surveyConfiguration.fieldsLabels[field]?.field_label_pt || value
      : "",
    surveyConfiguration.answersLabels[field]?.choice_name_en || value,
    languagesList.includes(LanguageCode.PT)
      ? surveyConfiguration.answersLabels[field]?.choice_name_pt || value
      : "",
    surveyConfiguration.submissionsRules[field].traffic_light_name.length > 0,
    surveyConfiguration.submissionsRules[field].traffic_light_name.length > 0
      ? getTrafficLightColor(
          value,
          surveyConfiguration.trafficLights[
            surveyConfiguration.submissionsRules[field].traffic_light_name
          ]
        )
      : TKTrafficLightColors.UNDEFINED
  );
}
