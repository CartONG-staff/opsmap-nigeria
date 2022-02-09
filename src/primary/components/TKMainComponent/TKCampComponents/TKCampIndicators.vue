<template>
  <div class="tk-camp-indicators">
    <TKIndicatorComponent :backgroundType="1" :indicator="indicator1" />
    <TKIndicatorComponent :backgroundType="2" :indicator="indicator2" />
    <TKIndicatorComponent :backgroundType="3" :indicator="indicator3" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import TKIndicatorComponent from "../TKIndicators/TKIndicator.vue";
import { TKIndicatorDefault, TKIndicator } from "@/domain/survey/TKIndicator";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";

@Component({
  components: {
    TKIndicatorComponent
  }
})
export default class TKCampIndicators extends Vue {
  get dataset() {
    return TKDatasetModule.dataset;
  }

  indicator1: TKIndicator = TKIndicatorDefault(
    TKConfigurationModule.configuration.indicators.site[0]
  );
  indicator2: TKIndicator = TKIndicatorDefault(
    TKConfigurationModule.configuration.indicators.site[1]
  );
  indicator3: TKIndicator = TKIndicatorDefault(
    TKConfigurationModule.configuration.indicators.site[2]
  );

  @Watch("dataset.currentSubmission", { immediate: true })
  onSubmissionChanged() {
    if (this.dataset.currentSubmission) {
      this.indicator1 = this.dataset.currentSubmission.indicators[0];
      this.indicator2 = this.dataset.currentSubmission.indicators[1];
      this.indicator3 = this.dataset.currentSubmission.indicators[2];
    } else {
      this.indicator1 = TKIndicatorDefault(
        TKConfigurationModule.configuration.indicators.site[0]
      );
      this.indicator2 = TKIndicatorDefault(
        TKConfigurationModule.configuration.indicators.site[1]
      );
      this.indicator3 = TKIndicatorDefault(
        TKConfigurationModule.configuration.indicators.site[2]
      );
    }
  }
}
</script>

<style scoped>
.tk-camp-indicators {
  display: flex;
  flex-flow: row wrap;
  justify-content: left;
  align-items: top;
  column-gap: 5%;
  row-gap: 10px;
}

.tk-camp-indicators > * {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
  width: 30%;
  border-radius: 15px;
}
</style>
