/* eslint-disable @typescript-eslint/no-explicit-any */
import { TKFDF } from "@/domain/fdf/TKFDF";
import {
  TKSubmissionEntryRadar,
  TKSubmissionEntryAgePyramid,
  TKSubmissionEntryDoughnut,
  TKSubmissionEntryPolar
} from "./TKSubmissionEntry";
import { TKLabel } from "@/domain/utils/TKLabel";
import { TKSubmissionThematic } from "./TKSubmissionThematic";
import { TKSubmissionEntries } from "./TKSubmissionEntries";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import { TKFDFGraphType } from "../fdf/TKFDFGraphs/TKFDFGraphConfiguration";

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

  const chartConfiguration = fdf.graphs.graphs[chartDataLabeled.id];

  if (chartConfiguration.type === TKFDFGraphType.AGE_PYRAMID) {
    const malesEntries = chartDataLabeled.data
      .filter(item => item.type === "m")
      .reverse();
    const femalesEntries = chartDataLabeled.data
      .filter(item => item.type === "f")
      .reverse();

    const entry: TKSubmissionEntryAgePyramid = {
      type: TKFDFGraphType.AGE_PYRAMID,
      config: chartConfiguration,
      thematic: chartData.thematic,
      chartid: chartDataLabeled.id,
      isAnswered: true,
      title: fdf.fieldsLabels[chartDataLabeled.id],
      malesEntries: malesEntries.map(item => Number(item.value)),
      femalesEntries: femalesEntries.map(item => Number(item.value)),
      malesLabels: malesEntries.map(item => item.field),
      femalesLabels: femalesEntries.map(item => item.field)
    };
    entries[entry.chartid] = entry;
  } else if (chartConfiguration.type === TKFDFGraphType.DOUGHNUT) {
    const entry: TKSubmissionEntryDoughnut = {
      type: TKFDFGraphType.DOUGHNUT,
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
  } else if (chartConfiguration.type === TKFDFGraphType.POLAR_AREA) {
    const entry: TKSubmissionEntryPolar = {
      type: TKFDFGraphType.POLAR_AREA,
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
  } else if (chartConfiguration.type === TKFDFGraphType.RADAR) {
    const entry: TKSubmissionEntryRadar = {
      type: TKFDFGraphType.RADAR,
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
