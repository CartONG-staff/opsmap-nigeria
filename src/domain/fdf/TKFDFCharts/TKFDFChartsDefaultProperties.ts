import {
  TKFDFChartBarConfiguration,
  TKFDFChartBarDirection,
  TKFDFChartBarType,
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
export const DEFAULT_PROPERTIES_BAR_TYPE = TKFDFChartBarType.DUO;
export const DEFAULT_PROPERTIES_BAR_DIRECTION = TKFDFChartBarDirection.VERTICAL;

export const DEFAULT_PROPERTIES_BAR_TITLEAXIS = {
  value: "charts.titleX",
  notValue: "charts.titleY"
};

export const DEFAULT_PROPERTIES_BAR_DUO: TKFDFChartBarConfiguration = {
  direction: DEFAULT_PROPERTIES_BAR_DIRECTION,
  populationType: TKFDFChartBarType.DUO,
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
  ],
  titleAxis: DEFAULT_PROPERTIES_BAR_TITLEAXIS,
  valueLabels: undefined
};
export const DEFAULT_PROPERTIES_BAR_SINGLE: TKFDFChartBarConfiguration = {
  direction: DEFAULT_PROPERTIES_BAR_DIRECTION,
  populationType: TKFDFChartBarType.SINGLE,
  population: [
    {
      id: "p",
      index: 0,
      color: TKChartsColors.CHART_COLOR_1,
      label: "charts.population"
    }
  ],
  titleAxis: DEFAULT_PROPERTIES_BAR_TITLEAXIS,
  valueLabels: undefined
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
