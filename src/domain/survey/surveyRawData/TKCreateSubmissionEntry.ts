/* eslint-disable @typescript-eslint/camelcase */
import { TKSurveyConfiguration } from "@/domain/core/TKSurveyConfiguration";
import {
  TKTrafficLightColors,
  TKTrafficLightGrouped,
  TrafficLightTypes
} from "@/domain/core/TKTrafficLight";
import { TKSubmissionEntryText } from "@/domain/core/TKSubmissionEntryText";

import {
  LanguageCode,
  TKLanguageDescription
} from "@/domain/core/TKLanguageDescription";

function getTrafficLightColor(
  value: string,
  trafficLight: TKTrafficLightGrouped
): TKTrafficLightColors {
  if (trafficLight.type === TrafficLightTypes.STRING) {
    const match = trafficLight.values
      .filter(x => x.value.toLowerCase() === value.toLowerCase())
      .map(x => x.color)
      .pop();
    return match === undefined ? TKTrafficLightColors.UNDEFINED : match;
  }
  return TKTrafficLightColors.UNDEFINED;
}

export function TKCreateSubmissionEntry(
  value: string,
  field: string,
  surveyConfiguration: TKSurveyConfiguration,
  languages: TKLanguageDescription[]
): TKSubmissionEntryText {

  // if(surveyConfiguration.submissionsRules[field].chart_id){
  //   console.log(surveyConfiguration.submissionsRules[field].chart_id);
  // }
  const languagesList = [...new Set(languages.map(x => x.code))];
  return new TKSubmissionEntryText(
    field,
    surveyConfiguration.fieldsLabels[field].field_label_en,
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
