<template lang="html">
  <div class="tk-submission-entry-container">
    <div v-if="displayTrafficLight" class="tk-layout-w-trafficlight">
      <div class="tk-entry-content">
        <transition mode="out-in" name="fade-in">
          <div :key="question" class="tk-entry-field-name">
            {{ question }}
          </div>
        </transition>
        <transition mode="out-in" name="fade-in">
          <div :key="answer" class="tk-entry-field-value">
            {{ answer }}
          </div>
        </transition>
        <div class="tk-trafficlight">
          <div v-if="isOK" class="tk-trafficlight-ok"></div>
          <div v-if="isWarning" class="tk-trafficlight-warning"></div>
          <div v-if="isDanger" class="tk-trafficlight-danger"></div>
          <div v-if="isCritical" class="tk-trafficlight-critical"></div>
          <div v-if="isOther" class="tk-trafficlight-other"></div>
        </div>
      </div>
    </div>

    <div v-else class="tk-layout-wo-trafficLight">
      <div class="tk-entry-content">
        <transition mode="out-in" name="fade-in">
          <div :key="question" class="tk-entry-field-name">
            {{ question }}
          </div>
        </transition>
        <transition mode="out-in" name="fade-in">
          <div :key="answer" class="tk-entry-field-value">
            {{ answer }}
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";
import { TKTrafficLightValues } from "@/domain/fdf/TKTrafficLightValues";
import { TKSubmissionEntryText } from "@/domain/survey/TKSubmissionEntryText";
import { TKGetLocalValue } from "@/domain/ui/TKLabel";
@Component
export default class TKSubmissionentryView extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntryText;

  question = "";
  answer = "";
  displayTrafficLight = true;

  isOK = false;
  isWarning = false;
  isDanger = false;
  isCritical = false;
  isOther = false;

  @Watch("entry", { immediate: true })
  onentryChanged() {
    if (this.entry) {
      this.isOK = this.entry
        ? this.entry.trafficLightColor === TKTrafficLightValues.OK
        : false;
      this.isWarning = this.entry
        ? this.entry.trafficLightColor === TKTrafficLightValues.WARNING
        : false;
      this.isDanger = this.entry
        ? this.entry.trafficLightColor === TKTrafficLightValues.DANGER
        : false;
      this.isCritical = this.entry
        ? this.entry.trafficLightColor === TKTrafficLightValues.CRITICAL
        : false;
      this.isOther =
        !this.isOK && !this.isWarning && !this.isDanger && !this.isCritical;
      this.displayTrafficLight =
        this.entry.trafficLight && this.entry.isAnswered();
      this.handleLocale();
    }
  }

  @Watch("$root.$i18n.locale")
  handleLocale() {
    if (this.entry && this.entry.fieldLabel && this.entry.answerLabel) {
      // this.question = this.entry.fieldLabel.getValue(this.$root.$i18n.locale);
      // this.answer = this.entry.answerLabel.getValue(this.$root.$i18n.locale);
      this.question = TKGetLocalValue(
        this.entry.fieldLabel,
        this.$root.$i18n.locale
      );
      this.answer = TKGetLocalValue(
        this.entry.answerLabel,
        this.$root.$i18n.locale
      );
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
