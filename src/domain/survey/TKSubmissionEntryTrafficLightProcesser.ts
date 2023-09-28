import { TKFDF } from "../fdf/TKFDF";
import { TKFDFSubmissionRule } from "../fdf/TKFDFSubmissionsRules";
import {
  TKFDFTrafficLightConfiguration,
  TKFDFTrafficLightListCriteria,
  TKFDFTrafficLightType
} from "../fdf/TKFDFTrafficLights/TKFDFTrafficLightConfiguration";
import { TKFDFTrafficLightItem } from "../fdf/TKFDFTrafficLights/TKFDFTrafficLightItem";
import { getRankValue } from "../fdf/TKFDFTrafficLights/TKFDFTrafficLightRank";
import { evaluate } from "mathjs";

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
  configuration: TKFDFTrafficLightConfiguration | undefined
):
  | {
      configuration: TKFDFTrafficLightConfiguration;
      rank: number;
      value: TKFDFTrafficLightItem;
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
    case TKFDFTrafficLightType.KEY_VALUE:
      if (!(input in configuration.values)) {
        return generateErrorOutput(configuration);
      } else {
        const colormapKey = configuration.values[input];
        if (!(colormapKey in configuration.properties.colormap)) {
          return generateErrorOutput(configuration);
        }
        return generateOutput(colormapKey, configuration);
      }

    // Type Math
    case TKFDFTrafficLightType.MATH:
      for (const operation in configuration.values) {
        const conditions = operation.split("and");
        // TODO: remove evaluate. Only depencey to mathjs.
        const result = conditions.map(x => evaluate(Number(input) + x));
        if (!result.includes(false)) {
          const colormapKey = configuration.values[operation];
          return generateOutput(colormapKey, configuration);
        }
      }
      return generateErrorOutput(configuration);

    default:
      return generateErrorOutput(configuration);
  }
}
