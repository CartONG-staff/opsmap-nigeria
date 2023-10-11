// ////////////////////////////////////////////////////////////////////////////
// Type
// ////////////////////////////////////////////////////////////////////////////

import { TKFDFTrafficLightProperties } from "../TKFDFTrafficLights/TKFDFTrafficLightProperties";

/**
 * Enum - contains all traffic light type possiblity
 * @Remarks
 * Helper Discrimation Types setup
 */
export enum TKFDFThematicTrafficLightType {
  MEAN = "mean",
  MIN = "min",
  MAX = "max"
}

// ////////////////////////////////////////////////////////////////////////////
// Generic
// ////////////////////////////////////////////////////////////////////////////

interface AbstractTKFDFThematicTrafficLight {
  properties: TKFDFTrafficLightProperties;
}

export interface TKFDFThematicTrafficLightMax
  extends AbstractTKFDFThematicTrafficLight {
  type: TKFDFThematicTrafficLightType.MAX;
}

export interface TKFDFThematicTrafficLightMean
  extends AbstractTKFDFThematicTrafficLight {
  type: TKFDFThematicTrafficLightType.MEAN;
}

export interface TKFDFThematicTrafficLightMin
  extends AbstractTKFDFThematicTrafficLight {
  type: TKFDFThematicTrafficLightType.MIN;
}

// ////////////////////////////////////////////////////////////////////////////
// Union type
// ////////////////////////////////////////////////////////////////////////////
/**
 * Discrimation Union type
 * The discriminatory field will be "type"
 */
export type TKFDFThematicTrafficLightConfiguration =
  | TKFDFThematicTrafficLightMax
  | TKFDFThematicTrafficLightMean
  | TKFDFThematicTrafficLightMin;
