import { Component, Mixins } from "vue-property-decorator";
import { Bar, mixins } from "vue-chartjs";

@Component({
  extends: Bar, // this is important to add the functionality to your component
  mixins: [mixins.reactiveProp]
})
@Component
export default class TKSurveyPyramidChart extends Mixins(mixins.reactiveProp, Bar) {
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      datasets: [
        {
          label: "GitHub Commits",
          backgroundColor: "#f87979",
          data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
        }
      ]
    });
  }
}