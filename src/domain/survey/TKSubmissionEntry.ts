import { evaluate } from "mathjs";
import { TKFDF } from "../fdf/TKFDF";
import {
  TKFDFTrafficLightGrouped,
  TKFDFTrafficLightTypes
} from "../fdf/TKFDFTrafficLight";
import { TKTrafficLightValues } from "../fdf/TKTrafficLightValues";
import { TKLabel } from "../utils/TKLabel";
import { TKFDFSubmissionItemType } from "../fdf/TKFDFSubmissionsRules";

// ////////////////////////////////////////////////////////////////////////////
// Entry abstract concept definition
// ////////////////////////////////////////////////////////////////////////////

export enum TKSubmissionEntryType {
  TEXT = "text",
  CHART_PYRAMID = "age_pyramid",
  CHART_DOUGHNUT = "doughnut",
  CHART_POLAR = "polar"
}
export interface TKSubmissionEntryText {
  type: TKSubmissionEntryType.TEXT;
  field: string;
  fieldLabel: TKLabel;
  answerLabel: TKLabel;
  trafficLight: boolean;
  trafficLightColor: TKTrafficLightValues;
  isAnswered: boolean;
}
export interface TKSubmissionEntryAgePyramid {
  type: TKSubmissionEntryType.CHART_PYRAMID;
  chartid: string;
  title: TKLabel;
  malesEntries: Array<number>;
  femalesEntries: Array<number>;
  malesLabels: Array<TKLabel>;
  isAnswered: true;
  femalesLabels: Array<TKLabel>;
}

export interface TKSubmissionEntryDoughnut {
  type: TKSubmissionEntryType.CHART_DOUGHNUT;
  chartid: string;
  title: TKLabel;
  isAnswered: true;
  entries: Array<{ value: number; label: TKLabel }>;
}
export interface TKSubmissionEntryPolar {
  type: TKSubmissionEntryType.CHART_POLAR;
  chartid: string;
  title: TKLabel;
  isAnswered: true;
  entries: Array<{ value: number; label: TKLabel }>;
}

// ////////////////////////////////////////////////////////////////////////////
// Alltogether type
// ////////////////////////////////////////////////////////////////////////////

export type TKSubmissionEntry =
  | TKSubmissionEntryText
  | TKSubmissionEntryAgePyramid
  | TKSubmissionEntryDoughnut
  | TKSubmissionEntryPolar;

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
      // TODO: remove evaluate. Only depencey to mathjs.
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
    const condition = value !== "none";
    return condition ? TKTrafficLightValues.OK : TKTrafficLightValues.CRITICAL;
  }
  return TKTrafficLightValues.UNDEFINED;
}

// ////////////////////////////////////////////////////////////////////////////
// EntryText creation method
// ////////////////////////////////////////////////////////////////////////////

export function TKCreateSubmissionEntryText(
  value: string,
  field: string,
  surveyConfiguration: TKFDF,
  languages: string[]
): TKSubmissionEntryText {
  let correctedValue: Record<string, string> = {};
  if (
    surveyConfiguration.submissionsRules[field].type ===
    TKFDFSubmissionItemType.LIST
  ) {
    languages.map(
      lang =>
        (correctedValue[lang] = value
          .split(" ")
          .map(x => {
            if (
              surveyConfiguration.answersLabels[x] &&
              surveyConfiguration.answersLabels[x][lang]
            ) {
              return surveyConfiguration.answersLabels[x][lang];
            }
            const lowerCasedValue = x.toLowerCase();
            if (
              surveyConfiguration.answersLabels[lowerCasedValue] &&
              surveyConfiguration.answersLabels[lowerCasedValue][lang]
            ) {
              return surveyConfiguration.answersLabels[lowerCasedValue][lang];
            }
            return x;
          })
          .join(", "))
    );
  } else {
    correctedValue = surveyConfiguration.answersLabels[value]
      ? surveyConfiguration.answersLabels[value]
      : { en: value };
  }
  return {
    type: TKSubmissionEntryType.TEXT,
    field: field,
    fieldLabel: surveyConfiguration.fieldsLabels[field],
    answerLabel: correctedValue,
    isAnswered: value !== "",
    trafficLight:
      surveyConfiguration.submissionsRules[field].trafficLightName.length > 0,
    trafficLightColor:
      surveyConfiguration.submissionsRules[field].trafficLightName.length > 0
        ? getTrafficLightColor(
            value,
            surveyConfiguration.trafficLights[
              surveyConfiguration.submissionsRules[field].trafficLightName
            ]
          )
        : TKTrafficLightValues.UNDEFINED
  };
}
