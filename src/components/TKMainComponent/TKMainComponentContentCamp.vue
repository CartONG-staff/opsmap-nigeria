<template>
  <div>
    <TKSubmissionVisualizer
      :visualizerOptions="visualizerOptions"
      :dataset="dataset"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  TKSubmissionVisualizer,
  TKSubmissionVisualizerOptions
} from "./TKCampComponents";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
@Component({
  components: {
    TKSubmissionVisualizer
  }
})
export default class TKMainComponentLeftCamp extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;

  @Prop()
  readonly visualizerOptions!: TKSubmissionVisualizerOptions;
}
</script>

<style scoped></style>
