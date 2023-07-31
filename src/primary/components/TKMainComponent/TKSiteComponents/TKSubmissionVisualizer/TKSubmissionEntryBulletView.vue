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
    <ul class="tk-entry-field-value tk-entry-field-value--list">
      <li v-for="(answer, key) in answers" :key="key">
        <transition mode="out-in" name="fade-in">
          <div :key="answer">
            {{
              answer !== "" ? (isNaN(+answer) ? answer : $n(answer)) : answer
            }}
          </div>
        </transition>
      </li>
    </ul>

    <div>
      <div class="tk-trafficlight-container">
        <div v-if="displayTrafficLight">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <div
                v-bind="attrs"
                v-on="on"
                class="tk-trafficlight"
                :style="trafficLight"
              ></div>
            </template>
            <span>{{ $t(trafficLightCategory) }}</span>
          </v-tooltip>
        </div>
        <div v-else class="tk-trafficlight"></div>
      </div>
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
import { TKSubmissionEntryBullet } from "@/domain/survey/TKSubmissionEntry";

@Component
export default class TKSubmissionentryView extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntryBullet;

  question = "";
  answers: Array<string> = [];
  displayTrafficLight = false;
  trafficLightCategory = "";
  trafficLight = {
    backgroundColor: "none"
  };

  get locale() {
    return this.$root.$i18n.locale;
  }

  @Watch("entry", { immediate: true })
  onentryChanged() {
    this.trafficLight.backgroundColor = getColorFromValue(
      this.entry.trafficLight
    );
    this.trafficLightCategory = getTradIndexFromValue(this.entry.trafficLight);
    this.entry.trafficLight ? this.entry.isAnswered : false;
    this.handleLocale();
  }

  @Watch("$root.$i18n.locale")
  handleLocale() {
    if (this.entry && this.entry.fieldLabel && this.entry.answersLabels) {
      this.question = TKGetLocalValue(
        this.entry.fieldLabel,
        this.$root.$i18n.locale
      );
      this.answers = this.entry.answersLabels.map(label => {
        return TKGetLocalValue(label, this.$root.$i18n.locale);
      });
    } else {
      this.question = "";
      this.answers = [];
    }
  }
}
</script>

<style>
.tk-entry-field-value--list {
  list-style: none;
}
.tk-entry-field-value > li {
  width: 100%;
}
</style>
