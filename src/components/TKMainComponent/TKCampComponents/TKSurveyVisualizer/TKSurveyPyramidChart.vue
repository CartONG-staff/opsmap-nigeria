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
      labels: [
        "60 or older",
        "36-59 years",
        "18-35 years",
        "6-17 years",
        "0-5 years"
      ],
      datasets: [
        {
          label: "Female",
          data: [12, 19, 1, 5, 0],
          backgroundColor: "#f37788",
          barThickness: 15,
          minBarLength: 1
        },
        {
          label: "Male",
          data: [-4, -8, -2, -14, 0],
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
            size: 14
          }
        },
        legend: {
          position: "top",
          reverse: true
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
          }
        }
      }
      // scales: {
      //   yAxes: [{
      //     barThickness: 15
      //   }]
      // },
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
