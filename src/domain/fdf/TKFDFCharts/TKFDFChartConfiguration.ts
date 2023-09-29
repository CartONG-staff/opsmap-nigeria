// ////////////////////////////////////////////////////////////////////////////
// Type
// ////////////////////////////////////////////////////////////////////////////

import { TKColor } from "@/domain/utils/TKColors";
import { TKLabel } from "@/domain/utils/TKLabel";

/**
 * Enum - contains all charts
 * @Remarks
 * Helper Discrimation Types setup
 */
export enum TKFDFChartType {
  POLAR_AREA = "polar",
  AGE_PYRAMID = "age_pyramid",
  DOUGHNUT = "doughnut",
  RADAR = "radar"
}

export enum TKFDFChartAgePyramidType {
  SINGLE = "single",
  DUO = "duo"
}
// ////////////////////////////////////////////////////////////////////////////
// Key_values
// ////////////////////////////////////////////////////////////////////////////

export interface TKFDFChartAgePyramidConfigurationItem {
  id: string;
  index: number;
  color: TKColor;
  label: TKLabel | string;
}

// AGE PYRAMID ////////////////////////////////////////////////////////////////
export interface TKFDFChartAgePyramidConfiguration {
  legendLabels?: Array<TKLabel>;
  populationType: TKFDFChartAgePyramidType;
  population: Array<TKFDFChartAgePyramidConfigurationItem>;
}
export interface TKFDFChartAgePyramid
  extends TKFDFChartAgePyramidConfiguration {
  type: TKFDFChartType.AGE_PYRAMID;
}

// DOUGHNUT ///////////////////////////////////////////////////////////////////
export interface TKFDFChartDoughnutConfiguration {
  colors: Array<TKColor>;
}
export interface TKFDFChartDoughnut extends TKFDFChartDoughnutConfiguration {
  type: TKFDFChartType.DOUGHNUT;
}

// DOUGHNUT ///////////////////////////////////////////////////////////////////
export interface TKFDFChartPolarAreaConfiguration {
  colors: Array<TKColor>;
}
export interface TKFDFChartPolarArea extends TKFDFChartPolarAreaConfiguration {
  type: TKFDFChartType.POLAR_AREA;
}

// DOUGHNUT ///////////////////////////////////////////////////////////////////
export interface TKFDFChartRadarConfiguration {
  color: TKColor;
}
export interface TKFDFChartRadar extends TKFDFChartRadarConfiguration {
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
  | TKFDFChartAgePyramid
  | TKFDFChartDoughnut
  | TKFDFChartPolarArea
  | TKFDFChartRadar;
