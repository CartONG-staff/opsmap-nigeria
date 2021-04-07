<template lang="html">
  <div class="tk-survey-thematic-container">
    <div class="tk-survey-thematic-header">
      <div class="tk-survey-thematic-title">{{ title }}</div>
      <img class="tk-survey-icon" :src="icon_url" />
    </div>
    <div class="tk-survey-thematic-content">
      <TKSurveyPyramidChart class="tk-survey-chart" :name="title + 'bars'" />
      <TKSurveyDoughnutChart
        class="tk-survey-chart"
        :name="title + 'doughnut'"
      />
      <div v-for="(item, key) in items" :key="item.id">
        <div v-if="key !== 0" class="tk-hseparator"></div>
        <TKSurveyItem :item="item" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import { TKIconUrl } from "@/domain/UI/TKIcons";
import { TKSurveyItemI, TrafficLight } from "./TKSurveyItemI";
import TKSurveyItem from "./TKSurveyItem.vue";
import TKSurveyPyramidChart from "./TKSurveyPyramidChart.vue";
import TKSurveyDoughnutChart from "./TKSurveyDoughnutChart.vue";

@Component({
  components: {
    TKSurveyItem,
    TKSurveyDoughnutChart,
    TKSurveyPyramidChart
  }
})
export default class TKSurveyThematic extends Vue {
  @Prop()
  readonly title!: string;

  @Prop()
  readonly icon_name!: string;
  icon_url = TKIconUrl(this.icon_name);

  readonly items: TKSurveyItemI[] = [
    {
      name: "Camp management on site",
      value: "No",
      trafficLight: TrafficLight.OK
    },
    {
      name: "Site facilitation",
      value: "MOBILE"
    },
    {
      name: "Site facilitatorrs covering the site",
      value: "1"
    },
    {
      name: "Rate number of site facilitator by population",
      value: "867",
      trafficLight: TrafficLight.WARNING
    },
    {
      name: "Market inside the site",
      value: "?",
      trafficLight: TrafficLight.CRITICAL
    }
  ];
}
</script>

<style scoped>
.tk-survey-thematic-container {
  border-radius: 15px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  border: 3px solid #f1f3f3;
  width: 100%;
  background-color: #f1f3f3;
  overflow: hidden;
}

.tk-survey-thematic-header {
  padding: 0px 20px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  height: 75px;
  background-color: #fff;
}

.tk-survey-thematic-title {
  font-size: 16px;
  font-weight: bolder;
  color: var(--v-quaternary-base);
}

.tk-survey-chart {
  margin-bottom: 13px;
  margin-top: 13px;
}

.tk-survey-icon {
  height: 36px;
  display: block;
}

.tk-survey-thematic-content {
  padding: 0px 20px;
  width: 100%;
}

.tk-hseparator {
  background-color: #d8d8d8;
  height: 1px;
  width: 100%;
}
</style>
