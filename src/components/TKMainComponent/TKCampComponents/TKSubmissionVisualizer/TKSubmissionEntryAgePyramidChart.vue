<template lang="html">
  <div class="tk-submission-item-pyramid-chart">
    <canvas :id="ctx" height="260"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Filler,
  Legend,
  Title,
  Tooltip,
  ChartConfiguration
} from "chart.js";
import { TKSubmissionEntryAgePyramid } from "@/domain/survey/TKSubmissionEntryAgePyramid";
Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Filler,
  Legend,
  Title,
  Tooltip
);

@Component
export default class TKSubmissionItemAgePyramidChart extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntryAgePyramid;

  // charts
  chart!: Chart;
  readonly ctx = Date.now().toString();

  // TODO : make this nice. translate, style customizable, etc.

  mounted() {
    if (this.entry) {
      const config: ChartConfiguration = {
        type: "bar",
        data: {
          labels: this.generateLabels(),
          datasets: [
            {
              label: this.$root.$i18n.t("charts.female").toString(),
              data: this.generateFemalesDataset(),
              backgroundColor: "#f37788",
              barThickness: 15,
              minBarLength: 1
            },
            {
              label: this.$root.$i18n.t("charts.male").toString(),
              data: this.generateMalesDataset(),
              backgroundColor: "#4095cd",
              barThickness: 15,
              minBarLength: 1
            }
          ]
        },
        options: {
          indexAxis: "y", // Make bar horizontal !
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
            title: {
              display: true,
              text: this.$root.$i18n.t("charts.agePyramidTitle").toString(),
              font: {
                family: "Arial",
                size: 12
              }
            },
            legend: {
              position: "top",
              reverse: true,
              labels: {
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
                  return label + ": " + value.toString();
                },
                title: function(tooltipItems): string {
                  const sum = tooltipItems.reduce(function(
                    accumulateur,
                    valeurCourante
                  ): number {
                    return accumulateur + Math.abs(Number(valeurCourante.raw));
                  },
                  0);
                  return tooltipItems[0].label + ": " + sum.toString();
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
          }
        }
      };

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(this.ctx, config);
    }
  }

  @Watch("entry")
  onEntryChanged() {
    // Update labels and data Labels
    this.chart.data.labels = this.generateLabels();
    this.chart.data.datasets[0].data = this.generateFemalesDataset();
    this.chart.data.datasets[1].data = this.generateMalesDataset();

    this.chart.update();
  }

  @Watch("$root.$i18n.locale")
  onLocalChanged() {
    if (this.chart.options.plugins && this.chart.options.plugins.title) {
      this.chart.options.plugins.title.text = this.$root.$i18n
        .t("charts.agePyramidTitle")
        .toString();
    }

    this.chart.data.datasets[0].label = this.$root.$i18n
      .t("charts.female")
      .toString();

    this.chart.data.datasets[1].label = this.$root.$i18n
      .t("charts.male")
      .toString();

    if (this.chart.config.options) {
      this.chart.config.options.scales = this.generateScales();
    }

    this.chart.update();
  }

  generateLabels(): Array<string> {
    if (this.entry) {
      return this.entry.femalesLabels.map(item =>
        item.en
          .replace("Females ", "")
          .replace("(", "")
          .replace(")", "")
      );
    } else {
      return [];
    }
  }

  generateMalesDataset(): Array<number> {
    if (this.entry) {
      return this.entry.malesEntries.map(item => -1 * item);
    } else {
      return [];
    }
  }

  generateFemalesDataset(): Array<number> {
    if (this.entry) {
      return this.entry.femalesEntries;
    } else {
      return [];
    }
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */

  generateScales(): any {
    return {
      x: {
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
          }
        },
        title: {
          display: true,
          text: this.$root.$i18n.t("charts.titleX").toString()
        }
      },
      y: {
        beginAtZero: true,
        stacked: true,
        title: {
          display: true,

          text: this.$root.$i18n.t("charts.titleY").toString()
        }
      }
    };
  }
}
</script>

<style scoped>
.tk-submission-item-pyramid-chart {
  background-color: transparent;
  border-radius: 3px;
}

.tk-submission-item-pyramid-chart {
  padding-top: 15px;
  padding-bottom: 15px;
}
</style>
