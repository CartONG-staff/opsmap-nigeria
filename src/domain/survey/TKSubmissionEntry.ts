import { evaluate } from "mathjs";
import { TKFDF } from "../fdf/TKFDF";
import {
  TKFDFTrafficLightGrouped,
  TKFDFTrafficLightTypes
} from "../fdf/TKFDFTrafficLight";
import { TKTrafficLightValues } from "../fdf/TKTrafficLightValues";
import { TKLabel } from "../ui/TKLabel";

// ////////////////////////////////////////////////////////////////////////////
// Entry abstract concept definition
// ////////////////////////////////////////////////////////////////////////////
export interface TKSubmissionEntryText {
  type: "text";
  field: string;
  fieldLabel: TKLabel;
  answerLabel: TKLabel;
  trafficLight: boolean;
  trafficLightColor: TKTrafficLightValues;
  isAnswered: boolean;
}
export interface TKSubmissionEntryAgePyramid {
  type: "age_pyramid";
  malesEntries: Array<number>;
  femalesEntries: Array<number>;
  malesLabels: Array<TKLabel>;
  isAnswered: true;
  femalesLabels: Array<TKLabel>;
}

export interface TKSubmissionEntryDoughnut {
  type: "doughnut";
  isAnswered: true;
  entries: Array<{ value: number; label: TKLabel }>;
}
export interface TKSubmissionEntryPolar {
  type: "polar";
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
  surveyConfiguration: TKFDF
): TKSubmissionEntryText {
  return {
    type: "text",
    field: field,
    fieldLabel: surveyConfiguration.fieldsLabels[field],
    answerLabel: surveyConfiguration.answersLabels[value]
      ? surveyConfiguration.answersLabels[value]
      : { en: value },
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

// ////////////////////////////////////////////////////////////////////////////
// EntryAgePyramid concept definition
// ////////////////////////////////////////////////////////////////////////////
export interface TKSubmissionEntryAgePyramidItem {
  field: string;
  value: string;
  type: string;
}

export function TKCreateSubmissionEntryAgePyramid(
  chartdata: Array<TKSubmissionEntryAgePyramidItem>,
  surveyConfiguration: TKFDF
): TKSubmissionEntryAgePyramid {
  const malesEntries = chartdata.filter(item => item.type === "m").reverse();
  const femalesEntries = chartdata.filter(item => item.type === "f").reverse();

  const malesDataset = malesEntries.map(item => Number(item.value));
  const femalesDataset = femalesEntries.map(item => Number(item.value));

  const malesLabel = malesEntries.map(
    item => surveyConfiguration.fieldsLabels[item.field]
  );
  const femalesLabel = femalesEntries.map(
    item => surveyConfiguration.fieldsLabels[item.field]
  );

  return {
    type: "age_pyramid",
    isAnswered: true,
    malesEntries: malesDataset,
    femalesEntries: femalesDataset,
    malesLabels: malesLabel,
    femalesLabels: femalesLabel
  };
}

// ////////////////////////////////////////////////////////////////////////////
// Doughnut concept definition
// ////////////////////////////////////////////////////////////////////////////
export interface TKSubmissionEntryDoughnutItem {
  field: string;
  value: string;
}

export function TKCreateSubmissionEntryDoughnut(
  chartdata: Array<TKSubmissionEntryDoughnutItem>,
  surveyConfiguration: TKFDF
): TKSubmissionEntryDoughnut {
  return {
    type: "doughnut",
    isAnswered: true,
    entries: chartdata.map(item => {
      return {
        value: Number(item.value),
        label: surveyConfiguration.fieldsLabels[item.field]
      };
    })
  };
}

// ////////////////////////////////////////////////////////////////////////////
// Polar chart concept definition
// ////////////////////////////////////////////////////////////////////////////
export interface TKSubmissionEntryPolarItem {
  field: string;
  value: string;
}

export function TKCreateSubmissionEntryPolar(
  chartdata: Array<TKSubmissionEntryPolarItem>,
  surveyConfiguration: TKFDF
): TKSubmissionEntryPolar {
  return {
    type: "polar",
    isAnswered: true,
    entries: chartdata.map(item => {
      return {
        value: Number(item.value),
        label: surveyConfiguration.fieldsLabels[item.field]
      };
    })
  };
}
