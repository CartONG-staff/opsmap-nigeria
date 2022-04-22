<template>
  <transition mode="out-in" name="fade-in">
    <div :key="$root.$i18n.locale" class="tk-home-subtitle">
      {{ $t("home.lastUpdate") }}: {{ lastUpdate }}
    </div>
  </transition>
</template>

<script lang="ts">
import { TKDateCompare } from "@/domain/utils/TKDate";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class TKHomeSubtitle extends Vue {
  lastUpdate = "";

  get dataset() {
    return TKDatasetModule.dataset;
  }

  @Watch("dataset", { immediate: true })
  onSurveyChanged() {
    if (TKDatasetModule.dataset) {
      let lastDate = "01/01/1970";
      for (const surveyIndex in TKDatasetModule.dataset.surveys) {
        const survey = TKDatasetModule.dataset.surveys[surveyIndex];
        for (const camp of survey.camps) {
          const dateCandidate = camp.submissions[0].date;
          if (TKDateCompare(lastDate, dateCandidate) > 0) {
            lastDate = dateCandidate;
          }
        }
      }
      this.lastUpdate = lastDate === "01/01/1970" ? "-" : lastDate;
    }
  }
}
</script>

<style scoped>
.tk-home-subtitle {
  color: var(--v-secondary-base);
  font-size: 11px;
}
</style>
