/* eslint-disable @typescript-eslint/camelcase */

import { TKLabel } from "../ui/TKLabel";
import { TKTrafficLightValues } from "@/domain/fdf/TKTrafficLightValues";
import { TKSubmissionEntry } from "./TKSubmissionEntry";
import { TKAnswerLabelToFieldLabel } from "@/domain/ui/TKLabel";
import { TKFDF } from "@/domain/fdf/TKFDF";
import {
  TKFDFTrafficLightGrouped,
  TKFDFTrafficLightTypes
} from "@/domain/fdf/TKFDFTrafficLight";

// ////////////////////////////////////////////////////////////////////////////
// EntryText concept definition
// ////////////////////////////////////////////////////////////////////////////

export class TKSubmissionEntryText extends TKSubmissionEntry {
  answerLabel: TKLabel;
  trafficLight = false;
  trafficLightColor: TKTrafficLightValues = TKTrafficLightValues.UNDEFINED;

  constructor(
    field: string,
    fieldLabel: TKLabel,
    answerLabel: TKLabel,
    trafficLight: boolean,
    trafficLightColor: TKTrafficLightValues
  ) {
    super(field, fieldLabel);
    this.answerLabel = answerLabel;
    this.trafficLight = trafficLight;
    this.trafficLightColor = trafficLightColor;
  }

  public isAnswered(): boolean {
    return this.answerLabel ? this.answerLabel.label_en !== "" : false;
  }
}

// ////////////////////////////////////////////////////////////////////////////
// helpers method
// ////////////////////////////////////////////////////////////////////////////

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

// ////////////////////////////////////////////////////////////////////////////
// EntryText creation method
// ////////////////////////////////////////////////////////////////////////////

export function TKCreateSubmissionEntryText(
  value: string,
  field: string,
  surveyConfiguration: TKFDF
): TKSubmissionEntryText {
  return new TKSubmissionEntryText(
    field,
    surveyConfiguration.fieldsLabels[field],
    surveyConfiguration.answersLabels[value]
      ? TKAnswerLabelToFieldLabel(surveyConfiguration.answersLabels[value])
      : { name: value, label_en: value },
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
