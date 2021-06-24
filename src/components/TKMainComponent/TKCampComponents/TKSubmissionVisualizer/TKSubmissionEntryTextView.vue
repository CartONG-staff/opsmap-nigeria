<template lang="html">
  <div class="tk-submission-entry-container">
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

    <div>
      <div class="tk-trafficlight">
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <div
              v-if="isOK"
              v-bind="attrs"
              v-on="on"
              class="tk-trafficlight-ok"
            ></div>
          </template>
          <span>{{ $t("trafficlight.ok") }}</span>
        </v-tooltip>
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <div
              v-if="isWarning"
              v-bind="attrs"
              v-on="on"
              class="tk-trafficlight-warning"
            ></div>
          </template>
          <span>{{ $t("trafficlight.warning") }}</span>
        </v-tooltip>
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <div
              v-if="isDanger"
              v-bind="attrs"
              v-on="on"
              class="tk-trafficlight-danger"
            ></div>
          </template>
          <span>{{ $t("trafficlight.danger") }}</span>
        </v-tooltip>
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <div
              v-if="isCritical"
              v-bind="attrs"
              v-on="on"
              class="tk-trafficlight-critical"
            ></div>
          </template>
          <span>{{ $t("trafficlight.critical") }}</span>
        </v-tooltip>
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <div
              v-if="isOther && displayTrafficLight"
              v-bind="attrs"
              v-on="on"
              class="tk-trafficlight-other"
            ></div>
          </template>
          <span>{{ $t("trafficlight.other") }}</span>
        </v-tooltip>
        <div
          v-if="!displayTrafficLight"
          class="tk-trafficlight tk-trafficlight-none"
        ></div>
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
.tk-submission-entry-container {
  min-width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  min-height: 30px;
  column-gap: 2px;
  font-weight: bold;
  font-size: 11px;
}

.tk-entry-field-name {
  color: #999;
  text-align: left;
  flex-grow: 2;
  overflow: auto;
}

.tk-entry-field-value {
  color: #333;
  text-align: right;
  flex-grow: 2;
}
.tk-trafficlight {
  margin-right: -20px;
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

.tk-trafficlight-none {
  height: 8px;
  width: 8px;
  background-color: none;
  border-radius: 50%;
  margin: 0 auto;
}
</style>
