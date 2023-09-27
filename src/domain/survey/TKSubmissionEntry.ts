import { TKFDF } from "../fdf/TKFDF";
import { TKLabel } from "../utils/TKLabel";
import { TKSubmissionThematic } from "./TKSubmissionThematic";
import { TKFDFSubmissionRule } from "../fdf/TKFDFSubmissionsRules";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import {
  TKFDFTrafficLightConfiguration,
  TKFDFTrafficLightType
} from "../fdf/TKFDFTrafficLights/TKFDFTrafficLightConfiguration";
import { TKFDFTrafficLightItem } from "../fdf/TKFDFTrafficLights/TKFDFTrafficLightItem";
import { DEFAULT_ERROR_TRAFFICLIGHT } from "../fdf/TKFDFTrafficLights/TKFDFTrafficLightsDefaultProperties";
import {
  UNDEFINED_RANK_VALUE,
  getRankValue
} from "../fdf/TKFDFTrafficLights/TKFDFTrafficLightRank";

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
  trafficLight?: TKSubmissionEntryTrafficLight;
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
// TrafficLight helpers method
// ////////////////////////////////////////////////////////////////////////////

function getTrafficLightConfiguration(
  rule: TKFDFSubmissionRule,
  surveyConfiguration: TKFDF
): TKFDFTrafficLightConfiguration | undefined {
  if (
    !surveyConfiguration.submissionsRules[rule.fieldName].trafficLightName ||
    !surveyConfiguration.submissionsRules[rule.fieldName].trafficLightName
      .length
  ) {
    return undefined;
  }
  if (
    !(
      surveyConfiguration.submissionsRules[rule.fieldName].trafficLightName in
      surveyConfiguration.trafficLights.trafficLights
    )
  ) {
    console.warn(
      `[WARNING] Traffic light category "${
        surveyConfiguration.submissionsRules[rule.fieldName].trafficLightName
      }" does not exist`
    );
    return undefined;
  }

  return surveyConfiguration.trafficLights.trafficLights[
    surveyConfiguration.submissionsRules[rule.fieldName].trafficLightName
  ];
}

function getTrafficLight(
  value: string,
  configuration: TKFDFTrafficLightConfiguration | undefined
):
  | {
      configuration: TKFDFTrafficLightConfiguration;
      rank: number;
      value: TKFDFTrafficLightItem;
    }
  | undefined {
  if (!configuration) {
    return undefined;
  }
  // TODO: update structure to remove this check
  if (
    !configuration.properties ||
    !configuration.properties.colormap ||
    !configuration.properties.colorerror
  ) {
    return {
      configuration: configuration,
      rank: UNDEFINED_RANK_VALUE,
      value: DEFAULT_ERROR_TRAFFICLIGHT
    };
  }
  if (!value) {
    const colormapKey = configuration.properties.colorerror;
    return {
      configuration: configuration,
      rank: getRankValue(colormapKey, configuration),
      value: configuration.properties.colormap[colormapKey]
    };
  }

  // Type Key Value
  if (configuration.type === TKFDFTrafficLightType.KEY_VALUE) {
    if (!(value in configuration.values)) {
      const colormapKey = configuration.properties.colorerror;
      return {
        configuration: configuration,
        rank: getRankValue(colormapKey, configuration),
        value: configuration.properties.colormap[colormapKey]
      };
    }
    const colormapKey = configuration.values[value];
    if (!(colormapKey in configuration.properties.colormap)) {
      return {
        configuration: configuration,
        rank: getRankValue(colormapKey, configuration),
        value: configuration.properties.colormap[colormapKey]
      };
    }

    return {
      configuration: configuration,
      rank: getRankValue(colormapKey, configuration),
      value: configuration.properties.colormap[colormapKey]
    };
  }
  //   if (trafficLight.type === TKFDFTrafficLightTypes.MATH) {
  //     let match;
  //     for (const item of trafficLight.values) {
  //       const conditions = item.value.split("and");
  //       // TODO: remove evaluate. Only depencey to mathjs.
  //       const result = conditions.map(x => evaluate(Number(value) + x));
  //       if (!result.includes(false)) {
  //         match = item.color;
  //       }
  //     }
  //     return match === undefined ? TKTrafficLightValues.ERROR : match;
  //   }
  //   if (trafficLight.type === TKFDFTrafficLightTypes.LIST) {
  //     const match = trafficLight.values
  //       .filter(x => x.value.toLowerCase() === value.toLowerCase())
  //       .map(x => x.color)
  //       .pop();
  //     return match === undefined ? TKTrafficLightValues.CRITICAL : match;
  //   }
  //   if (trafficLight.type === TKFDFTrafficLightTypes.NOTINLIST) {
  //     const condition = value !== "none";
  //     return condition ? TKTrafficLightValues.OK : TKTrafficLightValues.CRITICAL;
  //   }
  //   return TKTrafficLightValues.ERROR;
  return {
    configuration: configuration,
    rank: UNDEFINED_RANK_VALUE,
    value: DEFAULT_ERROR_TRAFFICLIGHT
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
    isAnswered: isAnswered,
    trafficLight: getTrafficLight(
      value,
      getTrafficLightConfiguration(rule, surveyConfiguration)
    )
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
        : { [TKConfigurationModule.configuration.locale.default]: value };
  }

  return {
    type: TKSubmissionEntryType.TEXT,
    thematic: thematic,
    field: rule.fieldName,
    fieldLabel: surveyConfiguration.fieldsLabels[rule.fieldName],
    answerLabel: correctedValue,
    isAnswered: isAnswered,
    trafficLight: getTrafficLight(
      value,
      getTrafficLightConfiguration(rule, surveyConfiguration)
    )
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
      getTrafficLightConfiguration(rule, surveyConfiguration)
    )
  };
}
