import { TKFDF } from "../fdf/TKFDF";
import { TKLabel } from "../utils/TKLabel";
import { TKSubmissionThematic } from "./TKSubmissionThematic";
import { TKFDFSubmissionRule } from "../fdf/TKFDFSubmissionsRules";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import { TKFDFTrafficLightConfiguration } from "../fdf/TKFDFTrafficLights/TKFDFTrafficLightConfiguration";
import { TKFDFTrafficLightItem } from "../fdf/TKFDFTrafficLights/TKFDFTrafficLightItem";
import {
  getTrafficLight,
  getTrafficLightConfiguration
} from "./TKSubmissionEntryTrafficLightProcesser";

export interface TKSubmissionEntryTrafficLight {
  configuration: TKFDFTrafficLightConfiguration;
  rank: number;
  value: TKFDFTrafficLightItem;
}

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
  trafficLight?: TKSubmissionEntryTrafficLight;
  isAnswered: boolean;
}

export interface TKSubmissionEntryBullet {
  type: TKSubmissionEntryType.BULLET;
  thematic: TKSubmissionThematic;
  field: string;
  fieldLabel: TKLabel;
  answersLabels: TKLabel[];
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
  const valueSplitted = value.split(listSeparator);
  if (isAnswered) {
    locales.map(
      lang =>
        (correctedValue[lang] = valueSplitted
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
        : { [TKConfigurationModule.configuration.locale.default]: value };
  }

  return {
    type: TKSubmissionEntryType.TEXT,
    thematic: thematic,
    field: rule.fieldName,
    fieldLabel: surveyConfiguration.fieldsLabels[rule.fieldName],
    answerLabel: correctedValue,
    isAnswered: isAnswered,
    trafficLight: undefined
  };
}

export function TKCreateSubmissionEntryText(
  value: string,
  rule: TKFDFSubmissionRule,
  surveyConfiguration: TKFDF,
  submissionRawEntries: TKSubmissionRawEntries,
  thematic: TKSubmissionThematic
): TKSubmissionEntryText {
  const isAnswered = value !== "";

  const correctedValue =
    isAnswered && surveyConfiguration.answersLabels[value]
      ? surveyConfiguration.answersLabels[value]
      : { [TKConfigurationModule.configuration.locale.default]: value };

  return {
    type: TKSubmissionEntryType.TEXT,
    thematic: thematic,
    field: rule.fieldName,
    fieldLabel: surveyConfiguration.fieldsLabels[rule.fieldName],
    answerLabel: correctedValue,
    isAnswered: isAnswered,
    trafficLight: getTrafficLight(
      value,
      submissionRawEntries,
      getTrafficLightConfiguration(rule, surveyConfiguration)
    )
  };
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
        : { [TKConfigurationModule.configuration.locale.default]: x };
    });
  }

  return {
    type: TKSubmissionEntryType.BULLET,
    thematic: thematic,
    field: rule.fieldName,
    fieldLabel: surveyConfiguration.fieldsLabels[rule.fieldName],
    answersLabels: correctedValue,
    isAnswered: isAnswered
  };
}
