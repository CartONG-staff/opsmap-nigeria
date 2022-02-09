<template>
  <div>
    <TKSubmissionVisualizer
      :visualizerOptions="visualizerOptions"
      :pdfInfos="pdfInfos"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  TKSubmissionVisualizer,
  TKSubmissionVisualizerOptions
} from "./TKCampComponents";
import { TKPDFInfos } from "@/domain/survey/TKPDFInfos";
@Component({
  components: {
    TKSubmissionVisualizer
  }
})
export default class TKMainComponentLeftCamp extends Vue {
  @Prop()
  readonly visualizerOptions!: TKSubmissionVisualizerOptions;

  @Prop()
  readonly pdfInfos!: TKPDFInfos;
}
</script>

<style scoped></style>
