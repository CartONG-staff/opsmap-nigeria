import { TKFDFTrafficLightsProperties } from "./TKFDFTrafficLightProperties";

// ////////////////////////////////////////////////////////////////////////////
// Type
// ////////////////////////////////////////////////////////////////////////////

export enum TKFDFTrafficLightType {
  KEY_VALUE = "key_value",
  MATH = "math",
  FROM_LIST = "from_list"
}

// ////////////////////////////////////////////////////////////////////////////
// Generic
// ////////////////////////////////////////////////////////////////////////////

interface TKFDFTrafficLight {
  type: TKFDFTrafficLightType;
  properties: TKFDFTrafficLightsProperties;
}

// ////////////////////////////////////////////////////////////////////////////
// Key_values
// ////////////////////////////////////////////////////////////////////////////

export interface TKFDFTrafficLightKeyValue extends TKFDFTrafficLight {
  type: TKFDFTrafficLightType.KEY_VALUE;
  values: Record<string, string>; // [key]: value
}

export interface TKFDFTrafficLightMath extends TKFDFTrafficLight {
  type: TKFDFTrafficLightType.MATH;
  values: Record<string, string>; // [formula]: value
}

export enum TKFDFTrafficLightListCriteria {
  INCLUDED = "included",
  NOT_INCLUDED = "not_included"
}
export interface TKFDFTrafficLightFromList extends TKFDFTrafficLight {
  type: TKFDFTrafficLightType.FROM_LIST;
  criteria: TKFDFTrafficLightListCriteria;
  values: Record<string, string>; // [formula]: value
  invalid: string;
}

// ////////////////////////////////////////////////////////////////////////////
// Union type
// ////////////////////////////////////////////////////////////////////////////

export type TKFDFTrafficLightConfiguration =
  | TKFDFTrafficLightKeyValue
  | TKFDFTrafficLightFromList
  | TKFDFTrafficLightMath;
