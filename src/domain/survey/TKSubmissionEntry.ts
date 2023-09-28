import { TKFDF } from "@/domain/fdf/TKFDF";
import { TKLabel } from "@/domain/utils/TKLabel";
import { TKSubmissionThematic } from "./TKSubmissionThematic";
import { TKFDFSubmissionRule } from "@/domain/fdf/TKFDFSubmissionsRules";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import { TKFDFTrafficLightConfiguration } from "@/domain/fdf/TKFDFTrafficLights/TKFDFTrafficLightConfiguration";
import {
  getTrafficLight,
  getTrafficLightConfiguration
} from "./TKSubmissionEntryTrafficLightProcesser";
import { TKFDFTrafficLightColormapItem } from "@/domain/fdf/TKFDFTrafficLights/TKFDFTrafficLightColormap";
import {
  TKFDFGraphAgePyramid,
  TKFDFGraphDoughnut,
  TKFDFGraphPolarArea,
  TKFDFGraphRadar,
  TKFDFGraphType
} from "../fdf/TKFDFGraphs/TKFDFGraphConfiguration";

export interface TKSubmissionEntryTrafficLight {
  configuration: TKFDFTrafficLightConfiguration;
  rank: number;
  value: TKFDFTrafficLightColormapItem;
}

// ////////////////////////////////////////////////////////////////////////////
// Entry abstract concept definition
// ////////////////////////////////////////////////////////////////////////////

export enum TKSubmissionEntryTextType {
  TEXT = "text",
  BULLET = "bullet"
}
interface AbstractTKSubmissionEntry {
  type: TKSubmissionEntryTextType | TKFDFGraphType;
}
export interface TKSubmissionEntryText extends AbstractTKSubmissionEntry {
  type: TKSubmissionEntryTextType.TEXT;
  thematic: TKSubmissionThematic;
  field: string;
  fieldLabel: TKLabel;
  answerLabel: TKLabel;
  trafficLight?: TKSubmissionEntryTrafficLight;
  isAnswered: boolean;
}

export interface TKSubmissionEntryBullet extends AbstractTKSubmissionEntry {
  type: TKSubmissionEntryTextType.BULLET;
  thematic: TKSubmissionThematic;
  field: string;
  fieldLabel: TKLabel;
  answersLabels: TKLabel[];
  isAnswered: boolean;
}
export interface TKSubmissionEntryAgePyramid extends AbstractTKSubmissionEntry {
  type: TKFDFGraphType.AGE_PYRAMID;
  config: TKFDFGraphAgePyramid;
  thematic: TKSubmissionThematic;
  chartid: string;
  title: TKLabel;
  malesEntries: Array<number>;
  femalesEntries: Array<number>;
  malesLabels: Array<TKLabel>;
  isAnswered: true;
  femalesLabels: Array<TKLabel>;
}

export interface TKSubmissionEntryDoughnut extends AbstractTKSubmissionEntry {
  type: TKFDFGraphType.DOUGHNUT;
  config: TKFDFGraphDoughnut;
  thematic: TKSubmissionThematic;
  chartid: string;
  title: TKLabel;
  isAnswered: true;
  entries: Array<{ value: number; label: TKLabel }>;
}
export interface TKSubmissionEntryPolar extends AbstractTKSubmissionEntry {
  type: TKFDFGraphType.POLAR_AREA;
  config: TKFDFGraphPolarArea;
  thematic: TKSubmissionThematic;
  chartid: string;
  title: TKLabel;
  isAnswered: true;
  entries: Array<{ value: number; label: TKLabel }>;
}

export interface TKSubmissionEntryRadar extends AbstractTKSubmissionEntry {
  type: TKFDFGraphType.RADAR;
  config: TKFDFGraphRadar;
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
    type: TKSubmissionEntryTextType.TEXT,
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
    type: TKSubmissionEntryTextType.TEXT,
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
    type: TKSubmissionEntryTextType.BULLET,
    thematic: thematic,
    field: rule.fieldName,
    fieldLabel: surveyConfiguration.fieldsLabels[rule.fieldName],
    answersLabels: correctedValue,
    isAnswered: isAnswered
  };
}
