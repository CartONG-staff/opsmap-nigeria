<template lang="html">
  <div class="tk-submission-item-doughnut-chart">
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

  readonly height = 150;

  mounted() {
    const config: ChartConfiguration = {
      type: "doughnut",
      data: {
        labels: [
          "Number of pregnant/lactating women",
          "Single elderly households",
          "Person with mental health disabilities",
          "Person with permanent phyical disabilities",
          "Child headed households",
          "Female headed households"
        ],
        datasets: [
          {
            data: [512, 52, 1, 24, 1, 236],
            backgroundColor: [
              "#ff335c",
              "#12bfce",
              "#c6ecae",
              "#642b50",
              "#8b9376",
              "#b2916c"
            ]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Specific group",
            font: {
              size: 14
            }
          },
          legend: {
            position: "left",
            reverse: true
          }
        }
      }
    };

    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(this.ctx, config);
  }

  @Watch("entry")
  onEntryChanged() {
    // Update labels and data Labels
    // this.chart.data.labels = this.generateLabels();
    // this.chart.data.datasets[0].data = this.generateFemalesDataset();
    // this.chart.data.datasets[1].data = this.generateMalesDataset();

    this.chart.update();
  }

  @Watch("$root.$i18n.locale")
  onLocalChanged() {
    this.chart.update();
  }
}
</script>

<style scoped>
.tk-submission-item-doughnut-chart {
  background-color: #ffffff;
  border-radius: 8px;
  padding-top: 15px;
  padding-bottom: 15px;
}
</style>
