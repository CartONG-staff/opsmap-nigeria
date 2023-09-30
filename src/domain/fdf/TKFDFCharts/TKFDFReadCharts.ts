import { TKFDFChartsConfiguration } from "@/domain/fdf/TKFDFCharts/TKFDFChartsConfiguration";
import { TKFDFChartBarType, TKFDFChartType } from "./TKFDFChartConfiguration";
import {
  DEFAULT_PROPERTIES_BAR_DIRECTION,
  DEFAULT_PROPERTIES_BAR_DUO,
  DEFAULT_PROPERTIES_BAR_SINGLE,
  DEFAULT_PROPERTIES_BAR_TITLEAXIS,
  DEFAULT_PROPERTIES_BAR_TYPE,
  DEFAULT_PROPERTIES_DOUGHNUT,
  DEFAULT_PROPERTIES_POLAR_AREA,
  DEFAULT_PROPERTIES_RADAR
} from "./TKFDFChartsDefaultProperties";

// ////////////////////////////////////////////////////////////////////////////
// Read Chart Configuration json
// ////////////////////////////////////////////////////////////////////////////

export async function TKFDFReadCharts(
  file: string
): Promise<TKFDFChartsConfiguration> {
  const json: TKFDFChartsConfiguration = await fetch(file, {
    cache: "no-store"
  }).then(response => response.json());

  // ////////////////////////////////////////////////////////////////////////////
  // Check errors in the file
  // ////////////////////////////////////////////////////////////////////////////

  if (!json.charts) {
    json.charts = {};
    console.warn("[FDF] The Charts field is missing in the json.");
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Check errors in the file
  // ////////////////////////////////////////////////////////////////////////////

  for (const chartName in json.charts) {
    const config = json.charts[chartName];
    switch (config.type) {
      case TKFDFChartType.BAR:
        if (!config.populationType) {
          config.populationType = DEFAULT_PROPERTIES_BAR_TYPE;
        }
        if (!config.direction) {
          config.direction = DEFAULT_PROPERTIES_BAR_DIRECTION;
        }

        if (!config.titleAxis) {
          config.titleAxis = DEFAULT_PROPERTIES_BAR_TITLEAXIS;
        }

        switch (config.populationType) {
          case TKFDFChartBarType.DUO:
            config.valueLabels =
              config.valueLabels ?? DEFAULT_PROPERTIES_BAR_DUO.valueLabels;
            config.population =
              config.population ?? DEFAULT_PROPERTIES_BAR_DUO.population;
            break;
          case TKFDFChartBarType.SINGLE:
            config.valueLabels =
              config.valueLabels ?? DEFAULT_PROPERTIES_BAR_SINGLE.valueLabels;
            config.population =
              config.population ?? DEFAULT_PROPERTIES_BAR_SINGLE.population;
            break;
        }
        break;
      case TKFDFChartType.DOUGHNUT:
        config.colors = config.colors ?? DEFAULT_PROPERTIES_DOUGHNUT.colors;
        break;
      case TKFDFChartType.POLAR_AREA:
        config.colors = config.colors ?? DEFAULT_PROPERTIES_POLAR_AREA.colors;
        break;
      case TKFDFChartType.RADAR:
        config.color = config.color ?? DEFAULT_PROPERTIES_RADAR.color;
    }
  }

  return json;
}
