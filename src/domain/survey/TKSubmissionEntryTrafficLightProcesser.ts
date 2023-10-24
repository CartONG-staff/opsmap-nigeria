import { TKFDF } from "@/domain/fdf/TKFDF";
import { TKFDFSubmissionRule } from "@/domain/fdf/TKFDFSubmissionsRules";
import { TKFDFTrafficLight } from "@/domain/fdf/TKFDFTrafficLights/TKFDFTrafficLight";
import {
  TKFDFTrafficLightConfiguration,
  TKFDFTrafficLightListCount,
  TKFDFTrafficLightMath,
  TKFDFTrafficLightType
} from "@/domain/fdf/TKFDFTrafficLights/TKFDFTrafficLightConfiguration";
import { getRankValue } from "@/domain/fdf/TKFDFTrafficLights/TKFDFTrafficLightRank";
import {
  TKMathExpressionBuildDefaultScope,
  TKMathExpressionBuildScope,
  TKMathExpressionEvaluate,
  TKMathExpressionScope
} from "@/domain/utils/TKMathExpression";
import { TKSubmissionRawEntries } from "./TKSubmissionEntry";
import { TKLabel } from "@/domain/utils/TKLabel";

// ////////////////////////////////////////////////////////////////////////////
// TrafficLight helpers method
// ////////////////////////////////////////////////////////////////////////////

export function getTrafficLightConfiguration(
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

function generateOutput(
  colormapKey: string,
  configuration: TKFDFTrafficLightConfiguration
) {
  return {
    configuration: configuration,
    rank: getRankValue(colormapKey, configuration),
    value: configuration.properties.colormap[colormapKey]
  };
}
function generateErrorOutput(configuration: TKFDFTrafficLightConfiguration) {
  return generateOutput(configuration.properties.colorerror, configuration);
}

function evaluateMathOperations(
  configuration: TKFDFTrafficLightMath | TKFDFTrafficLightListCount,
  scope: TKMathExpressionScope
): TKFDFTrafficLight | undefined {
  for (const operation in configuration.values) {
    const isValid = TKMathExpressionEvaluate(operation, scope);
    if (isValid) {
      const colormapKey = configuration.values[operation];
      return generateOutput(colormapKey, configuration);
    }
  }
  return;
}

// ////////////////////////////////////////////////////////////////////////////
// TrafficLight helpers method
// ////////////////////////////////////////////////////////////////////////////

export function getTrafficLight(
  input: string,
  submissionRawEntries: TKSubmissionRawEntries,
  configuration: TKFDFTrafficLightConfiguration | undefined,
  inputList?: string[] | TKLabel[]
): TKFDFTrafficLight | undefined {
  // If no traffic light for this value
  if (!configuration) {
    return undefined;
  }

  // If no value
  if (!input) {
    return generateErrorOutput(configuration);
  }

  // Actually compute Traffic Lights ////////////////////////////////////////////
  switch (configuration.type) {

    case TKFDFTrafficLightType.KEY_VALUE: {
      if (!(input in configuration.values)) {
        return generateErrorOutput(configuration);
      } else {
        const colormapKey = configuration.values[input];
        if (!(colormapKey in configuration.properties.colormap)) {
          return generateErrorOutput(configuration);
        }
        return generateOutput(colormapKey, configuration);
      }
    }

    case TKFDFTrafficLightType.EQUAL_VALUE: {
      if (input == configuration.value) {
        const colormapKey = configuration.ok;
        if (!(colormapKey in configuration.properties.colormap)) {
          return generateErrorOutput(configuration);
        }
        return generateOutput(colormapKey, configuration);
      } else {
        const colormapKey = configuration.notok;
        if (!(colormapKey in configuration.properties.colormap)) {
          return generateErrorOutput(configuration);
        }
        return generateOutput(colormapKey, configuration);
      }
    }

    case TKFDFTrafficLightType.MATH: {
      const scope = configuration.scope
        ? TKMathExpressionBuildScope(configuration.scope, submissionRawEntries)
        : TKMathExpressionBuildDefaultScope(parseFloat(input));
      return evaluateMathOperations(configuration, scope) ?? generateErrorOutput(configuration);
    }

    case TKFDFTrafficLightType.LIST_COUNT: {
      if (inputList !== undefined) {
        const scope: TKMathExpressionScope = { x: inputList.length };
        return evaluateMathOperations(configuration, scope) ?? generateErrorOutput(configuration);
      }
      break;
    }

    default: {
      return generateErrorOutput(configuration);
    }
  }
}
