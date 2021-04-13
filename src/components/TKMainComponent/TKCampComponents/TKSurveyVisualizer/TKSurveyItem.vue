<template lang="html">
  <div class="tk-survey-item-container">
    <div v-if="item.trafficLight" class="tk-layout-w-trafficlight">
      <div class="tk-item-content">
        <div class="tk-item-field-name">
          {{ item.fieldLabel_en }}
        </div>
        <div class="tk-item-field-value">
          {{ item.answerLabel_en }}
        </div>
        <div class="tk-trafficlight">
          <div v-if="isOK" class="tk-trafficlight-ok"></div>
          <div v-if="isWarning" class="tk-trafficlight-warning"></div>
          <div v-if="isCritical" class="tk-trafficlight-critical"></div>
        </div>
      </div>
    </div>

    <div v-if="!item.trafficLight" class="tk-layout-wo-trafficLight">
      <div class="tk-item-content">
        <div class="tk-item-field-name">
          {{ item.fieldLabel_en }}
        </div>
        <div class="tk-item-field-value">
          {{ item.answerLabel_en }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

@Component
export default class TKSurveyItem extends Vue {
  @Prop()
  readonly item!: { [key: string]: string };

  readonly isOK = this.item.trafficLightColor === "green";
  readonly isWarning =
    this.item.trafficLightColor === "" ||
    this.item.trafficLightColor === "orange";
  readonly isCritical = this.item.trafficLightColor === "red";
}
</script>

<style scoped>
.tk-item-content {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
}

.tk-item-field-name {
  font-weight: bold;
  font-size: 11px;
  color: #999;
  flex-grow: 1;
  line-height: 2.727;
}

.tk-item-field-value {
  font-weight: bold;
  font-size: 11px;
  color: #333;
}

.tk-layout-w-trafficlight {
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
