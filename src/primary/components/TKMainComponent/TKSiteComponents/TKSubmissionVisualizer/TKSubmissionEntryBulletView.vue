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
                :style="trafficLightStyle"
              ></div>
            </template>
            <span>{{ $t(trafficLightText) }}</span>
          </v-tooltip>
        </div>
        <div v-else class="tk-trafficlight"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";

import { TKGetLocalValue, TKLabel } from "@/domain/utils/TKLabel";
import { TKSubmissionEntryBullet } from "@/domain/survey/TKSubmissionEntry";

@Component
export default class TKSubmissionentryView extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntryBullet;

  question = "";
  answers: Array<string> = [];
  trafficLightText = "";
  displayTrafficLight = false;
  trafficLightLabel: TKLabel = {};
  trafficLightStyle = {
    backgroundColor: "none"
  };

  get locale() {
    return this.$root.$i18n.locale;
  }

  @Watch("entry", { immediate: true })
  onentryChanged() {
    if (this.entry && this.entry.trafficLight) {
      this.displayTrafficLight = true;
      this.trafficLightStyle.backgroundColor = this.entry.trafficLight.value.color;
      this.trafficLightLabel = this.entry.trafficLight.value.label;
    } else {
      this.displayTrafficLight = false;
      this.trafficLightStyle.backgroundColor = "none";
      this.trafficLightLabel = {};
    }
    this.handleLocale();
  }

  @Watch("$root.$i18n.locale")
  handleLocale() {
    // Question Answer
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

    // Traffic Light
    if (this.entry && this.entry.trafficLight) {
      this.trafficLightText = TKGetLocalValue(
        this.entry.trafficLight.value.label,
        this.$root.$i18n.locale
      );
    } else {
      this.trafficLightText = "";
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
