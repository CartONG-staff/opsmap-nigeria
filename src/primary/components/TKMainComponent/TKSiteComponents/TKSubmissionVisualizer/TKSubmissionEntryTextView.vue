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
    <TKSubmissionEntryTrafficLightComponent
      :trafficLight="entry.trafficLight"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";

import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import { TKSubmissionEntryText } from "@/domain/survey/TKSubmissionEntry";
import TKSubmissionEntryTrafficLightComponent from "./TKSubmissionEntryTrafficLightComponent.vue";
@Component({
  components: {
    TKSubmissionEntryTrafficLightComponent
  }
})
export default class TKSubmissionentryView extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntryText;

  question = "";
  answer = "";

  get locale() {
    return this.$root.$i18n.locale;
  }

  @Watch("entry", { immediate: true })
  onentryChanged() {
    this.handleLocale();
  }

  @Watch("$root.$i18n.locale")
  handleLocale() {
    // Question Answer
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
