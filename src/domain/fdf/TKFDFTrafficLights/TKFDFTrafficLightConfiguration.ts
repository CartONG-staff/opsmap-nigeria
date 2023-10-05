import { TKFDFTrafficLightProperties } from "./TKFDFTrafficLightProperties";

// ////////////////////////////////////////////////////////////////////////////
// Type
// ////////////////////////////////////////////////////////////////////////////

/**
 * Enum - contains all traffic light type possiblity
 * @Remarks
 * Helper Discrimation Types setup
 */
export enum TKFDFTrafficLightType {
  KEY_VALUE = "key_value",
  MATH = "math",
  EQUAL_VALUE = "equal_value"
}

// ////////////////////////////////////////////////////////////////////////////
// Generic
// ////////////////////////////////////////////////////////////////////////////
/**
 * Abstract TL Definition
 * @Remarks
 * Helper Discrimation Types setup
 */
interface AbstractTKFDFTrafficLight {
  properties: TKFDFTrafficLightProperties;
}

// ////////////////////////////////////////////////////////////////////////////
// Key_values
// ////////////////////////////////////////////////////////////////////////////
/**
 * "Key value" type of traffic lights
 *
 * The values field is a map from an answer to the key of an entry of the colormap
 * "Yes": "green"
 */
export interface TKFDFTrafficLightKeyValue extends AbstractTKFDFTrafficLight {
  type: TKFDFTrafficLightType.KEY_VALUE;
  values: Record<string, string>; // [key]: colormapKey
}

/**
 * "Math" type of traffic lights
 *
 * If scope is undefined, a scope {x: currentItemValue} is used
 * values is a set of formula -> colormap key
 * "x<15": "green"
 */
export interface TKFDFTrafficLightMath extends AbstractTKFDFTrafficLight {
  type: TKFDFTrafficLightType.MATH;
  scope?: Record<string, string>; // [variableName]: key
  values: Record<string, string>; // [formula]: colormapKey
}

/**
 * "NotNone" type of traffic lights
 *
 */
export interface TKFDFTrafficLightEqualValue extends AbstractTKFDFTrafficLight {
  type: TKFDFTrafficLightType.EQUAL_VALUE;
  value: string;
  ok: string;
  notok: string;
}

// ////////////////////////////////////////////////////////////////////////////
// Union type
// ////////////////////////////////////////////////////////////////////////////
/**
 * Discrimation Union type
 * The discriminatory field will be "type"
 */
export type TKFDFTrafficLightConfiguration =
  | TKFDFTrafficLightKeyValue
  | TKFDFTrafficLightMath
  | TKFDFTrafficLightEqualValue;
