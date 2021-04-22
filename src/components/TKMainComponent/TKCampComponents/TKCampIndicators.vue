<template>
  <div class="tk-camp-indicators">
    <TKIndicatorComponent :backgroundType="1" :indicator="this.indicator1" />
    <TKIndicatorComponent :backgroundType="2" :indicator="this.indicator2" />
    <TKIndicatorComponent :backgroundType="3" :indicator="this.indicator3" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { TKOpsmapConfiguration } from "@/domain/opsmapConfig/TKOpsmapConfiguration";
import TKIndicatorComponent from "../TKIndicator.vue";
import { TKSubmission } from "@/domain/survey/TKSubmission";

@Component({
  components: {
    TKIndicatorComponent
  }
})
export default class TKCampIndicators extends Vue {
  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;

  @Prop()
  readonly submission!: TKSubmission;

  indicator1 = this.submission.indicators[0];
  indicator2 = this.submission.indicators[1];
  indicator3 = this.submission.indicators[2];

  @Watch("submission")
  onSubmissionChanged() {
    if (this.submission) {
      this.indicator1 = this.submission.indicators[0];
      this.indicator2 = this.submission.indicators[1];
      this.indicator3 = this.submission.indicators[2];
    } else {
      this.indicator1 = {
        nameLabel: this.appConfig.indicatorsDescription.site[0].name,
        valueLabel: { name: "", labelEn: "-" },
        iconOchaName: this.indicator1.iconOchaName
      };
      this.indicator2 = {
        nameLabel: this.appConfig.indicatorsDescription.site[1].name,
        valueLabel: { name: "", labelEn: "-" },
        iconOchaName: this.indicator2.iconOchaName
      };
      this.indicator3 = {
        nameLabel: this.appConfig.indicatorsDescription.site[2].name,
        valueLabel: { name: "", labelEn: "-" },
        iconOchaName: this.indicator3.iconOchaName
      };
    }
  }
}
</script>

<style scoped>
.tk-camp-indicators {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
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
