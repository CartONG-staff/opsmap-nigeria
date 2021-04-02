<template lang="html">
  <div class="tk-survey-thematic-container">
    <div class="tk-survey-thematic-header">
      <div class="tk-survey-thematic-title">{{ title }}</div>
      <img class="tk-survey-icon" :src="icon_url" />
    </div>
    <div class="tk-survey-thematic-content">
      <template v-for="(item, key) in items">
        <div v-if="key !== 0" class="tk-hseparator" :key="item.name"></div>
        <div
          v-if="item.trafficLight"
          class="tk-survey-thematic-content-layout-w-trafficLight"
          :key="key"
        >
          <div :key="item.name" class="tk-survey-thematic-content-item">
            <div class="tk-survey-thematic-content-item-field-name">
              {{ item.name }}
            </div>
            <div class="tk-survey-thematic-content-item-field-value">
              {{ item.value }}
            </div>
            <div class="tk-trafficlight">
              <div
                v-if="item.trafficLight === 1"
                class="tk-trafficlight-ok"
              ></div>
              <div
                v-if="item.trafficLight === 2"
                class="tk-trafficlight-warning"
              ></div>
              <div
                v-if="item.trafficLight === 3"
                class="tk-trafficlight-critical"
              ></div>
            </div>
          </div>
        </div>

        <div
          v-if="!item.trafficLight"
          class="tk-survey-thematic-content-layout-wo-trafficLight"
          :key="key"
        >
          <div :key="key" class="tk-survey-thematic-content-item">
            <div class="tk-survey-thematic-content-item-field-name">
              {{ item.name }}
            </div>
            <div class="tk-survey-thematic-content-item-field-value">
              {{ item.value }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import { TKIconUrl } from "@/domain/UI/TKIcons";
import { TKSurveyItemI, TrafficLight } from "./TKSurveyItemI";

@Component
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
      value: "NO",
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
  font-weight: bold;
  color: #333;
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

.tk-survey-thematic-content-item {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
}

.tk-survey-thematic-content-item-field-name {
  font-weight: bold;
  font-size: 11px;
  color: #999;
  flex-grow: 1;
}

.tk-survey-thematic-content-item-field-value {
  font-weight: bold;
  font-size: 11px;
  color: #333;
  line-height: 2.727;
}

.tk-survey-thematic-content-layout-w-trafficLight {
  margin-right: -20px;
}

.tk-trafficlight {
  width: 20px;
  text-align: center;
  height: 100%;
}

.tk-trafficlight-ok {
  height: 8px;
  width: 8px;
  background-color: green;
  border-radius: 50%;
  margin: 0 auto;
}

.tk-trafficlight-warning {
  height: 8px;
  width: 8px;
  background-color: orange;
  border-radius: 50%;
  margin: 0 auto;
}

.tk-trafficlight-critical {
  height: 8px;
  width: 8px;
  background-color: #e91d1d;
  border-radius: 50%;
  margin: 0 auto;
}
</style>
