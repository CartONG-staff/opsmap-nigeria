<template lang="html">
  <div class="tk-submission-item-container">
    <div v-if="item.trafficLight" class="tk-layout-w-trafficlight">
      <div class="tk-item-content">
        <div class="tk-item-field-name">
          {{ question }}
        </div>
        <div class="tk-item-field-value">
          {{ answer }}
        </div>
        <div class="tk-trafficlight">
          <div v-if="isOK" class="tk-trafficlight-ok"></div>
          <div v-if="isWarning" class="tk-trafficlight-warning"></div>
          <div v-if="isDanger" class="tk-trafficlight-danger"></div>
          <div v-if="isCritical" class="tk-trafficlight-critical"></div>
          <div v-if="isOther" class="tk-trafficlight-other"></div>
        </div>
      </div>
    </div>

    <div v-if="!item.trafficLight" class="tk-layout-wo-trafficLight">
      <div class="tk-item-content">
        <div class="tk-item-field-name">
          {{ question }}
        </div>
        <div class="tk-item-field-value">
          {{ answer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";
import { TKTrafficLightColors } from "@/domain/core/TKTrafficLightColors";
import { TKSubmissionItem } from "@/domain/core/TKSubmissionItem";
@Component
export default class TKSubmissionItemView extends Vue {
  @Prop()
  readonly item!: TKSubmissionItem;

  question = "";
  answer = "";

  isOK = false;
  isWarning = false;
  isDanger = false;
  isCritical = false;
  isOther = false;

  @Watch("item", { immediate: true })
  onItemChanged() {
    this.isOK = this.item
      ? this.item.trafficLightColor === TKTrafficLightColors.OK
      : false;
    this.isWarning = this.item
      ? this.item.trafficLightColor === TKTrafficLightColors.WARNING
      : false;
    this.isDanger = this.item
      ? this.item.trafficLightColor === TKTrafficLightColors.DANGER
      : false;
    this.isCritical = this.item
      ? this.item.trafficLightColor === TKTrafficLightColors.CRITICAL
      : false;
    this.isOther =
      !this.isOK && !this.isWarning && !this.isDanger && !this.isCritical;

    this.handleLocale();
  }

  @Watch("$root.$i18n.locale", { immediate: true })
  handleLocale() {
    if (this.item) {
      if (this.$root.$i18n.locale === "pt") {
        this.question = this.item.fieldLabelPt
          ? this.item.fieldLabelPt
          : this.item.fieldLabelEn;
        this.answer = this.item.answerLabelPt
          ? this.item.answerLabelPt
          : this.item.answerLabelEn;
      } else {
        this.question = this.item.fieldLabelEn;
        this.answer = this.item.answerLabelEn;
      }
    } else {
      this.question = "";
      this.answer = "";
    }
  }
}
</script>

<style scoped>
.tk-item-content {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  min-height: 30px;
  padding: 5px;
}

.tk-item-field-name {
  font-weight: bold;
  font-size: 11px;
  color: #999;
  flex-grow: 1;
  margin-right: 5px;
  text-align: justify;
  text-justify: inter-word;
}

.tk-item-field-value {
  font-weight: bold;
  font-size: 11px;
  color: #333;
  text-align: justify;
  text-justify: inter-word;
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
  background-color: yellow;
  border-radius: 50%;
  margin: 0 auto;
}

.tk-trafficlight-danger {
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

.tk-trafficlight-other {
  height: 8px;
  width: 8px;
  background-color: purple;
  border-radius: 50%;
  margin: 0 auto;
}
</style>
