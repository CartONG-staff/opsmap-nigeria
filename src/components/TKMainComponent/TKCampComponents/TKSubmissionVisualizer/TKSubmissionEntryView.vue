<template lang="html">
  <div class="tk-submission-entry-container">
    <TKSubmissionEntryTextView v-if="entryText" :entry="entryText" />
    <TKSubmissionEntryAgePyramidChart
      class="tk-chart"
      v-if="entryAgePyramid"
      :entry="entryAgePyramid"
    />
    <div v-if="entryText" class="tk-hseparator"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";
import {
  TKSubmissionEntry,
  TKSubmissionEntryText,
  TKSubmissionEntryAgePyramid
} from "@/domain/core/TKSubmissionEntry";

import TKSubmissionEntryAgePyramidChart from "./TKSubmissionEntryAgePyramidChart.vue";
import TKSubmissionEntryTextView from "./TKSubmissionEntryTextView.vue";

@Component({
  components: {
    TKSubmissionEntryAgePyramidChart,
    TKSubmissionEntryTextView
  }
})
export default class TKSubmissionentryView extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntry;

  entryText: TKSubmissionEntryText | null = null;
  entryAgePyramid: TKSubmissionEntryAgePyramid | null = null;

  @Watch("entry", { immediate: true })
  onentryChanged() {
    this.entryText = null;
    this.entryAgePyramid = null;

    if (this.entry instanceof TKSubmissionEntryText) {
      this.entryText = this.entry;
    } else if (this.entry instanceof TKSubmissionEntryAgePyramid) {
      this.entryAgePyramid = this.entry;
    }
  }
}
</script>

<style scoped>
.tk-hseparator {
  background-color: #d8d8d8;
  height: 1px;
  width: 100%;
}

.tk-chart {
  margin-top: -2px;
}

</style>
