<template>
  <div class="tk-camp-indicators">
    <TKIndicatorComponent :backgroundType="1" :indicator="indicator1" />
    <TKIndicatorComponent :backgroundType="2" :indicator="indicator2" />
    <TKIndicatorComponent :backgroundType="3" :indicator="indicator3" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { TKOpsmapConfiguration } from "@/app/TKOpsmapConfiguration";
import TKIndicatorComponent from "../TKIndicator.vue";
import { TKIndicator } from "@/domain/ui/TKIndicator";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";

@Component({
  components: {
    TKIndicatorComponent
  }
})
export default class TKCampIndicators extends Vue {
  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;

  @Prop()
  readonly dataset!: TKDatasetFilterer;

  indicator1: TKIndicator | null = null;
  indicator2: TKIndicator | null = null;
  indicator3: TKIndicator | null = null;

  @Watch("dataset.currentSubmission", { immediate: true })
  onSubmissionChanged() {
    if (this.dataset.currentSubmission) {
      this.indicator1 = this.dataset.currentSubmission.indicators[0];
      this.indicator2 = this.dataset.currentSubmission.indicators[1];
      this.indicator3 = this.dataset.currentSubmission.indicators[2];
    } else {
      this.indicator1 = {
        nameLabel: this.appConfig.indicatorsDescription.site[0].name,
        valueLabel: { en: "-" },
        iconOchaName: this.indicator1?.iconOchaName ?? ""
      };
      this.indicator2 = {
        nameLabel: this.appConfig.indicatorsDescription.site[1].name,
        valueLabel: { en: "-" },
        iconOchaName: this.indicator2?.iconOchaName ?? ""
      };
      this.indicator3 = {
        nameLabel: this.appConfig.indicatorsDescription.site[2].name,
        valueLabel: { en: "-" },
        iconOchaName: this.indicator3?.iconOchaName ?? ""
      };
    }
  }
}
</script>

<style scoped>
.tk-camp-indicators {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: top;
  row-gap: 10px;
  column-gap: 10px;
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
