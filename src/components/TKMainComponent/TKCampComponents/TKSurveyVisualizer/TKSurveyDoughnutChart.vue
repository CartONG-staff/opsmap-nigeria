<template lang="html">
  <div class="tk-survey-doughnut-chart">
    <canvas :id="ctx"> </canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
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
export default class TKSurveyDoughnutChart extends Vue {
  @Prop()
  readonly name!: string;

  // charts
  chart!: Chart;

  ctx = this.name;
  config: ChartConfiguration = {
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

  mounted() {
    if (this.chart) {
      this.chart.destroy();
    }
    console.log(this.ctx);
    if (this.ctx && this.config) {
      this.chart = new Chart(this.ctx, this.config);
    }
  }
}
</script>

<style scoped>
.tk-survey-doughnut-chart {
  background-color: #ffffff;
  border-radius: 8px;
  padding-top: 15px;
  padding-bottom: 15px;
}
</style>
