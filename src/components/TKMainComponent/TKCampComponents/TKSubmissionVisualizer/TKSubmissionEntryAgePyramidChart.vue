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
import { TKSubmissionEntryAgePyramid } from "@/domain/core/TKSubmissionEntry";
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

  mounted() {
    if (this.entry) {
      const config: ChartConfiguration = {
        type: "bar",
        data: {
          labels: this.generateLabels(),
          datasets: [
            {
              label: "Female",
              data: this.generateFemalesDataset(),
              backgroundColor: "#f37788",
              barThickness: 15,
              minBarLength: 1
            },
            {
              label: "Male",
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
            size: 11
          },
          layout: {
            padding: 20
          },
          scales: {
            x: {
              ticks: {
                callback: (value, _index, _values): string => {
                  let mynumber = 0;
                  if (typeof value === "string") {
                    mynumber = parseInt(value);
                  } else if (typeof value === "number") {
                    mynumber = value;
                  }
                  mynumber = mynumber < 0 ? 0 - mynumber : mynumber;
                  return mynumber.toString();
                }
              }
            },
            y: {
              beginAtZero: true,
              stacked: true
            }
          },
          plugins: {
            title: {
              display: true,
              text: "AgePyramid",
              font: {
                size: 12
              }
            },
            legend: {
              position: "top",
              reverse: true,
              labels: {
                font: {
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
                size: 11
              },
              bodyFont: {
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

  generateLabels(): Array<string> {
    if (this.entry) {
      return this.entry.femalesLabels.map(
        item =>
          item.field_label_en
            .replace("Females ", "")
            .replace("(", "")
            .replace(")", "") + " years old"
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
}
</script>

<style scoped>
.tk-submission-item-pyramid-chart {
  background-color: #ffffff;
  border-radius: 8px;
}

.tk-submission-item-pyramid-chart {
  padding-top: 15px;
  padding-bottom: 15px;
}
</style>
