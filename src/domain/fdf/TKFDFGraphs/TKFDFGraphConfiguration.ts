// ////////////////////////////////////////////////////////////////////////////
// Type
// ////////////////////////////////////////////////////////////////////////////

/**
 * Enum - contains all graphs
 * @Remarks
 * Helper Discrimation Types setup
 */
export enum TKFDFGraphType {
  POLAR_AREA = "polar_area",
  AGE_PYRAMID = "age_pyramid",
  DOUGHNUT = "doughnut",
  RADAR = "radar"
}

// ////////////////////////////////////////////////////////////////////////////
// Key_values
// ////////////////////////////////////////////////////////////////////////////

export interface TKFDFGraphPolarArea {
  type: TKFDFGraphType.POLAR_AREA;
}

export interface TKFDFGraphAgePyramid {
  type: TKFDFGraphType.AGE_PYRAMID;
}

export interface TKFDFGraphDoughnut {
  type: TKFDFGraphType.DOUGHNUT;
}

export interface TKFDFGraphRadar {
  type: TKFDFGraphType.RADAR;
}

// ////////////////////////////////////////////////////////////////////////////
// Union type
// ////////////////////////////////////////////////////////////////////////////
/**
 * Discrimation Union type
 * The discriminatory field will be "type"
 */
export type TKFDFGraphConfiguration =
  | TKFDFGraphPolarArea
  | TKFDFGraphAgePyramid
  | TKFDFGraphDoughnut
  | TKFDFGraphRadar;
