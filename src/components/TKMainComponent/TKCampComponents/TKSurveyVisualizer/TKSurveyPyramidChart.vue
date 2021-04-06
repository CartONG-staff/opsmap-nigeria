<template lang="html">
  <div class="tk-survey-pyramid-chart">
    <canvas :id="ctx" width="400" height="400"> </canvas>
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
export default class TKSurveyPyramidChart extends Vue {
  @Prop()
  readonly name!: string;

  // charts
  chart!: Chart;

  ctx = this.name;
  config: ChartConfiguration = {
    type: "bar",
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, -3, 5, 2, 3],
          backgroundColor: [
            "rgba(255, 99, 132)",
            "rgba(54, 162, 235)",
            "rgba(255, 206, 86)",
            "rgba(75, 192, 192)",
            "rgba(153, 102, 255)",
            "rgba(255, 159, 64)"
          ],
          // backgroundColor: [
          //   "rgba(255, 99, 132, 0.2)",
          //   "rgba(54, 162, 235, 0.2)",
          //   "rgba(255, 206, 86, 0.2)",
          //   "rgba(75, 192, 192, 0.2)",
          //   "rgba(153, 102, 255, 0.2)",
          //   "rgba(255, 159, 64, 0.2)"
          // ],
          // borderColor: [
          //   "rgba(255, 99, 132, 1)",
          //   "rgba(54, 162, 235, 1)",
          //   "rgba(255, 206, 86, 1)",
          //   "rgba(75, 192, 192, 1)",
          //   "rgba(153, 102, 255, 1)",
          //   "rgba(255, 159, 64, 1)"
          // ],
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      // legend: {
      //   position: "top",
      //   reverse: true
      // // },
      // title: {
      //   display: true,
      //   fontSize: 14,
      //   text: "Age Pyramid"
      // },
      scales: {
        y: {
          beginAtZero: true
        }
      },
      indexAxis: "y" // Make bar horizontal !
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
.tk-survey-pyramid-chart {
  background-color: #ffffff;
  border-radius: 8px;
}
</style>
