<template lang="html">
  <canvas :id="ctx" :height="height"></canvas>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartConfiguration,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from "chart.js";
import { TKSubmissionEntryAgePyramid } from "@/domain/survey/TKSubmissionEntry";
import { TKColors } from "@/domain/utils/TKColors";
import { v4 } from "uuid";
import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import TKPDFInfosModule from "@/store/modules/pdfinfos/TKPDFInfosModule";
import {
  TKFDFChartAgePyramidType,
  TKFDFChartAgePyramidDirection,
  TKFDFChartAgePyramidConfigurationItem
} from "@/domain/fdf/TKFDFCharts/TKFDFChartConfiguration";
import { TKLabel } from "@/domain/utils/TKLabel";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Title,
  Tooltip
);

@Component
export default class TKSubmissionItemAgePyramidChart extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntryAgePyramid;

  // charts
  chart!: Chart;
  readonly ctx = v4();

  height = 0;
  readonly barthickness = 15;

  // TODO : make this nice. translate, style customizable, etc.

  beforeMount() {
    if (this.entry) {
      this.height = this.entry.labels.length * (this.barthickness - 1) + 240; // This is magic !
    }
  }

  mounted() {
    if (this.entry) {
      const config: ChartConfiguration = {
        type: "bar",
        data: {
          labels: this.generateLabels(),
          datasets: this.entry.config.population.map(item => {
            return {
              label: this.generateLabel(item.label),
              data: this.generateDataset(item),
              backgroundColor: item.color,
              barThickness: this.barthickness,
              minBarLength: 1,
              borderWidth: 2,
              borderColor: TKColors.DARK_GREY
            };
          })
        },
        options: {
          indexAxis:
            this.entry.config.direction ==
            TKFDFChartAgePyramidDirection.VERTICAL
              ? "y"
              : "x",
          responsive: true,
          maintainAspectRatio: false,
          font: {
            family: "Arial",
            size: 11
          },
          layout: {
            padding: 0
          },
          scales: this.generateScales(),
          plugins: {
            legend: {
              position: "bottom",
              reverse: true,
              labels: {
                color: TKColors.SECONDARY,
                font: {
                  family: "Arial",
                  size: 11
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem): string {
                  const value = Math.abs(Number(tooltipItem.raw));
                  let label = tooltipItem.dataset.label;
                  label = value > 1 ? label + "s" : label;
                  if (!label?.endsWith(":")) {
                    label += ":";
                  }
                  return label + value.toString();
                },
                title: function(tooltipItems): string {
                  const sum = tooltipItems.reduce(function(
                    accumulateur,
                    valeurCourante
                  ): number {
                    return accumulateur + Math.abs(Number(valeurCourante.raw));
                  },
                  0);
                  let label = tooltipItems[0].label;
                  if (!label?.endsWith(":")) {
                    label += ":";
                  }
                  return label + " " + sum.toString();
                }
              },
              titleFont: {
                family: "Arial",
                size: 11
              },
              bodyFont: {
                family: "Arial",
                size: 11
              }
            }
          },
          animation: {
            onComplete: this.updateBase64data
          }
        }
      };

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(this.ctx, config);
    }
  }

  updateBase64data() {
    TKPDFInfosModule.currentChartsBase64[
      this.entry.chartid
    ] = this.chart.toBase64Image("image/png", 1);
  }

  @Watch("entry")
  onEntryChanged() {
    // Update labels and data Labels
    this.chart.data.labels = this.generateLabels();
    for (const pop of this.entry.config.population) {
      this.chart.data.datasets[pop.index].data = this.generateDataset(pop);
    }

    this.chart.update();
  }

  @Watch("$root.$i18n.locale")
  onLocalChanged() {
    if (this.chart.options.plugins && this.chart.options.plugins.title) {
      this.chart.options.plugins.title.text = TKGetLocalValue(
        this.entry.title,
        this.$i18n.locale
      );
    }
    this.chart.data.labels = this.generateLabels();
    for (const pop of this.entry.config.population) {
      this.chart.data.datasets[pop.index].label = this.generateLabel(pop.label);
    }

    if (this.chart.config.options) {
      this.chart.config.options.scales = this.generateScales();
    }

    this.chart.update();
  }

  generateLabels(): Array<string> {
    if (!this.entry) {
      return [];
    }

    return this.entry.labels.map(item =>
      TKGetLocalValue(item, this.$i18n.locale)
    );
  }

  generateDataset(pop: TKFDFChartAgePyramidConfigurationItem): Array<number> {
    return this.entry.config.populationType == TKFDFChartAgePyramidType.DUO &&
      pop.index == 0
      ? this.entry.values[pop.id].map(item => -1 * item)
      : this.entry.values[pop.id];
  }

  generateLabel(label: TKLabel | string): string {
    return typeof label == "string"
      ? this.$root.$i18n.t(label).toString()
      : TKGetLocalValue(label, this.$root.$i18n.locale);
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  generateScales(): any {
    const axis1 = {
      ticks: {
        callback: (value: string): string => {
          let mynumber = 0;
          if (typeof value === "string") {
            mynumber = parseInt(value);
          } else if (typeof value === "number") {
            mynumber = value;
          }
          mynumber = mynumber < 0 ? 0 - mynumber : mynumber;
          return mynumber.toString();
        },
        color: TKColors.SECONDARY
      },
      title: {
        align: "end",
        color: TKColors.DARK_GREY,
        display: true,
        text: this.generateLabel(this.entry.config.titleAxis.value)
      }
    };

    const axis2 = {
      beginAtZero: true,
      grid: {
        display: false
      },
      stacked: true,
      ticks: {
        color: TKColors.SECONDARY
      },
      title: {
        align: "end",
        color: TKColors.DARK_GREY,
        display: true,
        text: this.generateLabel(this.entry.config.titleAxis.notValue)
      }
    };
    return {
      x:
        this.entry.config.direction == TKFDFChartAgePyramidDirection.VERTICAL
          ? axis1
          : axis2,
      y:
        this.entry.config.direction == TKFDFChartAgePyramidDirection.VERTICAL
          ? axis2
          : axis1
    };
  }
}
</script>
