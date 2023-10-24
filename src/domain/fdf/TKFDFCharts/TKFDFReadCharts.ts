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
        if (!config.barType) {
          config.barType = DEFAULT_PROPERTIES_BAR_TYPE;
        }
        if (!config.direction) {
          config.direction = DEFAULT_PROPERTIES_BAR_DIRECTION;
        }
        config.axis.x.title =
          config.axis.x.title ?? DEFAULT_PROPERTIES_BAR_TITLEAXIS.x;
        config.axis.y.title =
          config.axis.y.title ?? DEFAULT_PROPERTIES_BAR_TITLEAXIS.y;

        switch (config.barType) {
          case TKFDFChartBarType.DUO:
            config.axis.y.labels =
              config.axis.y.labels ?? DEFAULT_PROPERTIES_BAR_DUO.axis.y.labels;
            config.series = config.series ?? DEFAULT_PROPERTIES_BAR_DUO.series;
            break;
          case TKFDFChartBarType.SINGLE:
            config.axis.y.labels =
              config.axis.y.labels ?? DEFAULT_PROPERTIES_BAR_DUO.axis.y.labels;
            config.series =
              config.series ?? DEFAULT_PROPERTIES_BAR_SINGLE.series;
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
