import { TKLabel } from "../ui/TKLabel";
import { TKTrafficLightValues } from "@/domain/fdf/TKTrafficLightValues";
import { TKSubmissionEntry } from "./TKSubmissionEntry";
import { TKFDF } from "@/domain/fdf/TKFDF";
import {
  TKFDFTrafficLightGrouped,
  TKFDFTrafficLightTypes
} from "@/domain/fdf/TKFDFTrafficLight";
import { evaluate } from "mathjs";

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
    return this.answerLabel ? this.answerLabel.en !== "" : false;
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
  if (trafficLight.type === TKFDFTrafficLightTypes.MATH) {
    let match;
    for (const item of trafficLight.values) {
      const conditions = item.value.split("and");
      const result = conditions.map(x => evaluate(Number(value) + x));
      if (!result.includes(false)) {
        match = item.color;
      }
    }
    return match === undefined ? TKTrafficLightValues.UNDEFINED : match;
  }
  if (trafficLight.type === TKFDFTrafficLightTypes.LIST) {
    const match = trafficLight.values
      .filter(x => x.value.toLowerCase() === value.toLowerCase())
      .map(x => x.color)
      .pop();
    return match === undefined ? TKTrafficLightValues.CRITICAL : match;
  }
  if (trafficLight.type === TKFDFTrafficLightTypes.NOTINLIST) {
    const condition = value !== 'none'
    return condition ? TKTrafficLightValues.OK : TKTrafficLightValues.CRITICAL
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
      ? surveyConfiguration.answersLabels[value]
      : { en: value },
    surveyConfiguration.submissionsRules[field].trafficLightName.length > 0,
    surveyConfiguration.submissionsRules[field].trafficLightName.length > 0
      ? getTrafficLightColor(
          value,
          surveyConfiguration.trafficLights[
            surveyConfiguration.submissionsRules[field].trafficLightName
          ]
        )
      : TKTrafficLightValues.UNDEFINED
  );
}
