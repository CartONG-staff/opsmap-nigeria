<template>
  <div>
    <TKSubmissionVisualizer :visualizerOptions="visualizerOptions" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  TKSubmissionVisualizer,
  TKSubmissionVisualizerOptions
} from "./TKCampComponents";
@Component({
  components: {
    TKSubmissionVisualizer
  }
})
export default class TKMainComponentLeftCamp extends Vue {
  @Prop()
  readonly visualizerOptions!: TKSubmissionVisualizerOptions;
}
</script>

<style scoped></style>
