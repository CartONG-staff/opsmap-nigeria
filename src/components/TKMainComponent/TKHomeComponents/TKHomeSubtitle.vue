<template>
  <transition mode="out-in" name="fade-in">
    <div :key="$root.$i18n.locale" class="tk-home-subtitle">
      {{ $t("home.lastUpdate") }}: {{ lastUpdate }}
    </div>
  </transition>
</template>

<script lang="ts">
import { TKDataset } from "@/domain/survey/TKDataset";
import { TKDateCompare } from "@/domain/utils/TKDate";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class TKHomeSubtitle extends Vue {
  @Prop()
  readonly dataset!: TKDataset;

  lastUpdate = "";

  @Watch("dataset", { immediate: true })
  onSurveyChanged() {
    let lastDate = "01/01/1970";
    for (const surveyIndex in this.dataset.surveys) {
      const survey = this.dataset.surveys[surveyIndex];
      for (const camp of survey.camps) {
        const dateCandidate = camp.submissions[0].date;
        if (TKDateCompare(lastDate, dateCandidate) > 0) {
          lastDate = dateCandidate;
        }
      }
    }
    this.lastUpdate = lastDate;
  }
}
</script>

<style scoped>
.tk-home-subtitle {
  color: var(--v-secondary-base);
  font-size: 11px;
}
</style>
