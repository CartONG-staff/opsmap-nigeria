<template lang="html">
  <div class="tk-submission-entry-container">
    <TKSubmissionEntryTextView v-if="entryText" :entry="entryText" />
    <!-- <TKSubmissionEntryAgePyramidChart
      v-if="entryAgePyramid"
      :entry="entryAgePyramid"
    /> -->
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
.tk-entry-content {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  min-height: 30px;
  padding: 5px;
}

.tk-entry-field-name {
  font-weight: bold;
  font-size: 11px;
  color: #999;
  flex-grow: 1;
  margin-right: 5px;
  text-align: justify;
  text-justify: inter-word;
}

.tk-entry-field-value {
  font-weight: bold;
  font-size: 11px;
  color: #333;
  text-align: justify;
  text-justify: inter-word;
}

.tk-layout-w-trafficlight {
  margin-right: -20px;
}

.tk-trafficlight {
  width: 20px;
  text-align: center;
  height: 100%;
}

.tk-trafficlight-ok {
  height: 8px;
  width: 8px;
  background-color: green;
  border-radius: 50%;
  margin: 0 auto;
}

.tk-trafficlight-warning {
  height: 8px;
  width: 8px;
  background-color: yellow;
  border-radius: 50%;
  margin: 0 auto;
}

.tk-trafficlight-danger {
  height: 8px;
  width: 8px;
  background-color: orange;
  border-radius: 50%;
  margin: 0 auto;
}

.tk-trafficlight-critical {
  height: 8px;
  width: 8px;
  background-color: #e91d1d;
  border-radius: 50%;
  margin: 0 auto;
}

.tk-trafficlight-other {
  height: 8px;
  width: 8px;
  background-color: purple;
  border-radius: 50%;
  margin: 0 auto;
}
</style>
