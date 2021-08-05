<template lang="html">
  <div>
    <canvas :id="ctx" :height="height"> </canvas>
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
import { v4 } from "uuid";
import { TKSubmissionEntryDoughnut } from "@/domain/survey/TKSubmissionEntry";
import { TKGetLocalValue } from "@/domain/ui/TKLabel";
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
export default class TKSubmissionItemDoughnutChart extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntryDoughnut;

  // charts
  chart!: Chart;
  readonly ctx = v4();
  readonly height = 300;
  readonly colors = [
    "#ff335c",
    "#12bfce",
    "#c6ecae",
    "#642b50",
    "#8b9376",
    "#b2916c"
  ];

  mounted() {
    if (this.entry) {
      const config: ChartConfiguration = {
        type: "doughnut",
        data: {
          labels: this.generateLabels(),
          datasets: [
            {
              data: this.generateValues(),
              backgroundColor: this.colors
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          elements: {
            arc: {
              borderColor: "#d8d8d8",
              borderWidth: 1
            }
          },
          font: {
            family: "Arial",
            size: 11
          },
          layout: {
            padding: 0
          },
          plugins: {
            title: {
              display: true,
              text: TKGetLocalValue(this.entry.title, this.$i18n.locale),
              font: {
                family: "Arial",
                size: 12
              }
            },
            legend: {
              position: "bottom",
              align: "start",
              reverse: true,
              labels: {
                boxWidth: 15,
                font: {
                  family: "Arial",
                  size: 11
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem): string {
                  return tooltipItem.label;
                }
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
    this.chart.data.datasets[0].data = this.generateValues();

    this.chart.update();
  }

  @Watch("$root.$i18n.locale")
  onLocalChanged() {
    this.chart.data.labels = this.generateLabels();
    this.chart.update();
  }

  generateValues(): Array<number> {
    if (this.entry) {
      return this.entry.entries.map(item => item.value);
    } else {
      return [];
    }
  }

  generateLabels(): Array<string> {
    if (this.entry) {
      return this.entry.entries.map(
        item =>
          TKGetLocalValue(item.label, this.$root.$i18n.locale) +
          " " +
          item.value
      );
    } else {
      return [];
    }
  }
}
</script>
