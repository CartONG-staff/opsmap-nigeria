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
  BAR = "bar",
  DOUGHNUT = "doughnut",
  RADAR = "radar"
}

export enum TKFDFChartBarType {
  SINGLE = "single",
  DUO = "duo"
}

export enum TKFDFChartBarDirection {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical"
}
// ////////////////////////////////////////////////////////////////////////////
// Key_values
// ////////////////////////////////////////////////////////////////////////////

export interface TKFDFChartBarConfigurationItem {
  id: string;
  index: number;
  color: TKColor;
  label: TKLabel | string;
}

// Bar ////////////////////////////////////////////////////////////////////////
export interface TKFDFChartBarConfiguration {
  direction: TKFDFChartBarDirection;
  valueLabels?: Array<TKLabel>;
  titleAxis: {
    value: string | TKLabel;
    notValue: string | TKLabel;
  };
  populationType: TKFDFChartBarType;
  population: Array<TKFDFChartBarConfigurationItem>;
}
export interface TKFDFChartBar extends TKFDFChartBarConfiguration {
  type: TKFDFChartType.BAR;
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
  | TKFDFChartBar
  | TKFDFChartDoughnut
  | TKFDFChartPolarArea
  | TKFDFChartRadar;
