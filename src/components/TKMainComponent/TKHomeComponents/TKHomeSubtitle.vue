<template>
  <transition mode="out-in" name="fade-in">
    <div :key="$root.$i18n.locale" class="tk-home-subtitle">
      {{ $t("home.lastUpdate") }}: {{ lastUpdate }}
    </div>
  </transition>
</template>

<script lang="ts">
import { TKDatasetFilterer } from "@/domain/survey/TKFilters";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class TKHomeSubtitle extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;

  lastUpdate = "";

  @Watch("dataset", { immediate: true })
  onSurveyChanged() {
    let lastDate = new Date(1970, 1, 1);

    for (const surveyIndex in this.dataset.surveys) {
      const survey = this.dataset.surveys[surveyIndex];
      for (const campIndex in survey.submissionsByCamps) {
        for (const dateIndex in survey.submissionsByCamps[campIndex]) {
          const items = dateIndex.split("/");
          const year = Number(items[2]) + 2000;
          const month = Number(items[1]);
          const day = Number(items[0]);
          if (
            lastDate.getFullYear() < year ||
            (lastDate.getFullYear() === year && lastDate.getMonth() < month) ||
            (lastDate.getFullYear() === year &&
              lastDate.getMonth() === month &&
              lastDate.getDay() < day)
          ) {
            lastDate = new Date(year, month - 1, day);
          }
        }
      }
    }
    this.lastUpdate = lastDate.toLocaleDateString("en-GB");
  }
}
</script>

<style scoped>
.tk-home-subtitle {
  color: var(--v-secondary-base);
  font-size: 11px;
}
</style>
