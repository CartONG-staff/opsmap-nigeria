<template>
  <transition mode="out-in" name="fade-in">
    <div :key="$root.$i18n.locale" class="tk-home-subtitle">
      {{ $t("home.lastUpdate") }}: {{ lastUpdate }}
    </div>
  </transition>
</template>

<script lang="ts">
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
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
      for (const camp of survey.camps) {
        for (const dateIndex in camp.submissions) {
          const items = dateIndex.split("/");
          if (items.length === 3) {
            let year = parseInt(items[2]);
            year = year < 100 ? year + 2000 : year;

            const date = new Date(
              year,
              parseInt(items[1]) - 1,
              parseInt(items[0])
            );

            if (date > lastDate) {
              lastDate = date;
            }
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
