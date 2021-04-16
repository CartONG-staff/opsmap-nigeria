<template>
  <div class="tk-camp-indicators">
    <TKIndicatorComponent :backgroundType="1" :indicator="this.indicator1" />
    <TKIndicatorComponent :backgroundType="2" :indicator="this.indicator2" />
    <TKIndicatorComponent :backgroundType="3" :indicator="this.indicator3" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/core/TKGeneralConfiguration";
import TKIndicatorComponent from "../TKIndicator.vue";
import { TKSubmission } from "@/domain/core/TKSubmission";
@Component({
  components: {
    TKIndicatorComponent
  }
})
export default class TKCampIndicators extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;

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
