import { evaluate } from "mathjs";
import { TKFDF } from "../fdf/TKFDF";
import {
  TKFDFTrafficLightGrouped,
  TKFDFTrafficLightTypes
} from "../fdf/TKFDFTrafficLight";
import { TKTrafficLightValues } from "@/domain/fdf/TKFDFTrafficLight";
import { TKLabel } from "../utils/TKLabel";
import { TKSubmissionThematic } from "./TKSubmissionThematic";
import { TKFDFSubmissionRule } from "../fdf/TKFDFSubmissionsRules";

// ////////////////////////////////////////////////////////////////////////////
// Entry abstract concept definition
// ////////////////////////////////////////////////////////////////////////////

export enum TKSubmissionEntryType {
  TEXT = "text",
  BULLET = "bullet",
  CHART_PYRAMID = "age_pyramid",
  CHART_DOUGHNUT = "doughnut",
  CHART_POLAR = "polar",
  CHART_RADAR = "radar"
}
export interface TKSubmissionEntryText {
  type: TKSubmissionEntryType.TEXT;
  thematic: TKSubmissionThematic;
  field: string;
  fieldLabel: TKLabel;
  answerLabel: TKLabel;
  trafficLight: boolean;
  trafficLightColor: TKTrafficLightValues;
  isAnswered: boolean;
}

export interface TKSubmissionEntryBullet {
  type: TKSubmissionEntryType.BULLET;
  thematic: TKSubmissionThematic;
  field: string;
  fieldLabel: TKLabel;
  answersLabels: TKLabel[];
  trafficLight: boolean;
  trafficLightColor: TKTrafficLightValues;
  isAnswered: boolean;
}
export interface TKSubmissionEntryAgePyramid {
  type: TKSubmissionEntryType.CHART_PYRAMID;
  thematic: TKSubmissionThematic;
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
  thematic: TKSubmissionThematic;
  chartid: string;
  title: TKLabel;
  isAnswered: true;
  entries: Array<{ value: number; label: TKLabel }>;
}
export interface TKSubmissionEntryPolar {
  type: TKSubmissionEntryType.CHART_POLAR;
  thematic: TKSubmissionThematic;
  chartid: string;
  title: TKLabel;
  isAnswered: true;
  entries: Array<{ value: number; label: TKLabel }>;
}

export interface TKSubmissionEntryRadar {
  type: TKSubmissionEntryType.CHART_RADAR;
  thematic: TKSubmissionThematic;
  chartid: string;
  title: TKLabel;
  isAnswered: true;
  entries: Array<{ value: number; label: TKLabel }>;
}

// ////////////////////////////////////////////////////////////////////////////
// Alltogether type
// ////////////////////////////////////////////////////////////////////////////

export type TKSubmissionRawEntries = Record<string, string>;

export type TKSubmissionEntry =
  | TKSubmissionEntryText
  | TKSubmissionEntryBullet
  | TKSubmissionEntryAgePyramid
  | TKSubmissionEntryDoughnut
  | TKSubmissionEntryPolar
  | TKSubmissionEntryRadar;

// ////////////////////////////////////////////////////////////////////////////
// helpers method
// ////////////////////////////////////////////////////////////////////////////

