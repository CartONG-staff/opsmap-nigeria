import { TKFDF } from "@/domain/fdf/TKFDF";
import { TKFDFSubmissionRule } from "@/domain/fdf/TKFDFSubmissionsRules";
import { TKFDFTrafficLightColormapItem } from "@/domain/fdf/TKFDFTrafficLights/TKFDFTrafficLightColormap";
import {
  TKFDFTrafficLightConfiguration,
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

// ////////////////////////////////////////////////////////////////////////////
// TrafficLight helpers method
// ////////////////////////////////////////////////////////////////////////////

export function getTrafficLight(
  input: string,
  submissionRawEntries: TKSubmissionRawEntries,
  configuration: TKFDFTrafficLightConfiguration | undefined,
  inputList?: string[] | TKLabel[]
):
  | {
      configuration: TKFDFTrafficLightConfiguration;
      rank: number;
      value: TKFDFTrafficLightColormapItem;
    }
  | undefined {
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
    // Type Key Value
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

    // Type Equal Value
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

    // Type Math
    case TKFDFTrafficLightType.MATH: {
      const scope = configuration.scope
        ? TKMathExpressionBuildScope(configuration.scope, submissionRawEntries)
        : TKMathExpressionBuildDefaultScope(parseFloat(input));
      for (const operation in configuration.values) {
        const isValid = TKMathExpressionEvaluate(operation, scope);
        if (isValid) {
          const colormapKey = configuration.values[operation];
          return generateOutput(colormapKey, configuration);
        }
      }
      return generateErrorOutput(configuration);
    }

    case TKFDFTrafficLightType.ITEM_NUMBER: {
      if (inputList !== undefined) {
        const scope: TKMathExpressionScope = {
          x: inputList.length
        };
        for (const operation in configuration.values) {
          const isValid = TKMathExpressionEvaluate(operation, scope);
          if (isValid) {
            const colormapKey = configuration.values[operation];
            return generateOutput(colormapKey, configuration);
          }
        }
      }
      return generateErrorOutput(configuration);
    }

    default: {
      return generateErrorOutput(configuration);
    }
  }
}
