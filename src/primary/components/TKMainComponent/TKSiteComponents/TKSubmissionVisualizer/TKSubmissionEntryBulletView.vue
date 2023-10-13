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
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";

import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import { TKSubmissionEntryBullet } from "@/domain/survey/TKSubmissionEntry";

@Component
export default class TKSubmissionentryView extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntryBullet;

  question = "";
  answers: Array<string> = [];

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