function getTrafficLightColor(
  value: string,
  trafficLight: TKFDFTrafficLightGrouped
): TKTrafficLightValues {
  if (!value) {
    return TKTrafficLightValues.UNDEFINED;
  }
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

export function TKCreateSubmissionEntryBullet(
  value: string,
  rule: TKFDFSubmissionRule,
  surveyConfiguration: TKFDF,
  thematic: TKSubmissionThematic,
  listSeparator: string
): TKSubmissionEntryBullet {
  const isAnswered = value !== "";
  let correctedValue: Array<TKLabel> = [];
  if (isAnswered) {
    correctedValue = value.split(listSeparator).map(x => {
      x = x.trim();
      return surveyConfiguration.answersLabels[x]
        ? surveyConfiguration.answersLabels[x]
        : { en: x };
    });
  }

  if (
    surveyConfiguration.submissionsRules[rule.fieldName].trafficLightName &&
    !(
      surveyConfiguration.submissionsRules[rule.fieldName].trafficLightName in
      surveyConfiguration.trafficLights
    )
  ) {
    console.warn(
      `[WARNING] Traffic light category "${
        surveyConfiguration.submissionsRules[rule.fieldName].trafficLightName
      }" does not exist`
    );
  }

  return {
    type: TKSubmissionEntryType.BULLET,
    thematic: thematic,
    field: rule.fieldName,
    fieldLabel: surveyConfiguration.fieldsLabels[rule.fieldName],
    answersLabels: correctedValue,
    isAnswered: isAnswered,
    trafficLight:
      surveyConfiguration.submissionsRules[rule.fieldName].trafficLightName
        .length > 0,
    trafficLightColor:
      surveyConfiguration.submissionsRules[rule.fieldName].trafficLightName
        .length > 0
        ? getTrafficLightColor(
            value,
            surveyConfiguration.trafficLights[
              surveyConfiguration.submissionsRules[rule.fieldName]
                .trafficLightName
            ]
          )
        : TKTrafficLightValues.UNDEFINED
  };
}

export function TKCreateSubmissionEntryList(
  value: string,
  rule: TKFDFSubmissionRule,
  surveyConfiguration: TKFDF,
  thematic: TKSubmissionThematic,
  listSeparator: string,
  locales: string[]
): TKSubmissionEntryText {
  const isAnswered = value !== "";
  let correctedValue: Record<string, string> = {};
  if (isAnswered) {
    locales.map(
      lang =>
        (correctedValue[lang] = value
          .split(listSeparator)
          .map(x => {
            x = x.trim();
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
    correctedValue =
      isAnswered && surveyConfiguration.answersLabels[value]
        ? surveyConfiguration.answersLabels[value]
        : { en: value };
  }

  if (
    surveyConfiguration.submissionsRules[rule.fieldName].trafficLightName &&
    !(
      surveyConfiguration.submissionsRules[rule.fieldName].trafficLightName in
      surveyConfiguration.trafficLights
    )
  ) {
    console.info(
      `[WARNING] Traffic light category "${
        surveyConfiguration.submissionsRules[rule.fieldName].trafficLightName
      }" does not exist`
    );
  }

  return {
    type: TKSubmissionEntryType.TEXT,
    thematic: thematic,
    field: rule.fieldName,
    fieldLabel: surveyConfiguration.fieldsLabels[rule.fieldName],
    answerLabel: correctedValue,
    isAnswered: isAnswered,
    trafficLight:
      surveyConfiguration.submissionsRules[rule.fieldName].trafficLightName
        .length > 0,
    trafficLightColor:
      surveyConfiguration.submissionsRules[rule.fieldName].trafficLightName
        .length > 0
        ? getTrafficLightColor(
            value,
            surveyConfiguration.trafficLights[
              surveyConfiguration.submissionsRules[rule.fieldName]
                .trafficLightName
            ]
          )
        : TKTrafficLightValues.UNDEFINED
  };
}

export function TKCreateSubmissionEntryText(
  value: string,
  rule: TKFDFSubmissionRule,
  surveyConfiguration: TKFDF,
  thematic: TKSubmissionThematic
): TKSubmissionEntryText {
  const isAnswered = value !== "";

  const correctedValue =
    isAnswered && surveyConfiguration.answersLabels[value]
      ? surveyConfiguration.answersLabels[value]
      : { en: value };

  if (
    surveyConfiguration.submissionsRules[rule.fieldName].trafficLightName &&
    !(
      surveyConfiguration.submissionsRules[rule.fieldName].trafficLightName in
      surveyConfiguration.trafficLights
    )
  ) {
    console.info(
      `[WARNING] Traffic light category "${
        surveyConfiguration.submissionsRules[rule.fieldName].trafficLightName
      }" does not exist`
    );
  }

  return {
    type: TKSubmissionEntryType.TEXT,
    thematic: thematic,
    field: rule.fieldName,
    fieldLabel: surveyConfiguration.fieldsLabels[rule.fieldName],
    answerLabel: correctedValue,
    isAnswered: isAnswered,
    trafficLight:
      surveyConfiguration.submissionsRules[rule.fieldName].trafficLightName
        .length > 0,
    trafficLightColor:
      surveyConfiguration.submissionsRules[rule.fieldName].trafficLightName
        .length > 0
        ? getTrafficLightColor(
            value,
            surveyConfiguration.trafficLights[
              surveyConfiguration.submissionsRules[rule.fieldName]
                .trafficLightName
            ]
          )
        : TKTrafficLightValues.UNDEFINED
  };
}
