// ////////////////////////////////////////////////////////////////////////////
// Type
// ////////////////////////////////////////////////////////////////////////////

/**
 * Enum - contains all charts
 * @Remarks
 * Helper Discrimation Types setup
 */
export enum TKFDFChartType {
  POLAR_AREA = "polar_area",
  AGE_PYRAMID = "age_pyramid",
  DOUGHNUT = "doughnut",
  RADAR = "radar"
}

// ////////////////////////////////////////////////////////////////////////////
// Key_values
// ////////////////////////////////////////////////////////////////////////////

export interface TKFDFChartPolarArea {
  type: TKFDFChartType.POLAR_AREA;
}

export interface TKFDFChartAgePyramid {
  type: TKFDFChartType.AGE_PYRAMID;
}

export interface TKFDFChartDoughnut {
  type: TKFDFChartType.DOUGHNUT;
}

export interface TKFDFChartRadar {
  type: TKFDFChartType.RADAR;
}

// ////////////////////////////////////////////////////////////////////////////
// Union type
// ////////////////////////////////////////////////////////////////////////////
/**
 * Discrimation Union type
 * The discriminatory field will be "type"
 */
export type TKFDFChartConfiguration =
  | TKFDFChartPolarArea
  | TKFDFChartAgePyramid
  | TKFDFChartDoughnut
  | TKFDFChartRadar;
