// ////////////////////////////////////////////////////////////////////////////
// TrafficLights collection datatype
// ////////////////////////////////////////////////////////////////////////////

import { TKColors } from "../utils/TKColors";

export enum TKFDFTrafficLightTypes {
  STRING = "string",
  MATH = "math",
  LIST = "list",
  NOTINLIST = "notnone"
}

export enum TKTrafficLightValues {
  OK = "green",
  CAUTION = "yellow",
  WARNING = "orange",
  DANGER = "red",
  CRITICAL = "darkred",
  UNDEFINED = "grey",
  ERROR = "purple"
}

export function getColorFromValue(
  trafficLight: TKTrafficLightValues | undefined
) {
  if (!trafficLight) {
    return TKColors.TRAFFICLIGHT_ERROR;
  }
  switch (trafficLight) {
    case TKTrafficLightValues.OK:
      return TKColors.TRAFFICLIGHT_OK;
    case TKTrafficLightValues.CAUTION:
      return TKColors.TRAFFICLIGHT_CAUTION;
    case TKTrafficLightValues.WARNING:
      return TKColors.TRAFFICLIGHT_WARNING;
    case TKTrafficLightValues.DANGER:
      return TKColors.TRAFFICLIGHT_DANGER;
    case TKTrafficLightValues.CRITICAL:
      return TKColors.TRAFFICLIGHT_CRITICAL;
    case TKTrafficLightValues.UNDEFINED:
      return TKColors.TRAFFICLIGHT_UNDEFINED;
    case TKTrafficLightValues.ERROR:
      return TKColors.TRAFFICLIGHT_ERROR;
    default:
      return TKColors.TRAFFICLIGHT_ERROR;
  }
}

export function getTradIndexFromValue(
  trafficLight: TKTrafficLightValues | undefined
) {
  if (!trafficLight) {
    return TKColors.TRAFFICLIGHT_UNDEFINED;
  }
  switch (trafficLight) {
    case TKTrafficLightValues.OK:
      return "trafficlight.ok";
    case TKTrafficLightValues.CAUTION:
      return "trafficlight.caution";
    case TKTrafficLightValues.WARNING:
      return "trafficlight.warning";
    case TKTrafficLightValues.DANGER:
      return "trafficlight.danger";
    case TKTrafficLightValues.CRITICAL:
      return "trafficlight.critical";
    case TKTrafficLightValues.UNDEFINED:
      return "trafficlight.undefined";
    case TKTrafficLightValues.ERROR:
      return "trafficlight.error";
    default:
      return "trafficlight.other";
  }
}

// ////////////////////////////////////////////////////////////////////////////
// helper:Sorting
// ////////////////////////////////////////////////////////////////////////////
export function getMaxRankValue(): number {
  return 5;
}
export function getRankValue(
  trafficLight: TKTrafficLightValues | undefined
): number {
  // rank:
  //       CRITICAL = 0
  //       DANGER = 1
  //       WARNING = 2
  //       CAUTION = 3
  //       OK = 4
  //       UNDEFINED = 5
  if (!trafficLight) {
    return getMaxRankValue();
  }
  switch (trafficLight) {
    case TKTrafficLightValues.CRITICAL:
      return 0;
    case TKTrafficLightValues.DANGER:
      return 1;
    case TKTrafficLightValues.WARNING:
      return 2;
    case TKTrafficLightValues.CAUTION:
      return 3;
    case TKTrafficLightValues.OK:
      return 4;
    case TKTrafficLightValues.UNDEFINED:
      return 5;
    case TKTrafficLightValues.ERROR:
      return 6;
    default:
      return 7;
  }
}

export interface TKFDFTrafficLightGrouped {
  type: TKFDFTrafficLightTypes;
  values: [
    {
      value: string;
      color: TKTrafficLightValues;
    }
  ];
}

export interface TKFDFTrafficLightsCollection {
  [propName: string]: TKFDFTrafficLightGrouped;
}
