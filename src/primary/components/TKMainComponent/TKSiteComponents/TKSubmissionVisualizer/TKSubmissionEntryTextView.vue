<template lang="html">
  <div class="tk-submission-entry-container">
    <transition mode="out-in" name="fade-in">
      <div
        :key="question"
        class="tk-entry-field-name"
        :class="{ 'tk-entry-field-name-arab': locale === 'ar' }"
      >
        {{ question }}
      </div>
    </transition>
    <transition mode="out-in" name="fade-in">
      <div
        :key="answer"
        class="tk-entry-field-value"
        :class="{ 'tk-entry-field-value-arab': locale === 'ar' }"
      >
        {{ answer !== "" ? (isNaN(+answer) ? answer : $n(answer)) : answer }}
      </div>
    </transition>

    <div>
      <transition mode="out-in" name="fade-in">
        <div class="tk-trafficlight-container" :key="displayTrafficLight">
          <div v-if="displayTrafficLight">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <div
                  v-bind="attrs"
                  v-on="on"
                  class="tk-trafficlight"
                  :style="trafficLightColor"
                ></div>
              </template>
              <span>{{ $t(trafficLightCategory) }}</span>
            </v-tooltip>
          </div>
          <div v-else class="tk-trafficlight"></div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";
import {
  getColorFromValue,
  getTradIndexFromValue
} from "@/domain/fdf/TKFDFTrafficLight";
import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import { TKSubmissionEntryText } from "@/domain/survey/TKSubmissionEntry";

@Component
export default class TKSubmissionentryView extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntryText;

  question = "";
  answer = "";
  displayTrafficLight = false;
  trafficLightCategory = "";
  trafficLightColor = {
    backgroundColor: "none"
  };

  get locale() {
    return this.$root.$i18n.locale;
  }

  @Watch("entry", { immediate: true })
  onentryChanged() {
    this.trafficLightColor.backgroundColor = getColorFromValue(
      this.entry.trafficLightColor
    );
    this.trafficLightCategory = getTradIndexFromValue(
      this.entry.trafficLightColor
    );
    this.displayTrafficLight = this.entry.trafficLight && this.entry.isAnswered;
    this.handleLocale();
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
