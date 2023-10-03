/* eslint-disable @typescript-eslint/no-explicit-any */
import { TKFDF } from "@/domain/fdf/TKFDF";
import {
  TKSubmissionEntryRadar,
  TKSubmissionEntryBar,
  TKSubmissionEntryDoughnut,
  TKSubmissionEntryPolar
} from "./TKSubmissionEntry";
import { TKGetLocalValue, TKLabel } from "@/domain/utils/TKLabel";
import { TKSubmissionThematic } from "./TKSubmissionThematic";
import { TKSubmissionEntries } from "./TKSubmissionEntries";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import { TKFDFChartType } from "../fdf/TKFDFCharts/TKFDFChartConfiguration";

export type TKChartData = {
  id: string;
  thematic: TKSubmissionThematic;
  data: Array<{
    field: string;
    value: string;
    type: string;
  }>;
};

export type TKChartDataLabeled = {
  id: string;
  thematic: TKSubmissionThematic;
  data: Array<{
    field: TKLabel;
    value: string;
    type: string;
  }>;
};

function parseNameBasedOnAgePyramidType(name: string): string {
  return name
    .replace("Females", "")
    .replace("Males", "")
    .replace("(", "")
    .replace(")", "")
    .trim();
}

function applyOptions(
  chartData: TKChartData,
  surveyConfiguration: TKFDF
): TKChartDataLabeled {
  const chartDataLabeled: TKChartDataLabeled = {
    id: chartData.id,
    thematic: chartData.thematic,
    data: []
  };
  if (chartData.id.includes("chart_vote")) {
    const votes: Record<string, number> = {};
    for (const item of chartData.data) {
      if (!votes[item.value]) {
        votes[item.value] = 1;
      } else {
        votes[item.value]++;
      }
    }

    for (const vote in votes) {
      chartDataLabeled.data.push({
        field: surveyConfiguration.answersLabels[vote] ?? {
          [TKConfigurationModule.configuration.locale.default]: vote
        },
        value: String(votes[vote]),
        type: "string"
      });
    }
  } else {
    // Apply field translation
    chartDataLabeled.data = chartData.data.map<{
      field: TKLabel;
      value: string;
      type: string;
    }>(item => {
      return {
        value: item.value,
        type: item.type,
        field: surveyConfiguration.fieldsLabels[item.field] ?? {
          [TKConfigurationModule.configuration.locale.default]: item.field
        }
      };
    });
  }

  return chartDataLabeled;
}

export function TKCreateSubmissionChart(
  chartData: TKChartData,
  fdf: TKFDF,
  entries: TKSubmissionEntries
) {
  const chartDataLabeled = applyOptions(chartData, fdf);

  const chartConfiguration = fdf.charts.charts[chartDataLabeled.id];

  if (chartConfiguration.type === TKFDFChartType.BAR) {
    // Process data: sort them by id and extract numbers
    const values: Record<string, Array<number>> = {};
    for (const data of chartDataLabeled.data) {
      if (!values[data.type]) {
        values[data.type] = [];
      }
      values[data.type].push(Number(data.value));
    }

    const key = Object.keys(values).length ? Object.keys(values)[0] : "";
    const labels: Array<TKLabel> =
      chartConfiguration.yLabels ??
      (key
        ? chartDataLabeled.data
            .filter(item => item.type == key)
            .map(item => {
              return {
                [TKConfigurationModule.configuration.locale
                  .default]: parseNameBasedOnAgePyramidType(
                  TKGetLocalValue(
                    item.field,
                    TKConfigurationModule.configuration.locale.default
                  )
                )
              };
            })
            .reverse()
        : []);
    // TODO: Reverse array --> could be removed ?
    for (const type in values) {
      values[type] = values[type].reverse();
    }
    const entry: TKSubmissionEntryBar = {
      type: TKFDFChartType.BAR,
      config: chartConfiguration,
      thematic: chartData.thematic,
      chartid: chartDataLabeled.id,
      isAnswered: true,
      title: fdf.fieldsLabels[chartDataLabeled.id],
      values: values,
      labels: labels
    };
    entries[entry.chartid] = entry;
  } else if (chartConfiguration.type === TKFDFChartType.DOUGHNUT) {
    const entry: TKSubmissionEntryDoughnut = {
      type: TKFDFChartType.DOUGHNUT,
      config: chartConfiguration,
      thematic: chartData.thematic,
      chartid: chartDataLabeled.id,
      isAnswered: true,
      title: fdf.fieldsLabels[chartDataLabeled.id],
      entries: chartDataLabeled.data.map(item => {
        return {
          value: Number(item.value),
          label: item.field
        };
      })
    };
    entries[entry.chartid] = entry;
  } else if (chartConfiguration.type === TKFDFChartType.POLAR_AREA) {
    const entry: TKSubmissionEntryPolar = {
      type: TKFDFChartType.POLAR_AREA,
      config: chartConfiguration,
      thematic: chartData.thematic,
      chartid: chartDataLabeled.id,
      isAnswered: true,
      title: fdf.fieldsLabels[chartDataLabeled.id],
      entries: chartDataLabeled.data.map(item => {
        return {
          value: Number(item.value),
          label: item.field
        };
      })
    };
    entries[entry.chartid] = entry;
  } else if (chartConfiguration.type === TKFDFChartType.RADAR) {
    const entry: TKSubmissionEntryRadar = {
      type: TKFDFChartType.RADAR,
      config: chartConfiguration,
      thematic: chartData.thematic,
      chartid: chartDataLabeled.id,
      isAnswered: true,
      title: fdf.fieldsLabels[chartDataLabeled.id],
      entries: chartDataLabeled.data.map(item => {
        return {
          value: Number(item.value),
          label: item.field
        };
      })
    };
    entries[entry.chartid] = entry;
  }
}
