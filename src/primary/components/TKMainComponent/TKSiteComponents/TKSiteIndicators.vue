<template>
  <div class="tk-site-indicators">
    <TKIndicatorComponent :backgroundType="1" :indicator="indicator1" />
    <TKIndicatorComponent :backgroundType="2" :indicator="indicator2" />
    <TKIndicatorComponent :backgroundType="3" :indicator="indicator3" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import TKIndicatorComponent from "../TKIndicators/TKIndicator.vue";
import { TKIndicatorDefault, TKIndicator } from "@/domain/survey/TKIndicator";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import { arrayLevelToRoot } from "@/domain/opsmapConfig/TKAdminLevel";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";

@Component({
  components: {
    TKIndicatorComponent
  }
})
export default class TKSiteIndicators extends Vue {
  get dataset() {
    return TKDatasetModule.dataset;
  }

  indicator1: TKIndicator | null = this.dataset.currentSurvey
    ? TKIndicatorDefault(this.dataset.currentSurvey.defaultIndicators.site[0])
    : null;
  indicator2: TKIndicator | null = this.dataset.currentSurvey
    ? TKIndicatorDefault(this.dataset.currentSurvey.defaultIndicators.site[1])
    : null;
  indicator3: TKIndicator | null = this.dataset.currentSurvey
    ? TKIndicatorDefault(this.dataset.currentSurvey.defaultIndicators.site[2])
    : null;

  @Watch("dataset.lastModification", { immediate: true })
  onLastModification() {
    if (this.dataset.currentSubmission) {
      this.indicator1 = this.dataset.currentSubmission.indicators[0];
      this.indicator2 = this.dataset.currentSubmission.indicators[1];
      this.indicator3 = this.dataset.currentSubmission.indicators[2];
    } else {
      const levelToTest = arrayLevelToRoot(
        TKConfigurationModule.configuration.mostGranularAdmin
      );
      let found = false;
      for (const level of levelToTest) {
        const admin = this.dataset.getCurrentAdmin(level);
        if (admin) {
          this.indicator1 = this.dataset.currentSurvey.computedIndicators[
            admin.pcode
          ][0];
          this.indicator2 = this.dataset.currentSurvey.computedIndicators[
            admin.pcode
          ][1];
          this.indicator3 = this.dataset.currentSurvey.computedIndicators[
            admin.pcode
          ][2];

          found = true;
          break;
        }
      }

      if (!found) {
        this.indicator1 = this.dataset.currentSurvey.computedIndicators[""][0];
        this.indicator2 = this.dataset.currentSurvey.computedIndicators[""][1];
        this.indicator3 = this.dataset.currentSurvey.computedIndicators[""][2];
      }
    }
  }
}
</script>

<style scoped>
.tk-site-indicators {
  display: flex;
  flex-flow: row wrap;
  justify-content: left;
  align-items: top;
  column-gap: 5%;
  row-gap: 10px;
}

.tk-site-indicators > * {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
  width: 30%;
  border-radius: 15px;
}
</style>
