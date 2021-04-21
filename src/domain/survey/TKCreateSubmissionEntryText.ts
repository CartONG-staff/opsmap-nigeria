/* eslint-disable @typescript-eslint/camelcase */
import { TKFDF } from "@/domain/fdf/TKFDF";
import {
  TKFDFTrafficLightGrouped,
  TKFDFTrafficLightTypes
} from "@/domain/fdf/TKFDFTrafficLight";


import { TKSubmissionEntryText } from "@/domain/core/TKSubmissionEntry";
import { TKAnswerLabelToFieldLabel } from "@/domain/core/TKLabel";
import { TKTrafficLightValues } from "@/domain/core/TKTrafficLightValues";

function getTrafficLightColor(
  value: string,
  trafficLight: TKFDFTrafficLightGrouped
): TKTrafficLightValues {
  if (trafficLight.type === TKFDFTrafficLightTypes.STRING) {
    const match = trafficLight.values
      .filter(x => x.value.toLowerCase() === value.toLowerCase())
      .map(x => x.color)
      .pop();
    return match === undefined ? TKTrafficLightValues.UNDEFINED : match;
  }
  return TKTrafficLightValues.UNDEFINED;
}

export function TKCreateSubmissionEntryText(
  value: string,
  field: string,
  surveyConfiguration: TKFDF
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
      : TKTrafficLightValues.UNDEFINED
  );
}
