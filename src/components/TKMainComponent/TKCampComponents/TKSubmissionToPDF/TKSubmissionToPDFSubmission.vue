<template>
  <div class="submission"></div>
</template>

<script lang="ts">
import { TKOpsmapConfiguration } from "@/domain";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKSubmissionVisualizerOptions } from "../TKSubmissionVisualizer";

@Component({})
export default class TKSubmissionToPDFHeader extends Vue {
  @Prop()
  readonly visualizerOptions!: TKSubmissionVisualizerOptions;

  @Prop()
  readonly dataset!: TKDatasetFilterer;

  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;
}
</script>

<style scoped>
/* Submission ************************************************************/
.submission {
  background-color: royalblue;
  height: 15mm;
  width: 100%;
}
</style>
