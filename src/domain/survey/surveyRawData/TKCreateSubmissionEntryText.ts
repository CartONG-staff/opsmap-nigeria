/* eslint-disable @typescript-eslint/camelcase */
import { TKSurveyConfiguration } from "@/domain/core/TKSurveyConfiguration";
import {
  TKTrafficLightColors,
  TKTrafficLightGrouped,
  TrafficLightTypes
} from "@/domain/core/TKTrafficLight";

import { TKSubmissionEntryText } from "@/domain/core/TKSubmissionEntry";
import { TKAnswerLabelToFieldLabel } from "@/domain/core/TKLabel";

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

export function TKCreateSubmissionEntryText(
  value: string,
  field: string,
  surveyConfiguration: TKSurveyConfiguration
): TKSubmissionEntryText {
  return new TKSubmissionEntryText(
    field,
    surveyConfiguration.fieldsLabels[field],
    surveyConfiguration.answersLabels[value] ? TKAnswerLabelToFieldLabel(surveyConfiguration.answersLabels[value]) : { name: value, label_en: value},
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
