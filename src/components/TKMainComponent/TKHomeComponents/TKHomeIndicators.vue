<template>
  <div class="tk-home-indicators">
    <TKIndicatorComponent :backgroundType="1" :indicator="indicator1" />
    <TKIndicatorComponent :backgroundType="2" :indicator="indicator2" />
    <TKIndicatorComponent :backgroundType="3" :indicator="indicator3" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import TKIndicatorComponent from "../TKIndicator.vue";
import { TKSurvey } from "@/domain/survey/TKSurvey";
import { TKIndicator } from "@/domain/ui/TKIndicator";
import { TKDatasetFilterer } from "@/domain/survey/TKFilters";
@Component({
  components: {
    TKIndicatorComponent
  }
})
export default class TKHomeIndicators extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;
  survey: TKSurvey | null = null;

  indicator1: TKIndicator | null = null;
  indicator2: TKIndicator | null = null;
  indicator3: TKIndicator | null = null;

  @Watch("dataset", { immediate: true })
  onSurveyChanged() {
    if (this.dataset?.hasActiveSurvey()) {
      this.survey = this.dataset.surveys[this.dataset.currentSurvey];
      this.indicator1 = this.survey.indicators[0];
      this.indicator2 = this.survey.indicators[1];
      this.indicator3 = this.survey.indicators[2];
    }
  }
}
</script>

<style scoped>
.tk-home-indicators {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
}

.tk-home-indicators > * {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
  width: 30%;
  border-radius: 15px;
}
</style>
