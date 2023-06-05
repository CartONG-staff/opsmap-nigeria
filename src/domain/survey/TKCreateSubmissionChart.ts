/* eslint-disable @typescript-eslint/no-explicit-any */
import { TKFDF } from "@/domain/fdf/TKFDF";
import {
  TKSubmissionEntryType,
  TKSubmissionEntryRadar,
  TKSubmissionEntryAgePyramid,
  TKSubmissionEntryDoughnut,
  TKSubmissionEntryPolar
} from "./TKSubmissionEntry";
import { TKLabel } from "../utils/TKLabel";
import { TKSubmissionThematic } from "./TKSubmissionThematic";
import { TKSubmissionEntries } from "./TKSubmissionEntries";

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
          en: vote
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
          en: item.field
        }
      };
    });
  }

  return chartDataLabeled;
}

export function TKCreateSubmissionChart(
  chartData: TKChartData,
  surveyConfiguration: TKFDF,
  entries: TKSubmissionEntries
) {
  const chartDataLabeled = applyOptions(chartData, surveyConfiguration);
  if (chartDataLabeled.id.includes("age_pyramid")) {
    const malesEntries = chartDataLabeled.data
      .filter(item => item.type === "m")
      .reverse();
    const femalesEntries = chartDataLabeled.data
      .filter(item => item.type === "f")
      .reverse();

    const entry: TKSubmissionEntryAgePyramid = {
      type: TKSubmissionEntryType.CHART_PYRAMID,
      thematic: chartData.thematic,
      chartid: chartDataLabeled.id,
      isAnswered: true,
      title: surveyConfiguration.fieldsLabels[chartDataLabeled.id],
      malesEntries: malesEntries.map(item => Number(item.value)),
      femalesEntries: femalesEntries.map(item => Number(item.value)),
      malesLabels: malesEntries.map(item => item.field),
      femalesLabels: femalesEntries.map(item => item.field)
    };
    entries[entry.chartid] = entry;
  } else if (chartDataLabeled.id.includes("doughnut")) {
    const entry: TKSubmissionEntryDoughnut = {
      type: TKSubmissionEntryType.CHART_DOUGHNUT,
      thematic: chartData.thematic,
      chartid: chartDataLabeled.id,
      isAnswered: true,
      title: surveyConfiguration.fieldsLabels[chartDataLabeled.id],
      entries: chartDataLabeled.data.map(item => {
        return {
          value: Number(item.value),
          label: item.field
        };
      })
    };
    entries[entry.chartid] = entry;
  } else if (chartDataLabeled.id.includes("polar_area_chart")) {
    const entry: TKSubmissionEntryPolar = {
      type: TKSubmissionEntryType.CHART_POLAR,
      thematic: chartData.thematic,
      chartid: chartDataLabeled.id,
      isAnswered: true,
      title: surveyConfiguration.fieldsLabels[chartDataLabeled.id],
      entries: chartDataLabeled.data.map(item => {
        return {
          value: Number(item.value),
          label: item.field
        };
      })
    };
    entries[entry.chartid] = entry;
  } else if (chartDataLabeled.id.includes("radar_chart")) {
    const entry: TKSubmissionEntryRadar = {
      type: TKSubmissionEntryType.CHART_RADAR,
      thematic: chartData.thematic,
      chartid: chartDataLabeled.id,
      isAnswered: true,
      title: surveyConfiguration.fieldsLabels[chartDataLabeled.id],
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
