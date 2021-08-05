<template lang="html">
  <div class="tk-submission-entry-container">
    <TKSubmissionEntryTextView v-if="entry.type === 'text'" :entry="entry" />
    <TKSubmissionEntryAgePyramidChart
      class="tk-chart"
      v-else-if="entry.type === 'age_pyramid'"
      :entry="entry"
    />
    <TKSubmissionEntryDoughnutChart
      class="tk-chart"
      v-else-if="entry.type === 'doughnut'"
      :entry="entry"
    />
    <div v-if="entry.type === 'text'" class="tk-hseparator"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import { TKSubmissionEntry } from "@/domain/survey/TKSubmissionEntry";

import TKSubmissionEntryAgePyramidChart from "./TKSubmissionEntryAgePyramidChart.vue";
import TKSubmissionEntryDoughnutChart from "./TKSubmissionEntryDoughnutChart.vue";
import TKSubmissionEntryTextView from "./TKSubmissionEntryTextView.vue";

@Component({
  components: {
    TKSubmissionEntryAgePyramidChart,
    TKSubmissionEntryDoughnutChart,
    TKSubmissionEntryTextView
  }
})
export default class TKSubmissionentryView extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntry;
}
</script>

<style scoped>
.tk-hseparator {
  background-color: #d8d8d8;
  height: 1px;
  width: 100%;
}

.tk-chart {
  margin-top: -1px;
}
</style>
