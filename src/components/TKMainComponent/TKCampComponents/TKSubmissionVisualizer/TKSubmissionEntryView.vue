<template lang="html">
  <div class="tk-submission-entry-container">
    <div v-if="entry.trafficLight" class="tk-layout-w-trafficlight">
      <div class="tk-entry-content">
        <div class="tk-entry-field-name">
          {{ question }}
        </div>
        <div class="tk-entry-field-value">
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

    <div v-if="!entry.trafficLight" class="tk-layout-wo-trafficLight">
      <div class="tk-entry-content">
        <div class="tk-entry-field-name">
          {{ question }}
        </div>
        <div class="tk-entry-field-value">
          {{ answer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";
import { TKTrafficLightColors } from "@/domain/core/TKTrafficLight";
import { TKSubmissionEntry } from "@/domain/core/TKSubmissionEntry";
@Component
export default class TKSubmissionentryView extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntry;

  question = "";
  answer = "";

  isOK = false;
  isWarning = false;
  isDanger = false;
  isCritical = false;
  isOther = false;

  @Watch("entry", { immediate: true })
  onentryChanged() {
    this.isOK = this.entry
      ? this.entry.trafficLightColor === TKTrafficLightColors.OK
      : false;
    this.isWarning = this.entry
      ? this.entry.trafficLightColor === TKTrafficLightColors.WARNING
      : false;
    this.isDanger = this.entry
      ? this.entry.trafficLightColor === TKTrafficLightColors.DANGER
      : false;
    this.isCritical = this.entry
      ? this.entry.trafficLightColor === TKTrafficLightColors.CRITICAL
      : false;
    this.isOther =
      !this.isOK && !this.isWarning && !this.isDanger && !this.isCritical;

    this.handleLocale();
  }

  @Watch("$root.$i18n.locale", { immediate: true })
  handleLocale() {
    if (this.entry) {
      if (this.$root.$i18n.locale === "pt") {
        this.question = this.entry.fieldLabelPt
          ? this.entry.fieldLabelPt
          : this.entry.fieldLabelEn;
        this.answer = this.entry.answerLabelPt
          ? this.entry.answerLabelPt
          : this.entry.answerLabelEn;
      } else {
        this.question = this.entry.fieldLabelEn;
        this.answer = this.entry.answerLabelEn;
      }
    } else {
      this.question = "";
      this.answer = "";
    }
  }
}
</script>

<style scoped>
.tk-entry-content {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  min-height: 30px;
  padding: 5px;
}

.tk-entry-field-name {
  font-weight: bold;
  font-size: 11px;
  color: #999;
  flex-grow: 1;
  margin-right: 5px;
  text-align: justify;
  text-justify: inter-word;
}

.tk-entry-field-value {
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
