import {
  TKFDFChartAgePyramidConfiguration,
  TKFDFChartAgePyramidType,
  TKFDFChartDoughnutConfiguration,
  TKFDFChartPolarAreaConfiguration,
  TKFDFChartRadarConfiguration
} from "./TKFDFChartConfiguration";

export enum TKChartsColors {
  CHART_COLOR_1 = "#6FC5BC",
  CHART_COLOR_2 = "#1B657C",
  CHART_COLOR_3 = "#4595AD",
  CHART_COLOR_4 = "#F1D7AC",
  CHART_COLOR_5 = "#EEEDF7",
  CHART_COLOR_6 = "#CBA0A1",
  CHART_COLOR_7 = "#8C9CB0",
  CHART_COLOR_8 = "#D3E0C9"
}

// ////////////////////////////////////////////////////////////////////////////
// Charts Colors
// ////////////////////////////////////////////////////////////////////////////

export const DEFAULT_PROPERTIES_AGE_PYRAMID_DUO: TKFDFChartAgePyramidConfiguration = {
  legendLabels: undefined,
  populationType: TKFDFChartAgePyramidType.DUO,
  population: [
    {
      id: "m",
      index: 0,
      color: TKChartsColors.CHART_COLOR_1,
      label: "charts.male"
    },
    {
      id: "f",
      index: 1,
      color: TKChartsColors.CHART_COLOR_2,
      label: "charts.female"
    }
  ]
};
export const DEFAULT_PROPERTIES_AGE_PYRAMID_SINGLE: TKFDFChartAgePyramidConfiguration = {
  legendLabels: undefined,
  populationType: TKFDFChartAgePyramidType.SINGLE,
  population: [
    {
      id: "p",
      index: 0,
      color: TKChartsColors.CHART_COLOR_1,
      label: "charts.population"
    }
  ]
};

export const DEFAULT_PROPERTIES_DOUGHNUT: TKFDFChartDoughnutConfiguration = {
  colors: [
    TKChartsColors.CHART_COLOR_6,
    TKChartsColors.CHART_COLOR_7,
    TKChartsColors.CHART_COLOR_8,
    TKChartsColors.CHART_COLOR_4,
    TKChartsColors.CHART_COLOR_5
  ]
};

export const DEFAULT_PROPERTIES_POLAR_AREA: TKFDFChartPolarAreaConfiguration = {
  colors: [
    TKChartsColors.CHART_COLOR_1,
    TKChartsColors.CHART_COLOR_2,
    TKChartsColors.CHART_COLOR_3,
    TKChartsColors.CHART_COLOR_4,
    TKChartsColors.CHART_COLOR_5
  ]
};

export const DEFAULT_PROPERTIES_RADAR: TKFDFChartRadarConfiguration = {
  color: TKChartsColors.CHART_COLOR_1
};
